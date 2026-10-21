'use client';

import { groupDecks } from '@/lib/deck';
import { gameTypeLabel } from '@/lib/gameTypes';
import type { BattleLogEntry } from '@/types/battle';
import DeckDisplay from './DeckDisplay';
import { EmptyState, Pill } from './ui';

// The decks a player used in their battle log, most played first.
// `types` = battle types to keep (falls back to all 1v1 battles if none match).
export default function RecentDecks({
  battles,
  types,
}: {
  battles: BattleLogEntry[];
  types: string[];
}) {
  // 1v1 battles with a normal 8 card deck
  const oneVsOne = battles.filter((b) => b.team.length === 1 && b.team[0].cards.length === 8);
  let shown = oneVsOne.filter((b) => types.includes(b.type));
  const fallback = !shown.length && oneVsOne.length > 0;
  if (fallback) shown = oneVsOne; // better to see some deck than none

  if (!shown.length) return <EmptyState>No recent 1v1 battles.</EmptyState>;

  const decks = groupDecks(shown, (b) => b.team[0].cards);

  return (
    <div className="space-y-4">
      {fallback && (
        <p className="text-xs text-accent">No battles in the selected modes, showing all modes.</p>
      )}
      {decks.map((d, i) => {
        const wins = d.items.filter((b) => b.team[0].crowns > b.opponent[0].crowns).length;
        const isLatest = d.items.includes(shown[0]);
        return (
          <div key={i} className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold">
                {d.items.length} game{d.items.length === 1 ? '' : 's'}
              </span>
              <span className="text-muted">
                {wins}W / {d.items.length - wins}L · {gameTypeLabel(d.items[0].type)}
              </span>
              {isLatest && <Pill className="bg-win/15 text-win">last used</Pill>}
            </div>
            <DeckDisplay cards={d.cards} size={i === 0 ? 'md' : 'sm'} />
          </div>
        );
      })}
    </div>
  );
}
