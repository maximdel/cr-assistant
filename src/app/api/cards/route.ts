// src/app/api/cards/route.ts
// Not used by the app at the moment (battle log cards have their own icons).
// Kept for now together with /admin, can be removed later.
import { clashApi, errorResponse } from '@/lib/clashApi';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: return the stored card icons
export async function GET() {
  const records = await prisma.cardImage.findMany();
  return NextResponse.json(records);
}

// POST: fetch the official API and upsert into your DB
export async function POST() {
  try {
    const { items } = await clashApi<{
      items: { name: string; iconUrls: { medium: string; evolutionMedium?: string } }[];
    }>('/cards');

    await Promise.all(
      items.map((c) =>
        prisma.cardImage.upsert({
          where: { name: c.name },
          update: { iconUrl: c.iconUrls.medium, evoUrl: c.iconUrls.evolutionMedium || null },
          create: { name: c.name, iconUrl: c.iconUrls.medium, evoUrl: c.iconUrls.evolutionMedium || null },
        })
      )
    );
    return NextResponse.json({ ok: true, count: items.length });
  } catch (err) {
    return errorResponse(err);
  }
}
