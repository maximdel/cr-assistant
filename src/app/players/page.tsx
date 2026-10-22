'use client';

import { timeAgo } from '@/lib/format';
import { ALL_GAME_TYPES, battleTypesFor, gameTypeLabel } from '@/lib/gameTypes';
import { parseBattleTime, type BattleLogEntry } from '@/types/battle';
import type { PlayerProfile } from '@/types/player';
import type { Preset } from '@/types/preset';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { FiSearch, FiStar, FiX } from 'react-icons/fi';
import { GiTrophyCup } from 'react-icons/gi';
import ClanBadge from '../components/ClanBadge';
import DeckDisplay from '../components/DeckDisplay';
import { GameTypeFilter } from '../components/GameTypeFilter';
import RecentDecks from '../components/RecentDecks';
import { Button, Card, EmptyState, ErrorText, Input, SectionTitle, Spinner } from '../components/ui';
import { cleanName } from '@/lib/names';

type PlayerInfo = {
  profile: PlayerProfile;
  battles: BattleLogEntry[];
};

// useSearchParams needs a Suspense boundary
export default function PlayersPage() {
  return (
    <Suspense>
      <Players />
    </Suspense>
  );
}

function Players() {
  const router = useRouter();
  const tag = useSearchParams().get('tag') ?? '';
  const [input, setInput] = useState('');
  const [presets, setPresets] = useState<Preset[]>([]);
  const [player, setPlayer] = useState<PlayerInfo | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // load saved players from DB
  useEffect(() => {
    fetch('/api/presets')
      .then((r) => r.json())
      .then(setPresets);
  }, []);

  // the tag lives in the URL, so a player page can be linked to (e.g. from Scout)
  useEffect(() => {
    if (!tag) return;
    let cancelled = false;
    const t = encodeURIComponent(tag);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show the spinner while loading
    setLoading(true);
    Promise.all([
      fetch(`/api/players/${t}`),
      fetch(`/api/players/${t}/battlelog`),
    ])
      .then(async ([playerRes, logRes]) => {
        const profile = await playerRes.json();
        if (!playerRes.ok) throw new Error(profile.error === 'notFound' ? 'Player not found 😢' : profile.error);
        const info = {
          profile,
          battles: logRes.ok ? await logRes.json() : [],
        };
        if (!cancelled) {
          setError('');
          setPlayer(info);
        }
      })
      .catch((err) => !cancelled && setError((err as Error).message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [tag]);

  const open = (t: string) => {
    const clean = t.trim().toUpperCase().replace(/^#?/, '#');
    if (clean.length < 4) return;
    setInput('');
    router.push(`/players?tag=${encodeURIComponent(clean)}`);
  };

  const isSaved = player && presets.some((p) => p.tag === player.profile.tag);

  // Save / unsave the shown player, under their in-game name
  const toggleSaved = async () => {
    if (!player) return;
    const { tag, name } = player.profile;
    if (isSaved) {
      await fetch(`/api/presets/${encodeURIComponent(tag)}`, { method: 'DELETE' });
      setPresets((prev) => prev.filter((p) => p.tag !== tag));
    } else {
      const res = await fetch('/api/presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag, name }),
      });
      if (res.ok) {
        const preset: Preset = await res.json();
        setPresets((prev) => [preset, ...prev]);
      }
    }
  };

  const removePreset = async (t: string) => {
    await fetch(`/api/presets/${encodeURIComponent(t)}`, { method: 'DELETE' });
    setPresets((prev) => prev.filter((p) => p.tag !== t));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-2xl font-bold">Players</h1>
        <form
          className="flex w-full gap-2 sm:w-auto"
          onSubmit={(e) => {
            e.preventDefault();
            open(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Player tag, e.g. #2RGCUYU"
            className="[&:not(:placeholder-shown)]:uppercase sm:w-64"
          />
          <Button type="submit">
            <FiSearch /> Look up
          </Button>
        </form>
      </div>

      {/* saved players */}
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <span
              key={p.id}
              className={`inline-flex items-center rounded-full border text-sm ${
                p.tag === tag ? 'border-primary/60 bg-primary/15 text-primary' : 'border-border hover:border-muted'
              }`}
            >
              <button onClick={() => open(p.tag)} className="py-1 pl-3 pr-2">
                <FiStar className="mr-1 inline text-accent" />
                {p.name}
              </button>
              <button onClick={() => removePreset(p.tag)} className="pr-2 text-muted hover:text-loss" title="Remove">
                <FiX size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      <ErrorText>{error}</ErrorText>
      {loading && (
        <p className="flex items-center gap-2 text-sm text-muted">
          <Spinner /> Loading player…
        </p>
      )}

      {!tag && !presets.length && (
        <EmptyState>Look up any player by tag. Star players to keep them here.</EmptyState>
      )}

      {player && !loading && !error && (
        <PlayerView info={player} saved={!!isSaved} onToggleSaved={toggleSaved} />
      )}
    </div>
  );
}

function PlayerView({
  info: { profile, battles },
  saved,
  onToggleSaved,
}: {
  info: PlayerInfo;
  saved: boolean;
  onToggleSaved: () => void;
}) {
  const [gameTypes, setGameTypes] = useState<string[]>(ALL_GAME_TYPES.map((g) => g.key));

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-3">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              {cleanName(profile.name)}
              <ClanBadge badgeId={profile.clan?.badgeId} size={26} />
            </h2>
            <p className="text-sm text-muted">
              {profile.tag} · <bdi>{profile.clan?.name ?? 'No clan'}</bdi>
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1 font-semibold text-accent">
              <GiTrophyCup /> {profile.trophies.toLocaleString()}
            </span>
            {profile.arena && <span className="text-muted">{profile.arena.name}</span>}
            {profile.wins != null && profile.losses != null && (
              <span className="text-muted">
                {profile.wins.toLocaleString()} wins ·{' '}
                {Math.round((profile.wins / Math.max(1, profile.wins + profile.losses)) * 100)}% overall
              </span>
            )}
          </div>
          <Button variant="secondary" onClick={onToggleSaved}>
            <FiStar className={saved ? 'fill-accent text-accent' : ''} />
            {saved ? 'Saved' : 'Save player'}
          </Button>
        </div>
        {profile.currentDeck && (
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted">Ladder deck</p>
            <DeckDisplay cards={profile.currentDeck} size="sm" />
          </div>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <Card>
          <SectionTitle right={<GameTypeFilter selected={gameTypes} onChange={setGameTypes} />}>
            Recent decks
          </SectionTitle>
          <RecentDecks battles={battles} types={battleTypesFor(gameTypes)} />
        </Card>

        <Card>
          <SectionTitle>Recent battles</SectionTitle>
          <ul className="space-y-2">
            {battles.slice(0, 10).map((b, i) => {
              const [me, opp] = [b.team[0], b.opponent[0]];
              const result = me.crowns > opp.crowns ? 'win' : me.crowns < opp.crowns ? 'loss' : 'draw';
              const color = { win: 'text-win', loss: 'text-loss', draw: 'text-draw' }[result];
              return (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className={`w-8 font-semibold ${color}`}>
                    {me.crowns}-{opp.crowns}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {cleanName(opp.name)}
                    {b.opponent.length > 1 && ' + 1'}
                  </span>
                  <span className="text-xs text-muted">
                    {gameTypeLabel(b.type)} · {timeAgo(parseBattleTime(b.battleTime))}
                  </span>
                </li>
              );
            })}
            {!battles.length && <li className="text-sm text-muted">No battles yet.</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}
