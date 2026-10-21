// src/app/api/encounters/route.ts
import type { Prisma } from '@/generated/prisma/client';
import { clashApi, errorResponse, normalizeTag } from '@/lib/clashApi';
import { SYNCED_TYPES } from '@/lib/gameTypes';
import { prisma } from '@/lib/prisma';
import { parseBattleTime, type BattleLogEntry } from '@/types/battle';
import { NextResponse } from 'next/server';

const asJson = (value: unknown) => value as Prisma.InputJsonValue;

// GET ?myTag=#TAG[&opponent=#TAG][&limit=25]: your saved battles, newest first
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const opponent = searchParams.get('opponent');
  const myTag = searchParams.get('myTag');
  const limit = Math.min(Number(searchParams.get('limit')) || 25, 200);

  const encounters = await prisma.encounter.findMany({
    where: {
      ...(opponent ? { opponent: { tag: normalizeTag(opponent) } } : {}),
      ...(myTag ? { myTag: normalizeTag(myTag) } : {}),
    },
    include: {
      opponent: {
        select: { tag: true, name: true, clan: { select: { name: true, badgeId: true } } },
      },
    },
    omit: { raw: true },
    orderBy: { playedAt: 'desc' },
    take: limit,
  });
  return NextResponse.json(encounters);
}

// POST { tag }: pull your battle log from the API and save any new battles
export async function POST(req: Request) {
  const { tag } = (await req.json()) as { tag?: string };
  if (!tag) {
    return NextResponse.json({ error: 'tag required' }, { status: 400 });
  }
  const myTag = normalizeTag(tag);

  let log: BattleLogEntry[];
  try {
    log = await clashApi<BattleLogEntry[]>(`/players/${encodeURIComponent(myTag)}/battlelog`);
  } catch (err) {
    return errorResponse(err);
  }

  // only 1v1 battles of the modes we care about
  const battles = log.filter(
    (b) => SYNCED_TYPES.includes(b.type) && b.team.length === 1 && b.opponent.length === 1
  );

  const newIds: number[] = [];
  for (const b of battles) {
    const me = b.team[0];
    const opp = b.opponent[0];
    const playedAt = parseBattleTime(b.battleTime);

    // 1) Upsert the opponent's clan and the opponent
    const clan = opp.clan
      ? await prisma.clan.upsert({
          where: { tag: opp.clan.tag },
          update: { name: opp.clan.name, badgeId: opp.clan.badgeId },
          create: { tag: opp.clan.tag, name: opp.clan.name, badgeId: opp.clan.badgeId },
        })
      : null;

    const player = await prisma.player.upsert({
      where: { tag: opp.tag },
      update: { name: opp.name, clanId: clan?.id ?? null },
      create: { tag: opp.tag, name: opp.name, clanId: clan?.id },
    });

    // 2) Skip battles we already have
    const exists = await prisma.encounter.findUnique({
      where: { myTag_opponentId_playedAt: { myTag, opponentId: player.id, playedAt } },
      select: { id: true },
    });
    if (exists) continue;

    const created = await prisma.encounter.create({
      data: {
        myTag,
        opponentId: player.id,
        playedAt,
        type: b.type,
        gameMode: b.gameMode?.name ?? 'Unknown',
        result:
          me.crowns > opp.crowns ? 'win' : me.crowns < opp.crowns ? 'loss' : 'draw',
        myCrowns: me.crowns,
        opponentCrowns: opp.crowns,
        trophyChange: me.trophyChange ?? null,
        myDeck: asJson(me.cards),
        opponentDeck: asJson(opp.cards),
        raw: asJson(b),
      },
    });
    newIds.push(created.id);
  }

  return NextResponse.json({ ok: true, saved: newIds.length, newIds, checked: battles.length });
}
