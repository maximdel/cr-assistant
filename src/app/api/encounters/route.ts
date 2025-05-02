import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const {
    tag,
    name,
    deck,
    playedAt,
  }: {
    tag: string;
    name?: string;
    deck: any;
    playedAt: string;
  } = await req.json();

  if (!tag || !deck || !playedAt) {
    return NextResponse.json(
      { error: 'tag, deck & playedAt required' },
      { status: 400 }
    );
  }

  // 1) Upsert the player
  const player = await prisma.player.upsert({
    where: { tag },
    update: name ? { name } : {},
    create: { tag, name: name || 'Unknown' },
  });

  // 2) Prepare timestamp
  const when = new Date(playedAt);
  if (isNaN(when.getTime())) {
    return NextResponse.json(
      { error: 'Invalid playedAt timestamp' },
      { status: 400 }
    );
  }

  // 3) Check for existing encounter
  const exists = await prisma.encounter.findFirst({
    where: {
      opponentId: player.id,
      playedAt: when,
    },
  });

  // 4) Insert only if not present
  if (!exists) {
    await prisma.encounter.create({
      data: {
        opponentId: player.id,
        deck,
        playedAt: when,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
