// Runs once when the server starts (Next.js instrumentation hook)
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || !process.env.CR_API_TOKEN) return;

  const { startCacheWarming } = await import('@/lib/warmCaches');
  startCacheWarming();

  if (process.env.SYNC_TAG) {
    const { startServerSync } = await import('@/lib/serverSync');
    startServerSync(process.env.SYNC_TAG);
  }
}
