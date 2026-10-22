// lib/deck.ts
import type { BattleLogEntry, CardInfo } from '@/types/battle';

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
