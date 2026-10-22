// lib/clashApi.ts
// Server-side helper for the official Clash Royale API.
import { NextResponse } from 'next/server';

const BASE_URL = process.env.CR_API_BASE_URL ?? 'https://api.clashroyale.com/v1';

export class ClashApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// "2rgcuyu", "#2RGCUYU" and "%232RGCUYU" all become "#2RGCUYU"
export function normalizeTag(raw: string) {
  const tag = decodeURIComponent(raw).trim().toUpperCase().replace(/^#/, '');
  return `#${tag}`;
}

// short in-memory cache, for things that don't change every second (leaderboards, locations).
// On globalThis: API routes and instrumentation can be separate module copies.
const g = globalThis as typeof globalThis & {
  clashApiCache?: Map<string, { until: number; data: unknown }>;
};
const cache = (g.clashApiCache ??= new Map());

// Fetch a path like `/players/${encodeURIComponent(tag)}` and return the JSON.
// Pass cacheSeconds to reuse the answer for a while; refresh = fetch anyway and re-cache.
export async function clashApi<T>(path: string, cacheSeconds = 0, refresh = false): Promise<T> {
  const cached = cache.get(path);
  if (!refresh && cached && cached.until > Date.now()) return cached.data as T;

  const data = await fetchApi<T>(path);
  if (cacheSeconds) cache.set(path, { until: Date.now() + cacheSeconds * 1000, data });
  return data;
}

async function fetchApi<T>(path: string): Promise<T> {
  const token = process.env.CR_API_TOKEN;
  if (!token) {
    throw new ClashApiError(500, 'CR_API_TOKEN is not set. Add it to your .env file (see README).');
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // the API tells us which IP it saw, which is exactly what you need to fix your key
    if (body.reason === 'accessDenied.invalidIp') {
      throw new ClashApiError(403, `API key not allowed from this IP. ${body.message ?? ''}`);
    }
    throw new ClashApiError(res.status, body.message ?? body.reason ?? `Clash Royale API error ${res.status}`);
  }
  return res.json();
}

// Turn any error into a JSON response for a route handler
export function errorResponse(err: unknown) {
  if (err instanceof ClashApiError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  // fetch() throws a TypeError when it can't connect at all
  if (err instanceof TypeError && err.message === 'fetch failed') {
    return NextResponse.json(
      { error: "Couldn't reach the Clash Royale API, check the internet connection" },
      { status: 503 }
    );
  }
  console.error(err);
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
}
