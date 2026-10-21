'use client';

import { deckKey, groupDecks } from '@/lib/deck';
import { gameTypeLabel } from '@/lib/gameTypes';
import type { BattleLogEntry, CardInfo } from '@/types/battle';
import { FiArrowDown } from 'react-icons/fi';
import DeckDisplay from './DeckDisplay';
import { EmptyState, Pill } from './ui';

// The decks a player used in their battle log: the last used one first
// (the most likely to come at you), then the others, most played first.
// `types` = battle types to keep (falls back to all 1v1 battles if none match).
export function recentDecks(battles: BattleLogEntry[], types: string[]) {
  // 1v1 battles with a normal 8 card deck
  const oneVsOne = battles.filter((b) => b.team.length === 1 && b.team[0].cards.length === 8);
  let shown = oneVsOne.filter((b) => types.includes(b.type));
  const fallback = !shown.length && oneVsOne.length > 0;
  if (fallback) shown = oneVsOne; // better to see some deck than none

  const latest = shown[0]?.team[0].cards ?? null; // the deck used in their most recent battle
  const decks = groupDecks(shown, (b) => b.team[0].cards).sort(
    (a, b) => Number(b.items.includes(shown[0])) - Number(a.items.includes(shown[0]))
  );
  return { decks, latest, fallback };
}

export default function RecentDecks({
  battles,
  types,
  focused,
  onFocus,
}: {
  battles: BattleLogEntry[];
  types: string[];
  focused?: CardInfo[] | null; // deck picked for the matchup section
  onFocus?: (cards: CardInfo[]) => void;
}) {
  const { decks, latest, fallback } = recentDecks(battles, types);

  if (!decks.length) return <EmptyState>No recent 1v1 battles.</EmptyState>;

  return (
    <div className="space-y-3">
      {fallback && (
        <p className="text-xs text-accent">No battles in the selected modes, showing all modes.</p>
      )}
      {decks.map((d) => {
        const wins = d.items.filter((b) => b.team[0].crowns > b.opponent[0].crowns).length;
        const key = deckKey(d.cards);
        const isLatest = !!latest && deckKey(latest) === key;
        const isFocused = !!focused && deckKey(focused) === key;
        return (
          <div
            key={key}
            className={`space-y-3 rounded-xl border p-3 ${
              isFocused ? 'border-primary/60 bg-primary/5' : 'border-border bg-bg/30'
            }`}
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              {isLatest ? (
                <Pill className="bg-win/15 text-win">Last used</Pill>
              ) : (
                <Pill>Also played</Pill>
              )}
              <span className="font-semibold">
                {d.items.length} game{d.items.length === 1 ? '' : 's'}
              </span>
              <span className="text-muted">
                {wins}W / {d.items.length - wins}L · {gameTypeLabel(d.items[0].type)}
              </span>
              {onFocus &&
                (isFocused ? (
                  <span className="ml-auto inline-flex items-center gap-1 text-xs text-primary">
                    Your record vs this deck below <FiArrowDown />
                  </span>
                ) : (
                  <button
                    onClick={() => onFocus(d.cards)}
                    className="ml-auto text-xs text-primary hover:underline"
                  >
                    My record vs this →
                  </button>
                ))}
            </div>
            <DeckDisplay cards={d.cards} size={isLatest ? 'md' : 'sm'} />
          </div>
        );
      })}
    </div>
  );
}
