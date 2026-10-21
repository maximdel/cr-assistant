// The iPhone shortcut POSTs the opponent's name (and clan) read from a screenshot,
// the /playing page polls GET and searches as soon as something new arrives.
import { NextResponse } from 'next/server';

// kept in memory: only the latest push matters
let last = { id: 0, name: '', clan: '' };

export async function GET() {
  return NextResponse.json(last);
}

// Body: { "name": "...", "clan": "..." }
// or { "text": "..." }: raw OCR text, first line = name, second line = clan
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const lines = String(body.text ?? '')
    .split('\n')
    .map((l: string) => l.trim())
    .filter(Boolean);

  last = {
    id: Date.now(), // so pushing the same name twice still triggers a new search
    name: String(body.name ?? lines[0] ?? '').trim(),
    clan: String(body.clan ?? lines[1] ?? '').trim(),
  };
  return NextResponse.json({ ok: true, ...last });
}
