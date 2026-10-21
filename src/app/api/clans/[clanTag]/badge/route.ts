// Not used at the moment: clan badges are served from public/badges/<badgeId>.png
import { normalizeTag } from '@/lib/clashApi';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ clanTag: string }> }
) {
  const tag = normalizeTag((await params).clanTag);
  const base = process.env.CR_API_BASE_URL ?? 'https://api.clashroyale.com/v1';
  const upstream = await fetch(`${base}/clans/${encodeURIComponent(tag)}/badge`, {
    headers: { Authorization: `Bearer ${process.env.CR_API_TOKEN}` },
  });
  if (!upstream.ok) {
    return NextResponse.json({ error: 'Badge not found' }, { status: upstream.status });
  }
  const buf = Buffer.from(await upstream.arrayBuffer());
  return new NextResponse(buf, { headers: { 'Content-Type': 'image/png' } });
}
