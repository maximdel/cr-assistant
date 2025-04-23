'use client';
import type { BattleLogEntry } from '@/types/battle';
import { useEffect, useRef, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

export default function AutoUploader() {
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLogEntry[]>();

  const ownTag =
    (typeof window !== 'undefined' && localStorage.getItem('myPlayerTag')) ||
    '';

  const intervalRef = useRef<number | undefined>(undefined);
  const countdownRef = useRef<number | undefined>(undefined);
  const [nextIn, setNextIn] = useState(0);

  // Normalize the timestamp from the API
  function parseBattleTime(raw: string): Date {
    // regex groups: YYYY MM DD  HH mm ss.mmmZ
    const normalized = raw.replace(
      /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2}\.\d+Z)$/,
      '$1-$2-$3T$4:$5:$6'
    );
    return new Date(normalized);
  }

  // your sync routine
  const syncMatches = async () => {
    if (!ownTag) {
      setError('No player tag saved! Set your tag in the header first.');
      return;
    }
    try {
      // 1. get the last timestamp we have in the DB
      const lastRes = await fetch('/api/encounters/last');
      const { playedAt: lastSaved } = await lastRes.json(); // e.g. "2025-04-22T12:34:56Z"

      // 2. fetch the live battle log
      const logRes = await fetch(
        `/api/player/${encodeURIComponent(ownTag)}/battlelog`
      );
      const log: BattleLogEntry[] = await logRes.json();
      console.log('lastsaved:' + lastSaved);

      // 3. filter out entries we've already saved
      let lastDate = lastSaved ? new Date(lastSaved) : new Date(0); // epoch

      // optional safety check
      if (isNaN(lastDate.getTime())) lastDate = new Date(0);

      const newMatches = log
        .filter((b) => {
          const bt = parseBattleTime(b.battleTime);
          return bt.getTime() > lastDate.getTime();
        })
        .reverse();

      // 4. post each new opponent encounter
      for (const b of newMatches) {
        const opp = b.opponent[0];
        await fetch('/api/encounters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tag: opp.tag,
            name: opp.name,
            deck: opp.cards,
            playedAt: b.battleTime,
          }),
        });
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Sync failed');
    }
    setNextIn(120);
  };

  // start/stop the 2 min poll when isPolling toggles
  useEffect(() => {
    if (isPolling) {
      // run immediately
      syncMatches();
      // schedule every 2 min
      intervalRef.current = window.setInterval(syncMatches, 120000);

      // Timer
      setNextIn(120);
      countdownRef.current = window.setInterval(() => {
        setNextIn((n) => Math.max(0, n - 1));
      }, 1_000);
    } else {
      // clear timers
      window.clearInterval(intervalRef.current);
      window.clearInterval(countdownRef.current);
      setNextIn(0);
    }
    // cleanup on unmount
    return () => {
      window.clearInterval(intervalRef.current);
      window.clearInterval(countdownRef.current);
    };
  }, [isPolling]);

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-xl font-bold">Auto‑Upload Matches</h2>
      {error && <p className="text-red-500">{error}</p>}
      <label className="inline-flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isPolling}
          onChange={(e) => setIsPolling(e.target.checked)}
          className="form-checkbox"
        />
        <span>{isPolling ? 'Syncing…' : 'Paused'}</span>{' '}
        {isPolling && (
          <div className="flex items-center space-x-2">
            {/* spinner */}
            <FiRefreshCw className="animate-spin text-blue-600" size={20} />
            {/* countdown */}
            <span className="text-gray-600">
              Next in {Math.floor(nextIn / 60)}:
              {String(nextIn % 60).padStart(2, '0')}
            </span>
          </div>
        )}
      </label>
      {battleLog &&
        battleLog.map((b: any, i: number) => (
          <li key={i}>
            {b.team[0].name} vs {b.opponent[0].name} —{' '}
            {b.team[0].crowns > b.opponent[0].crowns ? 'Win' : 'Loss'}
          </li>
        ))}
    </div>
  );
}
