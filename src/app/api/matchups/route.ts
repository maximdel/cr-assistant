// src/app/api/matchups/route.ts
// How you did against decks like a given one (sharing 6, 7 or all 8 cards).
import { deckKey, sharedCards } from '@/lib/deck';
import { normalizeTag } from '@/lib/clashApi';
import { prisma } from '@/lib/prisma';
import type { CardInfo } from '@/types/battle';
import type { Encounter } from '@/types/encounter';
import { NextResponse } from 'next/server';

const MIN_SHARED = 6;

type WinLoss = { wins: number; losses: number; draws: number };
const emptyRecord = (): WinLoss => ({ wins: 0, losses: 0, draws: 0 });
const count = (r: WinLoss, result: string) => {
  if (result === 'win') r.wins++;
  else if (result === 'loss') r.losses++;
  else r.draws++;
};

// GET ?myTag=#TAG&deck=Card Name;Card Name;... (8 names)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const myTag = searchParams.get('myTag');
  const deck = (searchParams.get('deck') ?? '').split(';').filter(Boolean);
  if (!myTag || deck.length !== 8) {
    return NextResponse.json({ error: 'myTag and an 8 card deck are required' }, { status: 400 });
  }
  const target = deck.map((name) => ({ name }));

  const encounters = (await prisma.encounter.findMany({
    where: { myTag: normalizeTag(myTag) },
    include: {
      opponent: {
        select: { tag: true, name: true, clan: { select: { name: true, badgeId: true } } },
      },
    },
    omit: { raw: true },
    orderBy: { playedAt: 'desc' },
  })) as unknown as Encounter[];

  // keep the matches against similar decks
  const similar = encounters
    .map((e) => ({ ...e, shared: sharedCards(target, e.opponentDeck) }))
    .filter((e) => e.shared >= MIN_SHARED);

  // record per similarity level: 8 = exact deck, 7, 6
  const bySimilarity: { [shared: number]: WinLoss } = { 8: emptyRecord(), 7: emptyRecord(), 6: emptyRecord() };
  for (const e of similar) count(bySimilarity[e.shared], e.result);

  // which of your decks did best against it
  const myDecks = new Map<string, { cards: CardInfo[] } & WinLoss>();
  for (const e of similar) {
    const key = deckKey(e.myDeck);
    const entry = myDecks.get(key) ?? { cards: e.myDeck, ...emptyRecord() };
    count(entry, e.result);
    myDecks.set(key, entry);
  }

  return NextResponse.json({
    total: similar.length,
    bySimilarity,
    myDecks: [...myDecks.values()].sort(
      (a, b) => b.wins + b.losses + b.draws - (a.wins + a.losses + a.draws)
    ),
    matches: similar.slice(0, 10),
  });
}
