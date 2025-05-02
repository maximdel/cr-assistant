import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name')?.trim();
  const clanName = searchParams.get('clan')?.trim();

  // build filters only when provided
  const where: any = {};
  if (name) {
    where.name = { contains: name };
  }
  if (clanName) {
    where.clan = { name: { contains: clanName } };
  }

  const players = await prisma.player.findMany({
    where,
    include: {
      clan: { select: { name: true, tag: true } },
      encounters: { orderBy: { playedAt: 'desc' }, take: 3 },
    },
    orderBy: { lastSeen: 'desc' },
    take: 10,
  });

  return NextResponse.json(players);
}
