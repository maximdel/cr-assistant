'use client';

import type { CardInfo } from '@/types/battle';
import { useState } from 'react';
import { FiCheck, FiCopy, FiExternalLink } from 'react-icons/fi';

// Official deck link: opens the game's deck screen on a phone with Clash Royale.
// Card order is kept, so evolution / hero slots stay where they were.
export const deckLink = (cards: CardInfo[]) =>
  `https://link.clashroyale.com/deck/en?deck=${cards.map((c) => c.id).join(';')}`;

export default function CopyDeck({ cards }: { cards: CardInfo[] }) {
  const [copied, setCopied] = useState(false);
  if (cards.length !== 8 || cards.some((c) => !c.id)) return null;

  const copy = async () => {
    await navigator.clipboard.writeText(deckLink(cards));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span className="inline-flex items-center gap-3 text-xs">
      <button onClick={copy} className="inline-flex items-center gap-1 text-muted hover:text-fg">
        {copied ? <FiCheck className="text-win" /> : <FiCopy />}
        {copied ? 'Copied' : 'Copy deck link'}
      </button>
      <a
        href={deckLink(cards)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-muted hover:text-fg"
        title="Opens the deck in Clash Royale (on your phone)"
      >
        <FiExternalLink /> Open in game
      </a>
    </span>
  );
}
