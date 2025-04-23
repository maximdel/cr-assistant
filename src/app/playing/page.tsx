'use client';
import { BattleLogEntry } from '@/types/battle';
import { Clan } from '@/types/clan';
import { Player } from '@prisma/client';
import { useState } from 'react';
import AutoUploader from '../components/AutoUploader';
import DeckDisplay from '../components/DeckDisplay';

export default function OpponentSearch() {
  const [username, setUsername] = useState('');
  const [clanname, setClanname] = useState('');
  const [results, setResults] = useState<Player[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  const [selectedDeck, setSelectedDeck] = useState<any>(null);
  const [selectedResult, setSelectedResult] = useState<Player>();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');

  const onSearch = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    setMembers([]);
    setSelectedDeck(null);

    // 1️⃣ try repo by username
    const opponentRes = await fetch(
      `/api/opponents?name=${encodeURIComponent(username)}`
    );
    const data: Player[] = await opponentRes.json();
    if (data.length) {
      setResults(data);
      setLoading(false);
      return;
    }

    // 2️⃣ if none found and clanname given, search clans → members
    if (clanname.trim()) {
      const cr = await fetch(
        `/api/clans/search?name=${encodeURIComponent(clanname)}`
      );
      const clans = await cr.json();

      console.log('clans: ' + clans);

      const top5 = clans.slice(0, 5);
      const allMembers = await Promise.all(
        top5.map((clan: Clan) =>
          fetch(`/api/clans/${encodeURIComponent(clan.tag)}/members`).then(
            (response) => response.json()
          )
        )
      );
      setMembers(allMembers.flat());
      if (!allMembers.flat().length) {
        setError('No members found for those clans');
      }
      setLoading(false);
      return;
    }

    setError('No opponents found and no clan to search');
  };

  const pickMember = async (opponent: Player) => {
    setLoading(true);
    setError('');
    setSelectedDeck(null);
    const tag = opponent.tag;
    setSelectedResult(opponent);

    // 1️⃣ Try your saved repo
    const lastRes = await fetch(
      `/api/opponents/${encodeURIComponent(tag)}/last`
    );
    if (lastRes.ok) {
      const { deck } = await lastRes.json();
      setSelectedDeck(deck);
      setLoading(false);

      return;
    }

    // 2️⃣ Fallback to live battle log
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

    // safely grab the first team’s cards
    const recent = logData[0];
    const cards = recent.team?.[0]?.cards;
    if (!Array.isArray(cards)) {
      setError('Unexpected battle log format');
      setLoading(false);

      return;
    }
    setMembers([]);
    setResults([]);
    setLoading(false);
    setSelectedDeck(cards);
  };

  return (
    <main className="p-8 space-y-6 flex justify-around">
      <section>
        <h1 className="text-2xl font-bold">Find Opponent’s Last Deck</h1>

        <div className="space-y-2">
          <input
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
            onClick={onSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {results.length > 0 && (
          <section>
            <h2 className="font-semibold">Matches in your repo:</h2>
            <ul className="list-disc pl-6">
              {results.map((o) => (
                <li key={o.tag}>
                  {o.name} ({o.tag}){' '}
                  <button
                    onClick={() => pickMember(o)}
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
                  {m.name} ({m.tag}){' '}
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

        {selectedDeck && (
          <section className="mt-6">
            <h2 className="text-xl font-bold">
              Selected opponent: {selectedResult?.name}
            </h2>
            <p>{selectedResult?.clanId}</p>

            <h3 className="text-l font-bold mb-[1rem]">Last Deck:</h3>
            <DeckDisplay cards={selectedDeck} />
          </section>
        )}
      </section>
      <section>
        <AutoUploader></AutoUploader>
      </section>
    </main>
  );
}
