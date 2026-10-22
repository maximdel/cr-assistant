'use client';

import { deckArchetype } from '@/lib/archetype';
import type { CardInfo } from '@/types/battle';
import type { Encounter } from '@/types/encounter';
import { useEffect, useState } from 'react';
import DeckDisplay from './DeckDisplay';
import MatchList from './MatchList';
import { Card, EmptyState, SectionTitle, Spinner } from './ui';

type WinLoss = { wins: number; losses: number; draws: number };
type MatchupData = {
  total: number;
  bySimilarity: { [shared: number]: WinLoss };
  myDecks: ({ cards: CardInfo[] } & WinLoss)[];
  matches: Encounter[];
};

const games = (r: WinLoss) => r.wins + r.losses + r.draws;
const winRate = (r: WinLoss) => Math.round((r.wins / Math.max(1, games(r))) * 100);

// Your saved results against decks sharing 6+ cards with `deck`
export default function Matchups({ myTag, deck }: { myTag: string; deck: CardInfo[] }) {
  const [data, setData] = useState<MatchupData | null>(null);
  const names = deck.map((c) => c.name).join(';');

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/matchups?myTag=${encodeURIComponent(myTag)}&deck=${encodeURIComponent(names)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => !cancelled && setData(d));
    return () => {
      cancelled = true;
      setData(null);
    };
  }, [myTag, names]);

  return (
    <Card className="space-y-4">
      <SectionTitle>How you do against this deck</SectionTitle>

      {!data ? (
        <Spinner />
      ) : data.total === 0 ? (
        <EmptyState>
          No saved matches against a deck like this yet (6+ shared cards).
          <br />
          Keep sync on and this fills up as you play.
        </EmptyState>
      ) : (
        <>
          {/* record per similarity level */}
          <div className="grid grid-cols-3 gap-2">
            {[8, 7, 6].map((shared) => {
              const r = data.bySimilarity[shared];
              return (
                <div key={shared} className="rounded-lg bg-surface-2 p-3">
                  <p className="text-xs text-muted">
                    {shared === 8 ? 'Exact deck' : `${shared}/8 cards`}
                  </p>
                  {games(r) ? (
                    <>
                      <p className="text-lg font-bold">
                        <span className="text-win">{r.wins}W</span>{' '}
                        <span className="text-loss">{r.losses}L</span>
                      </p>
                      <p className="text-xs text-muted">{winRate(r)}% win rate</p>
                    </>
                  ) : (
                    <p className="text-lg font-bold text-muted">-</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* your decks against it */}
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">Your decks against it</p>
            <ul className="space-y-2">
              {data.myDecks.map((d, i) => (
                <li key={i} className="flex flex-wrap items-center gap-3">
                  <DeckDisplay cards={d.cards} size="xs" />
                  <span className="text-sm font-medium text-accent">{deckArchetype(d.cards)}</span>
                  <span className="text-sm">
                    <span className="font-semibold text-win">{d.wins}W</span> /{' '}
                    <span className="font-semibold text-loss">{d.losses}L</span>
                    <span className="text-muted"> · {winRate(d)}%</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">Matches</p>
            <MatchList matches={data.matches} />
          </div>
        </>
      )}
    </Card>
  );
}
