// Runs once when the server starts (Next.js instrumentation hook)
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || !process.env.SYNC_TAG) return;
  const { startServerSync } = await import('@/lib/serverSync');
  startServerSync(process.env.SYNC_TAG);
}
