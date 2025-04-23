// src/types/battle.ts

export interface CardInfo {
  name: string;
  id?: number;
  count?: number;
}

export interface TeamMember {
  tag: string;
  name: string;
  crowns: number;
  cards: CardInfo[];
}

export interface BattleLogEntry {
  battleTime: string;
  team: TeamMember[];
  opponent: TeamMember[];
}
