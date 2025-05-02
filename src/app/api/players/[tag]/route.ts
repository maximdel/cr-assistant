import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { tag: string } }
) {
  const { tag } = await params;
  const url = `https://api.clashroyale.com/v1/players/${encodeURIComponent(
    tag
  )}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
    },
  });
  if (!res.ok)
    return NextResponse.json({ error: 'Not found' }, { status: res.status });
  const data = await res.json();
  return NextResponse.json(data);
}
