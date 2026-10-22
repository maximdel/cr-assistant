// The Scout page polls GET and searches as soon as something new arrives.
// POST is the simple version for a shortcut that already knows the name and clan;
// a shortcut sending a whole screenshot's text should use POST /api/scan instead.
import { lastPush, push } from '@/lib/phonePush';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(lastPush());
}

// Body: { "name": "...", "clan": "..." }
// or { "text": "..." }: first line = name, second line = clan
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const lines = String(body.text ?? '')
    .split('\n')
    .map((l: string) => l.trim())
    .filter(Boolean);

  const sent = push(String(body.name ?? lines[0] ?? ''), String(body.clan ?? lines[1] ?? ''));
  return NextResponse.json({ ok: true, ...sent });
}
