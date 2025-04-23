import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || '';
  const opponents = await prisma.player.findMany({
    where: { name: { contains: name.toLowerCase() } },
    include: { encounters: { orderBy: { playedAt: 'desc' }, take: 1 } },
  });
  return NextResponse.json(opponents);
}
