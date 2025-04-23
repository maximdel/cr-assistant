import { NextResponse } from 'next/server';
export async function GET(req: Request) {
  const { name } = Object.fromEntries(new URL(req.url).searchParams);
  const url = `https://api.clashroyale.com/v1/clans?name=${encodeURIComponent(
    name
  )}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
    },
  });
  if (!res.ok)
    return NextResponse.json({ error: 'no clans' }, { status: res.status });
  const { items } = await res.json();
  return NextResponse.json(items.slice(0, 5));
}
