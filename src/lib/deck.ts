// lib/deck.ts
import type { CardInfo } from '@/types/battle';

// Same 8 cards in any order -> same key
export const deckKey = (cards: CardInfo[]) =>
  cards.map((c) => c.name).sort().join('|');

// Number of cards two decks have in common (8 = identical deck)
export const sharedCards = (a: CardInfo[], b: CardInfo[]) => {
  const names = new Set(a.map((c) => c.name));
  return b.filter((c) => names.has(c.name)).length;
};

export const averageElixir = (cards: CardInfo[]) => {
  const costs = cards.map((c) => c.elixirCost).filter((e) => e != null);
  if (!costs.length) return null;
  return costs.reduce((sum, e) => sum + e, 0) / costs.length;
};

// Group battles by deck, most played first
export function groupDecks<T>(items: T[], getCards: (item: T) => CardInfo[]) {
  const groups = new Map<string, { cards: CardInfo[]; items: T[] }>();
  for (const item of items) {
    const cards = getCards(item);
    const key = deckKey(cards);
    const group = groups.get(key) ?? { cards, items: [] };
    group.items.push(item);
    groups.set(key, group);
  }
  return [...groups.values()].sort((a, b) => b.items.length - a.items.length);
}
