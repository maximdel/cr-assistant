// src/app/api/cards/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: return the stored map of card icons
export async function GET() {
  const records = await prisma.cardImage.findMany();
  return NextResponse.json(records);
}

// POST: fetch the official API and upsert into your DB
export async function POST() {
  const res = await fetch('https://api.clashroyale.com/v1/cards', {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CR_API_TOKEN}`,
    },
  });
  const { items } = await res.json();

  await Promise.all(
    items.map(
      (c: {
        name: string;
        iconUrls: { medium: string; evolutionMedium: string };
      }) =>
        prisma.cardImage.upsert({
          where: { name: c.name },
          update: {
            iconUrl: c.iconUrls.medium,
            evoUrl: c.iconUrls.evolutionMedium || null,
          },
          create: {
            name: c.name,
            iconUrl: c.iconUrls.medium,
            evoUrl: c.iconUrls.evolutionMedium || null,
          },
        })
    )
  );

  return NextResponse.json({ ok: true, count: items.length });
}
