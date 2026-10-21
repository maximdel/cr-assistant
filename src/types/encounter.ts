import type { CardInfo } from './battle';

// A saved battle, as returned by GET /api/encounters
export interface Encounter {
  id: number;
  myTag: string;
  playedAt: string;
  type: string;
  gameMode: string;
  result: 'win' | 'loss' | 'draw';
  myCrowns: number;
  opponentCrowns: number;
  trophyChange: number | null;
  myDeck: CardInfo[];
  opponentDeck: CardInfo[];
  opponent: {
    tag: string;
    name: string;
    clan: { name: string; badgeId: number } | null;
  };
}
