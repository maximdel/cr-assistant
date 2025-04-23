export interface Encounter {
  id: number;
  deck: Array<{ name: string; count: number }>;
  playedAt: string;
}
