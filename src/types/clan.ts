export interface Clan {
  tag: string;
  name: string;
  clanScore: number;
  badgeId: number;
}

export interface ClanMember {
  tag: string;
  name: string;
  clan?: {
    name: string;
    tag: string;
  };
}
