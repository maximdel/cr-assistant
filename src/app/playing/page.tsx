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

  // When player potentially plays multiple decks
  const [playersOtherDecks, setPlayersOtherDecks] = useState<any[]>([]);

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, [username]);

  // Search handler
  const onSearch = async () => {
    setLoading(true);
    setError('');
    setResults([]);
    setMembers([]);
    setSelectedDeck(null);

    // build URL once
    const url = new URL('/api/players', location.origin);
    if (username.trim()) {
      url.searchParams.set('name', username.trim());
    }
    if (clanname.trim()) {
      url.searchParams.set('clan', clanname.trim());
    }

    // now fetch
    const opponentRes = await fetch(url.toString());
    if (!opponentRes.ok) {
      setError(`Error ${opponentRes.status}`);
      setLoading(false);
      return;
    }

    const results: SearchResult[] = await opponentRes.json();
    if (results.length) {
      // fetch each player's clan
      const withClans = await Promise.all(
        results.map(async (player) => {
          try {
            const clanRes = await fetch(
              `/api/players/${encodeURIComponent(player.tag)}/clan`
            );
            if (!clanRes.ok) throw new Error();
            const { clanName } = await clanRes.json();
            return { ...player, clanName };
          } catch {
            return { ...player, clanName: null };
          }
        })
      );
      // save into state
      setResults(withClans.map((p) => ({ ...p, source: 'db' })));
      setLoading(false);
      return;
    }

    // else search by clan
    if (clanname.trim()) {
      const cr = await fetch(
        `/api/clans/search?name=${encodeURIComponent(clanname)}`
      );
      const clans: Clan[] = await cr.json();
      if (!clans || clans.length === 0) {
        setError('No clans match that name');
        setLoading(false);
      }

      const top5 = clans.slice(0, 10);

      // fetch each clan’s members, and tag them with that clan’s name
      const membersByClan = await Promise.all(
        top5.map(async (clan) => {
          const res = await fetch(
            `/api/clans/${encodeURIComponent(clan.tag)}/members`
          );
          const list: ClanMember[] = await res.json();
          // attach clan.name to each member
          return list.map((m) => ({
            tag: m.tag,
            name: m.name,
            clanName: clan.name,
          }));
        })
      );

      //  flatten into one array
      const flat: Array<{ tag: string; name: string; clanName: string }> =
        membersByClan.flat();

      //  filter by username and shape into SearchResult
      const filtered: SearchResult[] = flat
        .filter((m) =>
          m.name.toLowerCase().includes(username.trim().toLowerCase())
        )
        .map((m) => ({
          tag: m.tag,
          name: m.name,
          clanName: m.clanName,
          source: 'clan',
        }));

      if (filtered.length === 1) {
        await pickMember(filtered[0]);
        setLoading(false);
        return;
      }

      setMembers(filtered);
      if (!filtered.length) setError('No clan members match that name');
      setLoading(false);
      return;
    }

    setError('No opponents found and no clan to search');
    setLoading(false);
  };

  // Fetch saved deck from opponent in DB
  const searchSavedDeck = async (tag: string) => {
    const lastRes = await fetch(`/api/players/${encodeURIComponent(tag)}/last`);
    if (!lastRes.ok) return null;

    const { deck } = await lastRes.json();
    return Array.isArray(deck) ? deck : null;
  };

  // fetch clan from API
  const getPlayerClan = async (tag: string) => {
    const clanRes = await fetch(`/api/players/${encodeURIComponent(tag)}/clan`);
    const { clanName } = await clanRes.json();
    return clanName;
  };

  const getLatestDeck = async (tag: string) => {
    const battleLogRes = await fetch(
      `/api/player/${encodeURIComponent(tag)}/battlelog`
    );
    if (!battleLogRes.ok) {
      setError('Failed to fetch battle log');
      setLoading(false);
      return;
    }
    const logData = (await battleLogRes.json()) as BattleLogEntry[];
    if (!logData.length) {
      setError('No recent battles found');
      setLoading(false);
      return;
    }

    // Check if the player plays multiple different decks
    const lastDeck = logData[0].team[0].cards;
    const otherDecks = [];

    for (let i = 0; i < Math.min(5, logData.length); i++) {
      if (logData[i].team[0].cards !== lastDeck) {
        otherDecks.push(logData[i].team[0].cards);
      }
    }
    if (otherDecks) {
      setPlayersOtherDecks(otherDecks);
    }

    const recent = logData[0];
    const cards = recent.team?.[0]?.cards;
    if (!Array.isArray(cards)) {
      setError('Unexpected battle log format');
      setLoading(false);
      return;
    }
    return cards;
  };

  // Choose the player that corresponds to your opponent
  const pickMember = async (opponent: SearchResult) => {
    setLoading(true);
    setError('');
    setSelectedDeck(null);

    const tag = opponent.tag;

    const clanName = await getPlayerClan(tag);
    const cards = await getLatestDeck(tag);

    setResults([]);
    setMembers([]);
    setSelectedDeck(cards);

    setSelectedResult({
      tag,
      name: opponent.name,
      clanName,
    });
    setLoading(false);
    setClanname('');
    setUsername('');
  };

  // render
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
