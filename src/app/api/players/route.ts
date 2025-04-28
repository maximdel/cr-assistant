import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || '';
  const clanName = searchParams.get('clan') || '';

  const where: any = {
    name: { contains: name },
  };
  if (clanName) {
    where.clan = {
      name: { contains: clanName },
    };
  }

  const players = await prisma.player.findMany({
    where,
    include: {
      clan: { select: { name: true } },
      encounters: { orderBy: { playedAt: 'desc' }, take: 3 },
    },
    orderBy: { lastSeen: 'desc' },
  });

  return NextResponse.json(players);
}
