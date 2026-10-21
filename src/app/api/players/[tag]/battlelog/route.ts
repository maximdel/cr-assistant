import { clashApi, errorResponse, normalizeTag } from '@/lib/clashApi';
import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ tag: string }> }
) {
  const tag = normalizeTag((await params).tag);
  try {
    return NextResponse.json(
      await clashApi(`/players/${encodeURIComponent(tag)}/battlelog`)
    );
  } catch (err) {
    return errorResponse(err);
  }
}
