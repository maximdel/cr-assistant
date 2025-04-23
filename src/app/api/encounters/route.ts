// src/app/api/encounters/route.ts
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
  // upsert opponent
  const opponent = await prisma.player.upsert({
    where: { tag },
    update: name ? { name } : {},
    create: { tag, name: name || 'Unknown' },
  });

  // save the encounter with the actual battleTime
  await prisma.encounter.create({
    data: {
      opponentId: opponent.id,
      deck,
      playedAt: new Date(playedAt),
    },
  });

  return NextResponse.json({ ok: true });
}
