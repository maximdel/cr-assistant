'use client';

import { timeAgo } from '@/lib/format';
import { gameTypeLabel } from '@/lib/gameTypes';
import type { Encounter } from '@/types/encounter';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import ClanBadge from './ClanBadge';
import DeckDisplay from './DeckDisplay';
import { EmptyState, Pill } from './ui';

const RESULT_STYLE = {
  win: { bar: 'bg-win', text: 'text-win', label: 'Win' },
  loss: { bar: 'bg-loss', text: 'text-loss', label: 'Loss' },
  draw: { bar: 'bg-draw', text: 'text-draw', label: 'Draw' },
};

// Saved matches, newest first. Click one to see both decks.
export default function MatchList({
  matches,
  highlight = [],
  empty = 'No matches saved yet.',
}: {
  matches: Encounter[];
  highlight?: number[]; // ids to mark as "new"
  empty?: string;
}) {
  const [openId, setOpenId] = useState<number | null>(null);

  if (!matches.length) return <EmptyState>{empty}</EmptyState>;

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
      {matches.map((m) => {
        const style = RESULT_STYLE[m.result];
        const open = openId === m.id;
        return (
          <li key={m.id}>
            <button
              onClick={() => setOpenId(open ? null : m.id)}
              className="flex w-full items-center gap-3 py-2.5 pr-3 text-left hover:bg-surface-2"
            >
              <span className={`w-1 self-stretch ${style.bar}`} />
              <span className={`w-10 text-sm font-semibold ${style.text}`}>
                {m.myCrowns}-{m.opponentCrowns}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate font-medium">{m.opponent.name}</span>
                  <ClanBadge badgeId={m.opponent.clan?.badgeId} size={16} />
                  {highlight.includes(m.id) && (
                    <Pill className="bg-primary/20 text-primary">new</Pill>
                  )}
                </span>
                <span className="block truncate text-xs text-muted">
                  <bdi>{m.opponent.clan?.name ?? 'No clan'}</bdi> · {gameTypeLabel(m.type)} ·{' '}
                  {timeAgo(m.playedAt)}
                </span>
              </span>
              <span className="hidden md:block">
                <DeckDisplay cards={m.opponentDeck} size="xs" />
              </span>
              {/* always rendered, so the decks line up */}
              <span className={`w-10 text-right text-sm tabular-nums ${style.text}`}>
                {m.trophyChange != null && `${m.trophyChange > 0 ? '+' : ''}${m.trophyChange}`}
              </span>
              <FiChevronDown
                className={`shrink-0 text-muted transition ${open ? 'rotate-180' : ''}`}
              />
            </button>

            {open && (
              <div className="grid gap-6 border-t border-border bg-bg/40 p-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted">Your deck</p>
                  <DeckDisplay cards={m.myDeck} size="sm" showLevels />
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted">
                    {m.opponent.name}’s deck
                  </p>
                  <DeckDisplay cards={m.opponentDeck} size="sm" showLevels />
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
