import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: { tag: string } }
) {
  // decode %23 → #
  const { tag } = await params;

  const res = await fetch(
    `https://api.clashroyale.com/v1/players/${encodeURIComponent(tag)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
      },
    }
  );
  if (!res.ok) {
    return NextResponse.json(
      { error: 'Player not found' },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json({
    clanName: data.clan?.name ?? null,
    clanTag: data.clan?.tag ?? null,
  });
}
