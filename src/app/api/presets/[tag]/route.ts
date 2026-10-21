import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ tag: string }> }
) {
  const tag = decodeURIComponent((await params).tag);
  await prisma.preset.deleteMany({ where: { tag } });
  return NextResponse.json({ ok: true });
}
