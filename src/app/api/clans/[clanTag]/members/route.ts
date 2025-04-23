import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { clanTag: string } }
) {
  // 1️⃣ Await the params
  const { clanTag } = await context.params;

  // 2️⃣ Normalize to include a single leading '#'
  const tag = clanTag.startsWith('#') ? clanTag : `#${clanTag}`;

  // 3️⃣ Build the external API URL
  const url = `https://api.clashroyale.com/v1/clans/${encodeURIComponent(
    tag
  )}/members`;

  // 4️⃣ Fetch and forward the response
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: 'Could not fetch clan members' },
      { status: res.status }
    );
  }

  const { items } = await res.json();
  return NextResponse.json(items);
}
