'use client';
import { BattleLogEntry } from '@/types/battle';
import { Clan, ClanMember } from '@/types/clan';
import { SearchResult } from '@/types/search';
import { useEffect, useRef, useState } from 'react';
import AutoUploader from '../components/AutoUploader';
import DeckDisplay from '../components/DeckDisplay';

export default function OpponentSearch() {
  const [username, setUsername] = useState('');
  const [clanname, setClanname] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [members, setMembers] = useState<SearchResult[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<any>(null);
  const [selectedResult, setSelectedResult] = useState<SearchResult>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, [username]);

  // 1️⃣ search handler
  const onSearch = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    setMembers([]);
    setSelectedDeck(null);

    // try DB
    const opponentRes = await fetch(
      `/api/opponents?name=${encodeURIComponent(username)}`
    );
    const data: SearchResult[] = await opponentRes.json();
    if (data.length) {
      setResults(data.map((p) => ({ ...p, source: 'db' })));
      setLoading(false);
      return;
    }

    // else by clan
    if (clanname.trim()) {
      const cr = await fetch(
        `/api/clans/search?name=${encodeURIComponent(clanname)}`
      );
      const clans: Clan[] = await cr.json();
      const top5 = clans.slice(0, 5);

      const allMembers = await Promise.all(
        top5.map((c) =>
          fetch(`/api/clans/${encodeURIComponent(c.tag)}/members`).then((r) =>
            r.json()
          )
        )
      );

      const flat = allMembers.flat() as ClanMember[];
      const filtered = flat
        .filter((m) => m.name.toLowerCase().includes(username.toLowerCase()))
        .map((m) => ({
          tag: m.tag,
          name: m.name,
          clanName: m.clan?.name ?? 'No clan',
          source: 'clan' as const,
        }));

      setMembers(filtered);
      if (!filtered.length) setError('No clan members match that name');
      setLoading(false);
      return;
    }

    setError('No opponents found and no clan to search');
    setLoading(false);
  };

  // 2️⃣ pickMember at top level
  const pickMember = async (opponent: SearchResult) => {
    setLoading(true);
    setError('');
    setSelectedDeck(null);
    setSelectedResult(opponent);

    const tag = opponent.tag;
    // try saved
    const lastRes = await fetch(`/api/players/${encodeURIComponent(tag)}/last`);
    if (lastRes.ok) {
      const { deck } = await lastRes.json();
      setSelectedDeck(deck);
      setLoading(false);
      return;
    }

    // fallback live log
    const logRes = await fetch(
      `/api/player/${encodeURIComponent(tag)}/battlelog`
    );
    if (!logRes.ok) {
      setError('Failed to fetch battle log');
      setLoading(false);
      return;
    }
    const logData = (await logRes.json()) as BattleLogEntry[];
    if (!logData.length) {
      setError('No recent battles found');
      setLoading(false);
      return;
    }

    const recent = logData[0];
    const cards = recent.team?.[0]?.cards;
    if (!Array.isArray(cards)) {
      setError('Unexpected battle log format');
      setLoading(false);
      return;
    }

    setResults([]);
    setMembers([]);
    setSelectedDeck(cards);
    setLoading(false);
  };

  // 3️⃣ render
  return (
    <main className="p-8 space-y-6 flex justify-around">
      <section>
        <h1 className="text-2xl font-bold">Find Opponent’s Last Deck</h1>

        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
        >
          <input
            ref={nameRef}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username (partial ok)"
            className="w-full p-2 border rounded"
          />
          <input
            value={clanname}
            onChange={(e) => setClanname(e.target.value)}
            placeholder="Clan name (if no user match)"
            className="w-full p-2 border rounded"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            type="submit"
          >
            Search
          </button>
        </form>

        {error && <p className="text-red-500">{error}</p>}
        {loading && <p className="text-gray-500">Loading…</p>}

        {results.length > 0 && (
          <section>
            <h2 className="font-semibold">Matches in your repo:</h2>
            <ul className="list-disc pl-6">
              {results.map((r) => (
                <li key={r.tag}>
                  {r.name} — <em>{r.clanName ? r.clanName : 'No Clan'}</em>{' '}
                  <button
                    onClick={() => pickMember(r)}
                    className="ml-2 text-green-600 underline"
                  >
                    view deck
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {results.length === 0 && members.length > 0 && (
          <section>
            <h2 className="font-semibold">Members found in clans:</h2>
            <ul className="list-disc pl-6">
              {members.map((m) => (
                <li key={m.tag}>
                  {m.name} — <em>{m.clanName ? m.clanName : 'No Clan'}</em>{' '}
                  <button
                    onClick={() => pickMember(m)}
                    className="ml-2 text-green-600 underline"
                  >
                    select
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {selectedDeck && selectedResult && (
          <section className="mt-6">
            <h2 className="text-xl font-bold">
              Selected opponent: {selectedResult.name}
            </h2>
            <p className="italic">
              {selectedResult.clanName ? selectedResult.clanName : 'No clan'}
            </p>

            <h3 className="text-lg font-bold mb-4">Last Deck:</h3>
            <DeckDisplay cards={selectedDeck} />
          </section>
        )}
      </section>

      <section>
        <AutoUploader />
      </section>
    </main>
  );
}
