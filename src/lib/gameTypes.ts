// lib/gameTypes.ts
// Groups of battle `type` values from the API battle log.
// Used by the deck filters (Scout, Players) and by the auto-sync (which only saves these).

export const ALL_GAME_TYPES = [
  { key: 'ladder', label: 'Ladder', types: ['PvP'] },
  { key: 'ranked', label: 'Ranked', types: ['pathOfLegend'] },
  { key: 'challenge', label: 'Challenges', types: ['challenge', 'tournament'] },
  // boat battles are left out: they're played against a boat's defense, not a deck
  {
    key: 'war',
    label: 'Clan War',
    types: ['riverRacePvP', 'riverRaceDuel', 'riverRaceDuelColosseum'],
  },
];

// Battle types for a set of selected group keys
export function battleTypesFor(keys: string[]) {
  return ALL_GAME_TYPES.filter((g) => keys.includes(g.key)).flatMap((g) => g.types);
}

export const SYNCED_TYPES = battleTypesFor(ALL_GAME_TYPES.map((g) => g.key));

// names for the battle types we don't sync
const OTHER_LABELS: Record<string, string> = {
  trail: 'Event',
  unknown: 'Event',
  boatBattle: 'Boat battle',
  friendly: 'Friendly',
  clanMate: 'Clan friendly',
  casual1v1: 'Casual',
};

export function gameTypeLabel(type: string) {
  return ALL_GAME_TYPES.find((g) => g.types.includes(type))?.label ?? OTHER_LABELS[type] ?? type;
}
