"use client";

import { useEffect, useState } from "react";

interface Player {
  rank: number;
  tag: string;
  name: string;
  score: number;
}

export default function TournamentsPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState("");
  const myTag = "#2RGCUYU";

  useEffect(() => {
    +fetch("/api/leaderboard")
      .then((r) => (r.ok ? r.json() : Promise.reject("API error")))
      .then((data) => setPlayers(data.items))
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!players.length) return <p className="p-4">Loading…</p>;

  const me = players.find((p) => p.tag === myTag);

  // Build summary rows at desired ranks
  const summaryRanks = [
    1, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
  ];
  const summary = summaryRanks.map((rank) => {
    const p = players.find((pl) => pl.rank === rank);
    return {
      rank,
      name: p?.name ?? "-",
      tag: p?.tag ?? "-",
      score: p?.score,
    };
  });

  return (
    <main className="p-8 max-w-3xl mx-auto space-y-8">
      <section className="p-4 bg-yellow-100 rounded">
        <h2 className="text-xl">Your current rank:</h2>
        {me && (
          <p className="text-2xl font-semibold">
            {me.rank} — {me.name} - {me.score}
          </p>
        )}
      </section>

      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Retro Royale</h1>

        <section>
          <h2 className="text-xl mb-4">Summary Table</h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Rank</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Elo</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row) => (
                <tr key={row.rank} className="border-b">
                  <td className="p-2">{row.rank.toLocaleString()}</td>
                  <td className="p-2">{row.name}</td>
                  <td className="p-2">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
