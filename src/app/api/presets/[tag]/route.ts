import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(
  _req: Request,
  { params }: { params: { tag: string } }
) {
  const tag = decodeURIComponent(params.tag);
  await prisma.preset.deleteMany({ where: { tag } });
  return NextResponse.json({ ok: true });
}
