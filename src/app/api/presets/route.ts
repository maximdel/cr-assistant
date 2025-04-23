import { prisma } from '@/lib/prisma';
import type { Preset } from '@/types/preset';
import { NextResponse } from 'next/server';

export async function GET() {
  const presets: Preset[] = await prisma.preset.findMany({
    orderBy: { id: 'desc' },
  });
  return NextResponse.json(presets);
}

export async function POST(req: Request) {
  const { tag, name }: { tag?: string; name?: string } = await req.json();
  if (!tag)
    return NextResponse.json({ error: 'tag required' }, { status: 400 });
  if (!name)
    return NextResponse.json({ error: 'name required' }, { status: 400 });

  const preset: Preset = await prisma.preset.upsert({
    where: { tag },
    update: { name },
    create: { tag, name },
  });
  return NextResponse.json(preset);
}
