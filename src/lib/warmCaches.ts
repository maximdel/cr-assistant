// lib/warmCaches.ts
// Keeps what /api/scan needs in memory, so a scan never waits for it: the global
// leaderboard (opponent search), the card list (deck picture) and your own profile
// (to ignore your name on screen). Started from src/instrumentation.ts.
// The paths and cache times must match the ones used where the data is read.
import { clashApi, normalizeTag } from '@/lib/clashApi';

const EVERY = 8 * 60_000; // ms, a bit shorter than the 10 min the leaderboard is cached

export function startCacheWarming() {
  const g = globalThis as typeof globalThis & { cacheWarming?: boolean };
  if (g.cacheWarming) return; // already running (dev hot reload)
  g.cacheWarming = true;

  const myTag = process.env.SYNC_TAG;
  const warm = () =>
    Promise.all([
      clashApi('/locations/global/pathoflegend/players', 600, true),
      clashApi('/cards', 86400, true),
      myTag && clashApi(`/players/${encodeURIComponent(normalizeTag(myTag))}`, 600, true),
    ]).catch((err) => console.error('Cache warming failed:', (err as Error).message));

  warm();
  setInterval(warm, EVERY);
}
