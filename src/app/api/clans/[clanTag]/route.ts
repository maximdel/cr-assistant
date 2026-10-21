// src/app/api/clans/[clanTag]/route.ts
import { clashApi, errorResponse, normalizeTag } from '@/lib/clashApi';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ clanTag: string }> }
) {
  const tag = normalizeTag((await params).clanTag);
  try {
    const clan = await clashApi<{ badgeId: number }>(`/clans/${encodeURIComponent(tag)}`);
    return NextResponse.json({ badgeId: clan.badgeId });
  } catch (err) {
    return errorResponse(err);
  }
}
