import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  context: { params: { tag: string } }
) {
  // context.params.tag is percent‐encoded, e.g. "%23PYUCJJVL"
  const raw = decodeURIComponent(context.params.tag); // -> "#PYUCJJVL" or "PYUCJJVL"

  // ensure a leading "#"
  const tag = raw.startsWith('#') ? raw : `#${raw}`;

  // now build your URL using that clean tag
  const url = `https://api.clashroyale.com/v1/players/${encodeURIComponent(
    tag
  )}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
    },
  });
  if (!res.ok) {
    return NextResponse.json(
      { error: 'Player not found' },
      { status: res.status }
    );
  }

  const data = await res.json();
  const clanName = data.clan?.name ?? null;
  const clanTag = data.clan?.tag ?? null;

  return NextResponse.json({ clanName, clanTag });
}
