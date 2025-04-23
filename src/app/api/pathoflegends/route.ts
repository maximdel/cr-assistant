import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("locationId") ?? "57000029";
  const url = `https://api.clashroyale.com/v1/locations/${locationId}/pathoflegend/players`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: res.status }
    );
  }

  return NextResponse.json(await res.json());
}
