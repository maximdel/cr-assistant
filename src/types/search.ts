// A possible match for your opponent, from /api/opponents/search
export interface Candidate {
  tag: string;
  name: string;
  clanName?: string;
  clanTag?: string;
  clanBadgeId?: number;
  trophies?: number;
  eloRating?: number;
  lastSeen?: string; // ISO, only known for clan members
  timesPlayed?: number; // your saved battles against them
  sources: string[]; // "Played before", "Clan", "Leaderboard"
  score: number;
}
