import { clashApi, errorResponse } from '@/lib/clashApi';
import { NextResponse } from 'next/server';

type Location = { id: number; name: string; isCountry: boolean; countryCode?: string };

// Countries, for the rankings page (cached for a day, they never change)
export async function GET() {
  try {
    const { items } = await clashApi<{ items: Location[] }>('/locations?limit=300', 86400);
    return NextResponse.json(
      items
        .filter((l) => l.isCountry)
        .map(({ id, name, countryCode }) => ({ id, name, countryCode }))
    );
  } catch (err) {
    return errorResponse(err);
  }
}
