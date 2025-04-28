'use client';

import { Preset } from '@prisma/client';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [tag, setTag] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);

  // ref to focus on name field when it appears
  const nameRef = useRef<HTMLInputElement>(null);

  // Saved playertags
  const [presets, setPresets] = useState<Preset[]>([]);

  const [player, setPlayer] = useState<any>(null);

  // Loading and error states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<boolean>(false);

  // load presets from DB
  useEffect(() => {
    fetch('/api/presets')
      .then((r) => r.json())
      .then((data: Preset[]) => setPresets(data));
  }, []);

  // when editingTag becomes non-null, focus the name input
  useEffect(() => {
    if (editingTag) {
      nameRef.current?.focus();
    }
  }, [editingTag]);

  // After clicking 'Save' button, open popup
  const startAdd = () => {
    const cleanedTag = tag.trim();
    if (!cleanedTag) {
      setError('Please specify a tag');
      return;
    }
    // enter “naming mode”
    setEditingTag(cleanedTag);
    // reset the name field
    setNameInput('');
  };

  // Create Preset object
  const confirmAdd = async () => {
    if (!editingTag) {
      setError('Please specify a player tag');
      return;
    }
    if (!nameInput.trim()) {
      setError('Please specify a placeholder name');
      return;
    }
    const res = await fetch('/api/presets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag: editingTag, name: nameInput.trim() }),
    });

    if (!res.ok) {
      setError('Could not save preset');
      return;
    }

    const newPreset: Preset = await res.json();
    setPresets((prev) => [
      newPreset,
      ...prev.filter((p) => p.tag !== newPreset.tag),
    ]);
    setEditingTag(null);
    setTag('');
    setNameInput('');
  };

  // Delete Preset by tag
  const removePreset = async (tagToRemove: string) => {
    const res = await fetch(`/api/presets/${encodeURIComponent(tagToRemove)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      setError('Could not remove preset');
      return;
    }
    setPresets((prev) => prev.filter((p) => p.tag !== tagToRemove));
  };

  const fetchPlayer = async (e?: React.FormEvent, newTag?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setPlayer(null);

    const lookup = newTag ?? tag.trim();
    if (!lookup) {
      setError('Please specify a tag');
      setLoading(false);
      return;
    }

    try {
      const [playerRes, chestsRes, logRes] = await Promise.all([
        fetch(`/api/player/${encodeURIComponent(lookup)}`),
        fetch(`/api/player/${encodeURIComponent(lookup)}/upcomingchests`),
        fetch(`/api/player/${encodeURIComponent(lookup)}/battlelog`),
      ]);

      if (!playerRes.ok) throw new Error('Player not found 😢');

      const [playerData, chestsData, logData] = await Promise.all([
        playerRes.json(),
        chestsRes.json(),
        logRes.json(),
      ]);

      setPlayer({
        ...playerData,
        upcomingChests: chestsData,
        battleLog: logData,
      });
      setTag('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Previous version:

  // const addPreset = () => {
  //   setLoading(true);
  //   const clean = tag.trim();
  //   if (clean && !presets.includes(clean)) {
  //     setPresets([clean, ...presets]);
  //     setTag('');
  //   }
  //   setLoading(false);
  // };

  // const removePreset = (t: string) => {
  //   setPresets(presets.filter((x) => x !== t));
  // };
  return (
    <main className="p-8 mx-auto space-y-6 grid grid-cols-3 grid-cols-[25%_50%_15%] gap-[min(2rem,5%)]">
      <section>
        <h1 className="text-2xl font-bold">Clash Repo</h1>
        {error && <p className="text-red-500">{error}</p>}
        {loading && <p className="text-blue-500">Loading…</p>}

        {/* search + save form */}
        <form onSubmit={fetchPlayer} className="flex gap-2">
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Enter player tag"
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Search
          </button>
          <button
            type="button"
            onClick={startAdd}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Save
          </button>
        </form>

        {/* inline name input & confirm */}
        {editingTag && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              confirmAdd();
            }}
            className="flex gap-2 mb-4"
          >
            <input
              ref={nameRef}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Preset name"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={confirmAdd}
              className="px-4 py-2 bg-indigo-500 text-white rounded"
            >
              Confirm
            </button>
          </form>
        )}
      </section>
      <section>
        {loading && <p>Loading...</p>}
        {/* display fetched player info */}
        {player && (
          <section className="mt-6">
            <h2 className="text-xl font-bold">
              {player.name} ({player.tag})
            </h2>
            <p>Trophies: {player.trophies}</p>
            <p>Clan: {player.clan?.name ?? 'No clan'}</p>

            {player.upcomingChests && (
              <div className="mt-4">
                <h3 className="font-semibold">Upcoming Chests</h3>
                <ul className="list-disc ml-6">
                  {player.upcomingChests.items.map((c: any, i: number) => (
                    <li key={i}>
                      {c.name} (in {c.index} games)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {player.battleLog && (
              <div className="mt-4">
                <h3 className="font-semibold">Recent Battles</h3>
                <ul className="list-disc ml-6">
                  {player.battleLog.map((b: any, i: number) => (
                    <li key={i}>
                      {b.team[0].name} vs {b.opponent[0].name} —{' '}
                      {b.team[0].crowns > b.opponent[0].crowns ? 'Win' : 'Loss'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </section>

      <section>
        {/* list of presets */}
        {presets.length > 0 && (
          <section>
            <h2 className="font-semibold mb-2">Your Presets</h2>
            <ul className="space-y-1">
              {presets.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between items-center border rounded-lg hover:bg-fuchsia-100 hover:cursor-grab"
                  onClick={() => fetchPlayer(undefined, p.tag)}
                >
                  <span className="mx-4">
                    <strong>{p.name}</strong> ({p.tag})
                  </span>
                  <button
                    onClick={() => removePreset(p.tag)}
                    className="text-red-500 mx-4 my-1"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </main>
  );
}
