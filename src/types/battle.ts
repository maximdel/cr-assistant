// src/types/battle.ts
// Shapes returned by the Clash Royale API battle log (only the fields we use)

export interface CardInfo {
  name: string;
  id?: number;
  level?: number;
  maxLevel?: number;
  rarity?: string;
  elixirCost?: number;
  starLevel?: number;
  evolutionLevel?: number; // 1 = played as evolution, 2 = played as hero
  maxEvolutionLevel?: number;
  iconUrls?: {
    medium?: string;
    evolutionMedium?: string;
    heroMedium?: string;
  };
}

export interface TeamMember {
  tag: string;
  name: string;
  crowns: number;
  cards: CardInfo[];
  supportCards?: CardInfo[]; // tower troop
  startingTrophies?: number;
  trophyChange?: number;
  elixirLeaked?: number;
  kingTowerHitPoints?: number;
  princessTowersHitPoints?: number[];
  clan?: { tag: string; name: string; badgeId: number };
}

export interface BattleLogEntry {
  type: string; // "PvP" (ladder), "pathOfLegend" (ranked), "challenge", "trail" (events), ...
  battleTime: string; // "20250502T155410.000Z"
  gameMode: { id: number; name: string };
  leagueNumber?: number;
  team: TeamMember[];
  opponent: TeamMember[];
}

// "20250502T155410.000Z" -> Date
export { parseApiTime as parseBattleTime } from '@/lib/format';
