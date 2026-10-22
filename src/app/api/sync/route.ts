// GET: status of the server auto-sync (tag is null when SYNC_TAG isn't set)
import { serverSyncStatus } from '@/lib/serverSync';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(serverSyncStatus());
}
