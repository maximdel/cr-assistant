'use client';

import { averageElixir } from '@/lib/deck';
import type { CardInfo } from '@/types/battle';
import Image from 'next/image';
import CopyDeck from './CopyDeck';

// The API gives levels relative to each rarity's max level; the game shows them on a 1-16 scale
const MAX_LEVEL = 16;

// Card art comes with the battle log.
// evolutionLevel: 1 = played as evolution, 2 = played as hero
const cardImage = (card: CardInfo) =>
  (card.evolutionLevel === 1 && card.iconUrls?.evolutionMedium) ||
  (card.evolutionLevel === 2 && card.iconUrls?.heroMedium) ||
  card.iconUrls?.medium;

const SIZES = { xs: 28, sm: 48, md: 72 };

export default function DeckDisplay({
  cards,
  size = 'md',
  showLevels = size === 'md',
}: {
  cards: CardInfo[];
  size?: keyof typeof SIZES;
  showLevels?: boolean;
}) {
  const avg = averageElixir(cards);
  const width = SIZES[size];

  // xs: one compact row, for lists
  if (size === 'xs') {
    return (
      <ul className="flex gap-0.5">
        {cards.map((card, idx) => (
          <li key={idx} title={card.name}>
            <CardArt card={card} width={width} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <ul className="grid w-fit grid-cols-4 gap-1.5">
        {cards.map((card, idx) => (
          <li key={idx} className="relative" title={card.name}>
            <CardArt card={card} width={width} />
            {card.elixirCost != null && (
              <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-elixir text-[11px] font-bold text-white shadow">
                {card.elixirCost}
              </span>
            )}
            {showLevels && card.level != null && card.maxLevel != null && (
              <span className="absolute inset-x-0 bottom-0 mx-auto w-fit rounded bg-black/70 px-1 text-[10px] font-semibold">
                Lv {card.level + MAX_LEVEL - card.maxLevel}
              </span>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        {avg != null && (
          <p className="text-xs text-muted">
            Avg elixir <span className="font-semibold text-elixir">{avg.toFixed(1)}</span>
          </p>
        )}
        <CopyDeck cards={cards} />
      </div>
    </div>
  );
}

function CardArt({ card, width }: { card: CardInfo; width: number }) {
  const src = cardImage(card);
  const special =
    card.evolutionLevel === 1
      ? 'ring-2 ring-elixir/70'
      : card.evolutionLevel === 2
        ? 'ring-2 ring-accent/80'
        : '';
  if (!src) {
    return (
      <span
        className="flex items-center justify-center rounded bg-surface-2 text-center text-[10px]"
        style={{ width, height: Math.round(width * 1.2) }}
      >
        {card.name}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={card.name}
      width={width}
      height={Math.round(width * 1.2)}
      loading="eager" // decks are the point of the page: don't wait for scrolling
      className={`rounded object-contain ${special}`}
    />
  );
}
