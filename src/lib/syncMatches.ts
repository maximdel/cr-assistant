// lib/syncMatches.ts
// Saves your new battles from the battle log. Used by the "Sync now" button,
// the browser auto-sync and the server auto-sync (see instrumentation.ts).
import type { Prisma } from '@/generated/prisma/client';
import { clashApi, normalizeTag } from '@/lib/clashApi';
import { SYNCED_TYPES } from '@/lib/gameTypes';
import { prisma } from '@/lib/prisma';
import { parseBattleTime, type BattleLogEntry } from '@/types/battle';

const asJson = (value: unknown) => value as Prisma.InputJsonValue;

export async function syncMatches(tag: string) {
  const myTag = normalizeTag(tag);
  const log = await clashApi<BattleLogEntry[]>(`/players/${encodeURIComponent(myTag)}/battlelog`);

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

  return { saved: newIds.length, newIds, checked: battles.length };
}
