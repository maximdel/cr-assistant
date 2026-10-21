// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function AdminCardsPage() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function fetchCount() {
    return fetch('/api/cards') // GET returns the stored cards
      .then((res) => res.json())
      .then((cards: unknown[]) => setCount(cards.length))
      .catch(() => setCount(null));
  }

  // load current count on mount
  useEffect(() => {
    fetchCount();
  }, []);

  async function handleSync() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/cards', {
        method: 'POST',
      });
      const data = (await res.json()) as { ok: boolean; count: number };
      if (data.ok) {
        setMessage(`Synced ${data.count} cards.`);
        await fetchCount();
      } else {
        setMessage('Sync failed.');
      }
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Admin: Card Sync</h1>

      <p>
        {count !== null
          ? `Currently stored: ${count} cards.`
          : 'Could not load card count.'}
      </p>

      <button
        onClick={handleSync}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Syncing…' : 'Sync Cards from API'}
      </button>

      {message && <p className="text-gray-700">{message}</p>}
    </main>
  );
}
