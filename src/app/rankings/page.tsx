'use client';

import { flag } from '@/lib/format';
import { useCountryPresets, type Country } from '@/lib/useCountryPresets';
import { useMyTag } from '@/lib/useMyTag';
import { useEffect, useRef, useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { useLocalStorage, useOnClickOutside } from 'usehooks-ts';
import ClanBadge from '../components/ClanBadge';
import { Card, EmptyState, ErrorText, Input, Spinner } from '../components/ui';
import { cleanName } from '@/lib/names';

interface Player {
  rank: number;
  tag: string;
  name: string;
  eloRating: number;
  clan?: { tag: string; name: string; badgeId: number };
}

const PAGE = 100;

export default function RankingsPage() {
  const [myTag] = useMyTag();
  const { presets, addPreset, removePreset } = useCountryPresets();
  const [locationId, setLocationId] = useLocalStorage('rankingLocation', 'global', {
    initializeWithValue: false,
  });
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/pathoflegends?locationId=${locationId}`)
      .then(async (r) => {
        const data = await r.json();
        if (cancelled) return;
        if (!r.ok) throw new Error(data.error || 'API error');
        setError('');
        setPlayers(data.items);
      })
      .catch((e) => !cancelled && setError((e as Error).message));
    return () => {
      cancelled = true;
    };
  }, [locationId]);

  const selectLocation = (id: string) => {
    setPlayers(null);
    setShown(PAGE);
    setLocationId(id);
  };

  const current = presets.find((p) => String(p.id) === locationId);
  const me = players?.find((p) => p.tag === myTag);
  const top = players?.[0]?.eloRating ?? 1;
  const at = (rank: number) => players?.find((p) => p.rank === rank);
  const filtered = (players ?? []).filter(
    (p) =>
      !filter ||
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.clan?.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">
          {current ? `${flag(current.countryCode)} ${current.name}` : '🌍 Global'} · Path of
          Legends
        </h1>

        {/* location presets */}
        <div className="flex flex-wrap items-center gap-2">
          <LocationChip active={locationId === 'global'} onClick={() => selectLocation('global')}>
            🌍 Global
          </LocationChip>
          {presets.map((c) => (
            <LocationChip
              key={c.id}
              active={String(c.id) === locationId}
              onClick={() => selectLocation(String(c.id))}
              onRemove={() => {
                removePreset(c.id);
                if (String(c.id) === locationId) selectLocation('global');
              }}
            >
              {flag(c.countryCode)} {c.name}
            </LocationChip>
          ))}
          <CountryPicker
            onPick={(c) => {
              addPreset(c);
              selectLocation(String(c.id));
            }}
          />
        </div>
      </div>

      <ErrorText>{error}</ErrorText>
      {!players && !error && (
        <p className="flex items-center gap-2 text-sm text-muted">
          <Spinner /> Loading leaderboard…
        </p>
      )}

      {players && (
        <>
          {/* milestones */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="#1" value={at(1)?.eloRating} sub={at(1)?.name} />
            <StatCard label="#100" value={at(100)?.eloRating} sub="Elo needed" />
            <StatCard
              label={`#${players.length.toLocaleString()} (last)`}
              value={players.at(-1)?.eloRating}
              sub="Elo to get on the board"
            />
            <StatCard
              label="You"
              value={me ? `#${me.rank}` : undefined}
              sub={me ? `${me.eloRating} Elo` : myTag ? 'Not on this board' : 'Save your tag'}
              highlight={!!me}
            />
          </div>

          <Card className="p-0">
            <div className="flex items-center gap-3 border-b border-border p-3">
              <Input
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setShown(PAGE);
                }}
                placeholder="Find a player or clan…"
                className="max-w-xs"
              />
              <span className="text-xs text-muted">{players.length.toLocaleString()} players</span>
            </div>

            {filtered.length === 0 ? (
              <div className="p-4">
                <EmptyState>No players match.</EmptyState>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="w-16 px-4 py-2">Rank</th>
                    <th className="px-2 py-2">Player</th>
                    <th className="w-40 px-4 py-2 text-right">Elo</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, shown).map((p) => (
                    <tr
                      key={p.tag}
                      className={`border-t border-border ${
                        p.tag === myTag ? 'bg-accent/10' : 'hover:bg-surface-2'
                      }`}
                    >
                      <td className="px-4 py-2">
                        <RankBadge rank={p.rank} />
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <ClanBadge badgeId={p.clan?.badgeId} size={20} />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{cleanName(p.name)}</p>
                            <p className="truncate text-xs text-muted">{p.clan?.name ?? 'No clan'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end gap-2">
                          <div className="hidden h-1.5 w-20 overflow-hidden rounded bg-surface-2 sm:block">
                            <div
                              className="h-full bg-accent"
                              style={{ width: `${(p.eloRating / top) * 100}%` }}
                            />
                          </div>
                          <span className="w-12 text-right font-semibold tabular-nums">
                            {p.eloRating}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {filtered.length > shown && (
              <button
                onClick={() => setShown(shown + PAGE)}
                className="w-full border-t border-border py-3 text-sm text-primary hover:bg-surface-2"
              >
                Show more ({(filtered.length - shown).toLocaleString()} left)
              </button>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const medal = ['', 'bg-accent text-black', 'bg-slate-300 text-black', 'bg-amber-700 text-white'][rank];
  if (medal) {
    return (
      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${medal}`}>
        {rank}
      </span>
    );
  }
  return <span className="tabular-nums text-muted">{rank}</span>;
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value?: number | string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <Card className={`p-4 ${highlight ? 'border-accent/50' : ''}`}>
      <p className="text-xs text-muted">{label}</p>
      <p className={`text-xl font-bold tabular-nums ${highlight ? 'text-accent' : ''}`}>
        {value ?? '-'}
      </p>
      {sub && <p className="truncate text-xs text-muted">{sub}</p>}
    </Card>
  );
}

function LocationChip({
  active,
  onClick,
  onRemove,
  children,
}: {
  active: boolean;
  onClick: () => void;
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border text-sm transition ${
        active ? 'border-primary/60 bg-primary/15 text-primary' : 'border-border text-muted hover:text-fg'
      }`}
    >
      <button onClick={onClick} className="py-1 pl-3 pr-3">
        {children}
      </button>
      {onRemove && (
        <button onClick={onRemove} className="-ml-1.5 pr-2 opacity-60 hover:opacity-100" title="Remove">
          <FiX size={14} />
        </button>
      )}
    </span>
  );
}

// "+ Add country" with a search box over every country
function CountryPicker({ onPick }: { onPick: (c: Country) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const ref = useRef<HTMLDivElement>(null!);
  useOnClickOutside(ref, () => setOpen(false));

  useEffect(() => {
    if (!open || countries.length) return;
    fetch('/api/locations')
      .then((r) => (r.ok ? r.json() : []))
      .then(setCountries);
  }, [open, countries.length]);

  const matches = countries
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  const pick = (c: Country) => {
    onPick(c);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-sm text-muted hover:text-fg"
      >
        <FiPlus /> Add country
      </button>
      {open && (
        <div className="absolute left-0 z-10 mt-2 w-64 rounded-xl border border-border bg-surface p-2 shadow-xl">
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && matches[0]) pick(matches[0]);
            }}
            placeholder="Search a country…"
          />
          <ul className="mt-1 max-h-64 overflow-y-auto">
            {!countries.length && <li className="p-2 text-sm text-muted">Loading…</li>}
            {matches.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => pick(c)}
                  className="w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-surface-2"
                >
                  {flag(c.countryCode)} {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
