// src/app/api/encounters/last/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const last = await prisma.encounter.findFirst({
    orderBy: { playedAt: 'desc' },
    select: { playedAt: true },
  });
  return NextResponse.json({ playedAt: last?.playedAt ?? null });
}
