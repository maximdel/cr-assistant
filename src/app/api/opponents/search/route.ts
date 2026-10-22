// src/app/api/opponents/search/route.ts
import { searchOpponents } from '@/lib/opponentSearch';
import { NextResponse } from 'next/server';

// GET ?name=...&clan=...&locations=global,57000029
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name')?.trim() ?? '';
  if (!name) return NextResponse.json({ error: 'Enter a name' }, { status: 400 });

  return NextResponse.json(
    await searchOpponents({
      name,
      clan: searchParams.get('clan') ?? '',
      locations: (searchParams.get('locations') || 'global').split(','),
    })
  );
}
