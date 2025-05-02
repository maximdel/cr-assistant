import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, context: { params: { tag: string } }) {
  const rawTag = (await context.params).tag;
  const tag = rawTag.startsWith('#') ? rawTag : `#${rawTag}`;

  const opp = await prisma.player.findUnique({
    where: { tag },
    include: {
      encounters: {
        orderBy: { playedAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!opp || opp.encounters.length === 0) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const last = opp.encounters[0];

  return NextResponse.json({
    deck: last.deck,
    playedAt: last.playedAt.toISOString(),
  });
}
