// lib/phonePush.ts
// The latest opponent sent from your phone. The Scout page polls it (/api/shortcut/text).
// Kept on globalThis: different API routes can be separate module copies.

export type PhonePush = { id: number; name: string; clan: string };

const g = globalThis as typeof globalThis & { phonePush?: PhonePush };

export const lastPush = (): PhonePush => g.phonePush ?? { id: 0, name: '', clan: '' };

export function push(name: string, clan: string) {
  // the id changes every time, so pushing the same name twice still triggers a new search
  g.phonePush = { id: Date.now(), name: name.trim(), clan: clan.trim() };
  return g.phonePush;
}
