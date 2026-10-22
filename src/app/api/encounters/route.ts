// src/app/api/encounters/route.ts
import { errorResponse, normalizeTag } from '@/lib/clashApi';
import { prisma } from '@/lib/prisma';
import { syncMatches } from '@/lib/syncMatches';
import { NextResponse } from 'next/server';

// GET ?myTag=#TAG[&opponent=#TAG][&limit=25]: your saved battles, newest first
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const opponent = searchParams.get('opponent');
  const myTag = searchParams.get('myTag');
  const limit = Math.min(Number(searchParams.get('limit')) || 25, 200);

  const encounters = await prisma.encounter.findMany({
    where: {
      ...(opponent ? { opponent: { tag: normalizeTag(opponent) } } : {}),
      ...(myTag ? { myTag: normalizeTag(myTag) } : {}),
    },
    include: {
      opponent: {
        select: { tag: true, name: true, clan: { select: { name: true, badgeId: true } } },
      },
    },
    omit: { raw: true },
    orderBy: { playedAt: 'desc' },
    take: limit,
  });
  return NextResponse.json(encounters);
}

// POST { tag }: pull your battle log from the API and save any new battles
export async function POST(req: Request) {
  const { tag } = (await req.json()) as { tag?: string };
  if (!tag) {
    return NextResponse.json({ error: 'tag required' }, { status: 400 });
  }
  try {
    return NextResponse.json({ ok: true, ...(await syncMatches(tag)) });
  } catch (err) {
    return errorResponse(err);
  }
}
