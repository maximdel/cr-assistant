// lib/archetype.ts
// A short name for a deck, like RoyaleAPI's: its win condition + its play style
// ("Hog Cycle", "Log Bait", "Golem Beatdown", "PEKKA Bridge Spam", "LavaLoon").
// Rules of thumb, not an official list: tweak the tables below when the meta changes.
import { averageElixir } from '@/lib/deck';
import type { CardInfo } from '@/types/battle';

// Cards that take towers, most defining first, with their short name
const WIN_CONDITIONS: [card: string, short: string][] = [
  ['Lava Hound', 'Lava'],
  ['Golem', 'Golem'],
  ['Elixir Golem', 'E-Golem'],
  ['Electro Giant', 'E-Giant'],
  ['Goblin Giant', 'Goblin Giant'],
  ['Three Musketeers', '3M'],
  ['X-Bow', 'X-Bow'],
  ['Mortar', 'Mortar'],
  ['Royal Giant', 'RG'],
  ['Giant', 'Giant'],
  ['P.E.K.K.A', 'PEKKA'],
  ['Graveyard', 'Graveyard'],
  ['Hog Rider', 'Hog'],
  ['Royal Hogs', 'Royal Hogs'],
  ['Ram Rider', 'Ram Rider'],
  ['Battle Ram', 'Ram'],
  ['Balloon', 'Loon'],
  ['Goblin Drill', 'Drill'],
  ['Wall Breakers', 'Wall Breakers'],
  ['Mega Knight', 'MK'], // more of a defender, so after the real win conditions
  ['Goblin Barrel', 'Barrel'],
  ['Skeleton Barrel', 'Skelly Barrel'],
  ['Miner', 'Miner'],
  ['Minion Giant', 'Minion Giant'],
  ['Sparky', 'Sparky'],
  ['Royal Recruits', 'Recruits'],
];

const BEATDOWN = ['Lava Hound', 'Golem', 'Elixir Golem', 'Electro Giant', 'Goblin Giant', 'Giant'];
const SIEGE = ['X-Bow', 'Mortar'];
const BAIT_CARDS = ['Princess', 'Goblin Gang', 'Dart Goblin', 'Skeleton Barrel', 'Rascals', 'Goblin Hut', 'Skeleton Army', 'Spear Goblins'];
const BRIDGE_SPAM = ['Bandit', 'Royal Ghost', 'Battle Ram', 'Ram Rider', 'Magic Archer', 'Prince', 'Dark Prince', 'Elite Barbarians'];

export function deckArchetype(cards: CardInfo[]): string {
  const names = new Set(cards.map((c) => c.name));
  const has = (card: string) => names.has(card);
  const count = (list: string[]) => list.filter(has).length;
  const avg = averageElixir(cards) ?? 4;

  const wins = WIN_CONDITIONS.filter(([card]) => has(card));
  const [main, second] = wins;

  const bridgeSpam = count(BRIDGE_SPAM) >= 3 || (count(BRIDGE_SPAM) >= 2 && avg >= 3.5);

  // well-known combos first
  if (has('Lava Hound') && has('Balloon')) return 'LavaLoon';
  if (has('Giant') && has('Graveyard')) return 'Giant Graveyard';
  if (has('Three Musketeers')) return has('Elixir Collector') ? '3M Pump' : '3M';
  if (has('Goblin Barrel') && count(BAIT_CARDS) >= 1) return 'Log Bait';
  if (!main) return bridgeSpam ? 'Bridge Spam' : avg <= 3 ? 'Cycle' : 'Control';

  const [card, short] = main;
  if (SIEGE.includes(card)) return avg <= 3.2 ? `${short} Cycle` : short;
  if (BEATDOWN.includes(card)) return `${short} Beatdown`;
  if (card === 'P.E.K.K.A' || bridgeSpam) return `${short} Bridge Spam`;
  if (avg <= 3.0) return `${short} Cycle`;
  if (count(BAIT_CARDS) >= 3) return `${short} Bait`;
  // two win conditions, e.g. "Miner Loon", "Hog Ram"
  if (second) return `${short} ${second[1]}`;
  return short;
}
