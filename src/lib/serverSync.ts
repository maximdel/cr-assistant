// lib/serverSync.ts
// When SYNC_TAG is set (e.g. on a home server), the server saves that player's matches
// every 2 minutes on its own, no open browser needed. Started from src/instrumentation.ts.
import { normalizeTag } from '@/lib/clashApi';
import { syncMatches } from '@/lib/syncMatches';

const EVERY = 120_000; // ms

export type ServerSyncStatus = {
  tag: string | null;
  lastRun: string | null; // ISO
  lastSaved: number;
  newIds: number[];
  error: string | null;
};

// kept on globalThis: route handlers and instrumentation can be separate module copies
const g = globalThis as typeof globalThis & { serverSync?: ServerSyncStatus };

export function serverSyncStatus(): ServerSyncStatus {
  return g.serverSync ?? { tag: null, lastRun: null, lastSaved: 0, newIds: [], error: null };
}

export function startServerSync(tag: string) {
  if (g.serverSync) return; // already running (dev hot reload)
  const status: ServerSyncStatus = (g.serverSync = {
    tag: normalizeTag(tag),
    lastRun: null,
    lastSaved: 0,
    newIds: [],
    error: null,
  });

  const run = async () => {
    try {
      const { saved, newIds } = await syncMatches(status.tag!);
      status.lastSaved = saved;
      if (saved) status.newIds = newIds;
      status.error = null;
    } catch (err) {
      status.error = (err as Error).message;
      console.error('Server sync failed:', status.error);
    }
    status.lastRun = new Date().toISOString();
  };

  console.log(`Server sync on for ${status.tag}, every ${EVERY / 60000} min`);
  run();
  setInterval(run, EVERY);
}
