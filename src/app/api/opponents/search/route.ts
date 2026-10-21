// src/app/api/opponents/search/route.ts
// Find who your opponent is from their name (and clan, if you have it).
//
// Sources, merged and ranked:
// 1) players you've played before (database)
// 2) members of clans matching the clan name. `lastSeen` tells us who is online
//    right now, which is the best hint since your opponent is in a match with you
// 3) Path of Legends leaderboards (global + the countries you pass), for high ranked players
import { clashApi, normalizeTag } from '@/lib/clashApi';
import { nameSimilarity } from '@/lib/names';
import { parseApiTime } from '@/lib/format';
import { prisma } from '@/lib/prisma';
import type { Candidate } from '@/types/search';
import { NextResponse } from 'next/server';

const MIN_SCORE = 0.65;
const CLAN_TAG = /^#?[0289PYLQGRJCUV]{4,}$/i;

type ClanInfo = { tag: string; name: string; badgeId: number };
type Member = { tag: string; name: string; trophies: number; lastSeen: string };
type LeaderboardPlayer = { tag: string; name: string; rank: number; eloRating: number; clan?: ClanInfo };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name')?.trim() ?? '';
  const clan = searchParams.get('clan')?.trim() ?? '';
  const locations = (searchParams.get('locations') || 'global').split(',');

  if (!name) return NextResponse.json({ error: 'Enter a name' }, { status: 400 });

  const found = new Map<string, Candidate>();
  // the same player can come from several sources: merge what each one knows
  const add = (c: Omit<Candidate, 'score' | 'sources'>, source: string) => {
    const score = nameSimilarity(name, c.name);
    if (score < MIN_SCORE) return;
    const existing = found.get(c.tag);
    found.set(c.tag, {
      ...existing,
      ...withoutEmpty(c),
      score,
      sources: [...(existing?.sources ?? []), source],
    });
  };
  const warnings: string[] = [];

  // 1) players you've played before
  const saved = await prisma.player.findMany({
    include: { clan: true, _count: { select: { encounters: true } } },
    orderBy: { lastSeen: 'desc' },
    take: 5000,
  });
  for (const p of saved) {
    add(
      {
        tag: p.tag,
        name: p.name,
        clanName: p.clan?.name,
        clanTag: p.clan?.tag,
        clanBadgeId: p.clan?.badgeId,
        timesPlayed: p._count.encounters,
      },
      'Played before'
    );
  }

  // 2) clan members
  if (clan) {
    try {
      const clans = await findClans(clan);
      if (!clans.length) warnings.push(`No clan found matching “${clan}”.`);
      const memberLists = await Promise.all(
        clans.map((c) =>
          clashApi<{ items: Member[] }>(`/clans/${encodeURIComponent(c.tag)}/members`, 60)
            .then((r) => r.items)
            .catch(() => [] as Member[])
        )
      );
      clans.forEach((c, i) => {
        for (const m of memberLists[i]) {
          add(
            {
              tag: m.tag,
              name: m.name,
              clanName: c.name,
              clanTag: c.tag,
              clanBadgeId: c.badgeId,
              trophies: m.trophies,
              lastSeen: parseApiTime(m.lastSeen).toISOString(),
            },
            'Clan'
          );
        }
      });
    } catch (err) {
      warnings.push((err as Error).message);
    }
  }

  // 3) leaderboards (cached, they're big and don't change much)
  const boards = await Promise.all(
    locations.map((loc) =>
      clashApi<{ items: LeaderboardPlayer[] }>(
        `/locations/${encodeURIComponent(loc)}/pathoflegend/players`,
        600
      )
        .then((r) => r.items)
        .catch(() => [] as LeaderboardPlayer[])
    )
  );
  for (const p of boards.flat()) {
    add(
      {
        tag: p.tag,
        name: p.name,
        clanName: p.clan?.name,
        clanTag: p.clan?.tag,
        clanBadgeId: p.clan?.badgeId,
        eloRating: p.eloRating,
      },
      'Leaderboard'
    );
  }

  // Rank: name match first, then hints (right clan, online right now)
  const ranked = [...found.values()]
    .map((c) => ({ ...c, score: c.score + bonus(c, clan) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  return NextResponse.json({ candidates: ranked, warnings });
}

const withoutEmpty = <T extends object>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null)) as T;

function bonus(c: Candidate, clan: string) {
  let extra = 0;
  if (clan && c.clanName && nameSimilarity(clan, c.clanName) >= 0.8) extra += 0.3;
  if (c.lastSeen) {
    const minutes = (Date.now() - new Date(c.lastSeen).getTime()) / 60000;
    if (minutes < 15) extra += 0.4;
    else if (minutes < 60) extra += 0.15;
    else if (minutes > 24 * 60) extra -= 0.3; // inactive for a day: can't be in a match with you
  }
  if (c.timesPlayed) extra += 0.05;
  return extra;
}

// Clans matching a name (or a clan tag), best name matches first
async function findClans(clan: string): Promise<ClanInfo[]> {
  if (CLAN_TAG.test(clan)) {
    const c = await clashApi<ClanInfo>(`/clans/${encodeURIComponent(normalizeTag(clan))}`, 60);
    return [c];
  }
  if ([...clan].length < 3) {
    throw new Error('The API needs at least 3 characters of the clan name.');
  }
  const { items } = await clashApi<{ items: ClanInfo[] }>(
    `/clans?name=${encodeURIComponent(clan)}&minMembers=2&limit=50`,
    60
  );
  return items
    .map((c) => ({ c, score: nameSimilarity(clan, c.name) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map(({ c }) => c);
}
