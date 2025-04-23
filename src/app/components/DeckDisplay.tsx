'use client';

import { useEffect, useState } from 'react';

type Card = { name: string; count: number };
type CardImage = { name: string; iconUrl: string; evoUrl: string | null };

export default function DeckDisplay({ cards }: { cards: Card[] }) {
  const [iconMap, setIconMap] = useState<Record<string, string>>({});
  const [evoMap, setEvoMap] = useState<Record<string, string>>({});

  // fetch full CardImage records once on mount
  useEffect(() => {
    fetch('/api/cards') // assumes GET /api/cards returns CardImage[]
      .then((r) => r.json())
      .then((data: CardImage[]) => {
        const icons: Record<string, string> = {};
        const evos: Record<string, string> = {};
        data.forEach((c) => {
          icons[c.name] = c.iconUrl;
          if (c.evoUrl) evos[c.name] = c.evoUrl;
        });
        setIconMap(icons);
        setEvoMap(evos);
      })
      .catch(console.error);
  }, []);

  // still loading?
  if (!Object.keys(iconMap).length) {
    return <p>Loading cards…</p>;
  }

  return (
    <ul className="grid grid-cols-4 max-w-[50%]">
      {cards.map((card, idx) => {
        // use evo slot only for first two cards and if we have an evoUrl
        const useEvo = idx < 2 && evoMap[card.name];
        const src = useEvo ? evoMap[card.name] : iconMap[card.name];

        return (
          <li key={idx} className="flex flex-col items-center -my-4">
            <img src={src} alt={card.name} className="object-contain" />
          </li>
        );
      })}
    </ul>
  );
}
