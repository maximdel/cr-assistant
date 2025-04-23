import { Clan } from './clan';
import { Encounter } from './encounter';

export interface Player {
  id: number;
  tag: string; // e.g. "#2RGCUYU"
  name: string;
  lastSeen: string; // ISO timestamp
  encounters: Encounter[];
  playerClan: Clan[];
}
