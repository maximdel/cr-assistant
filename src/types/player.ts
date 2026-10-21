import type { CardInfo } from './battle';

// Player profile from the Clash Royale API (only the fields we use)
export interface PlayerProfile {
  tag: string;
  name: string;
  expLevel?: number;
  trophies: number;
  bestTrophies?: number;
  wins?: number;
  losses?: number;
  arena?: { id: number; name: string };
  clan?: { tag: string; name: string; badgeId: number };
  currentDeck?: CardInfo[];
  currentPathOfLegendSeasonResult?: { leagueNumber: number; trophies: number; rank: number | null };
  bestPathOfLegendSeasonResult?: { leagueNumber: number; trophies: number; rank: number | null };
}

export interface UpcomingChests {
  items: { index: number; name: string }[];
}
