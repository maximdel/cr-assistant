import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { tag: string } }
) {
  // await the params before using them
  const { tag } = await context.params;
  const url = `https://api.clashroyale.com/v1/players/${encodeURIComponent(
    tag
  )}/upcomingchests`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Not found' }, { status: res.status });
  }
  const data = await res.json();
  return NextResponse.json(data);
}
