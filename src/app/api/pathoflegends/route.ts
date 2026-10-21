import { clashApi, errorResponse } from '@/lib/clashApi';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get('locationId') ?? 'global';
  try {
    return NextResponse.json(
      await clashApi(`/locations/${encodeURIComponent(locationId)}/pathoflegend/players`, 300)
    );
  } catch (err) {
    return errorResponse(err);
  }
}
