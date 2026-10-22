'use client';
import { minutesSince, timeAgo } from '@/lib/format';
import { ALL_GAME_TYPES, battleTypesFor } from '@/lib/gameTypes';
import { recentDecks } from '@/lib/deck';
import { useSync } from '@/lib/sync';
import { useCountryPresets } from '@/lib/useCountryPresets';
import { useMyTag } from '@/lib/useMyTag';
import type { BattleLogEntry, CardInfo } from '@/types/battle';
import type { Encounter } from '@/types/encounter';
import type { PlayerProfile } from '@/types/player';
import type { Candidate } from '@/types/search';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FiSearch, FiSmartphone } from 'react-icons/fi';
import { GiTrophyCup } from 'react-icons/gi';
import { useInterval, useLocalStorage } from 'usehooks-ts';
import ClanBadge from '../components/ClanBadge';
import { GameTypeFilter } from '../components/GameTypeFilter';
import MatchList from '../components/MatchList';
import Matchups from '../components/Matchups';
import RecentDecks from '../components/RecentDecks';
import { Button, Card, EmptyState, ErrorText, Input, Pill, SectionTitle, Spinner } from '../components/ui';
import { cleanName } from '@/lib/names';

// opponents you looked at, kept in the browser
type RecentScout = { tag: string; name: string; clanName?: string; clanBadgeId?: number; at: number };

type Opponent = {
  candidate: Candidate;
  profile: PlayerProfile | null;
  battles: BattleLogEntry[];
  history: Encounter[];
};

// Everything we show about a possible opponent
async function fetchOpponent(candidate: Candidate, myTag: string): Promise<Opponent> {
  const tag = encodeURIComponent(candidate.tag);
  const [profileRes, logRes, history] = await Promise.all([
    fetch(`/api/players/${tag}`),
    fetch(`/api/players/${tag}/battlelog`),
    fetch(`/api/encounters?opponent=${tag}${myTag ? `&myTag=${encodeURIComponent(myTag)}` : ''}`)
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []),
  ]);
  const battles = await logRes.json();
  if (!logRes.ok) throw new Error(battles.error || 'Could not load their battle log');

  return {
    candidate,
    profile: profileRes.ok ? await profileRes.json() : null,
    battles,
    history,
  };
}

export default function ScoutPage() {
  const [myTag] = useMyTag();
  const { presets } = useCountryPresets();
  const [username, setUsername] = useState('');
  const [clanname, setClanname] = useState('');
  const [gameTypes, setGameTypes] = useState<string[]>(ALL_GAME_TYPES.map((g) => g.key));

  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [recent, setRecent] = useLocalStorage<RecentScout[]>('recentScouts', [], {
    initializeWithValue: false,
  });
  const [loadingTag, setLoadingTag] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  // opponents being loaded or already loaded, so picking a prefetched one is instant
  const loaded = useRef(new Map<string, Promise<Opponent>>());

  const loadOpponent = (candidate: Candidate) => {
    let promise = loaded.current.get(candidate.tag);
    if (!promise) {
      promise = fetchOpponent(candidate, myTag);
      // a failed load can be retried
      promise.catch(() => loaded.current.delete(candidate.tag));
      loaded.current.set(candidate.tag, promise);
    }
    return promise;
  };

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  // Search all sources at once (saved opponents, clans, leaderboards)
  const onSearch = async (name = username, clan = clanname) => {
    if (!name.trim()) {
      setError('Enter at least part of their name');
      return;
    }
    setSearching(true);
    setError('');
    setWarnings([]);
    setCandidates(null);
    loaded.current.clear(); // new search, fresh data

    try {
      const url = new URL('/api/opponents/search', location.origin);
      url.searchParams.set('name', name.trim());
      if (clan.trim()) url.searchParams.set('clan', clan.trim());
      url.searchParams.set('locations', ['global', ...presets.map((p) => p.id)].join(','));

      const res = await fetch(url.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');

      setCandidates(data.candidates);
      setWarnings(data.warnings);

      // one clear winner: show their decks straight away
      const [best, second] = data.candidates as Candidate[];
      if (best && best.score >= 0.85 && (!second || best.score - second.score >= 0.25)) {
        pickOpponent(best);
      }
      // start loading the most likely ones in the background
      (data.candidates as Candidate[]).slice(0, 3).forEach((c) => loadOpponent(c).catch(() => {}));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSearching(false);
    }
  };

  // Show the chosen player
  const pickOpponent = async (candidate: Candidate) => {
    setLoadingTag(candidate.tag);
    setError('');
    try {
      setOpponent(await loadOpponent(candidate));
      const { tag, name, clanName, clanBadgeId } = candidate;
      setRecent((prev) =>
        [{ tag, name, clanName, clanBadgeId, at: Date.now() }, ...prev.filter((r) => r.tag !== tag)].slice(0, 10)
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoadingTag(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* search */}
      <div className="space-y-4">
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="whitespace-nowrap text-xl font-bold">Scout opponent</h1>
            <PhoneListener
              onReceive={(name, clan) => {
                setUsername(name);
                setClanname(clan);
                onSearch(name, clan);
              }}
            />
          </div>
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              onSearch();
            }}
          >
            <Input
              ref={nameRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Their name (partial is fine)"
            />
            <Input
              value={clanname}
              onChange={(e) => setClanname(e.target.value)}
              placeholder="Clan name or #tag (optional)"
            />
            <Button type="submit" className="w-full" disabled={searching}>
              {searching ? <Spinner className="border-white border-t-transparent" /> : <FiSearch />}
              Search
            </Button>
          </form>
          <p className="text-xs text-muted">
            Any 3+ characters of the clan name work, so you can type just the latin part of a
            clan name.
          </p>
        </Card>

        {recent.length > 0 && (
          <RecentlyScouted
            recent={recent}
            myTag={myTag}
            selectedTag={opponent?.candidate.tag}
            onPick={(r) => pickOpponent({ ...r, sources: [], score: 0 })}
            onClear={() => setRecent([])}
          />
        )}

        <ErrorText>{error}</ErrorText>
        {warnings.map((w) => (
          <p key={w} className="text-sm text-accent">
            {w}
          </p>
        ))}

        {candidates && (
          <section>
            <SectionTitle>
              {candidates.length ? `${candidates.length} possible match${candidates.length === 1 ? '' : 'es'}` : 'Results'}
            </SectionTitle>
            {candidates.length ? (
              <ul className="space-y-2">
                {candidates.map((c) => (
                  <CandidateRow
                    key={c.tag}
                    candidate={c}
                    selected={opponent?.candidate.tag === c.tag}
                    loading={loadingTag === c.tag}
                    onPick={() => pickOpponent(c)}
                  />
                ))}
              </ul>
            ) : (
              <EmptyState>
                Nobody found.{' '}
                {clanname
                  ? 'Check the clan name, or try fewer letters of the name.'
                  : 'Add their clan name: players you haven’t met before can only be found through their clan (or the leaderboards).'}
              </EmptyState>
            )}
          </section>
        )}
      </div>

      {/* chosen opponent */}
      <div>
        {opponent ? (
          <OpponentPanel
            key={opponent.candidate.tag}
            opponent={opponent}
            myTag={myTag}
            gameTypes={gameTypes}
            setGameTypes={setGameTypes}
          />
        ) : (
          <EmptyState>
            Search for your opponent, or send their name from your phone.
            <br />
            Their recent decks will show up here.
          </EmptyState>
        )}
      </div>
    </div>
  );
}

function CandidateRow({
  candidate: c,
  selected,
  loading,
  onPick,
}: {
  candidate: Candidate;
  selected: boolean;
  loading: boolean;
  onPick: () => void;
}) {
  const minutesAgo = c.lastSeen ? minutesSince(c.lastSeen) : null;
  return (
    <li>
      <button
        onClick={onPick}
        className={`w-full rounded-xl border p-3 text-left transition ${
          selected ? 'border-primary bg-primary/10' : 'border-border bg-surface hover:border-muted'
        }`}
      >
        <div className="flex items-center gap-2">
          <ClanBadge badgeId={c.clanBadgeId} size={22} />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{c.name}</span>
            <span className="block truncate text-xs text-muted">{c.clanName ?? 'No clan'}</span>
          </span>
          {loading && <Spinner />}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {minutesAgo != null && (
            <Pill className={minutesAgo < 15 ? 'bg-win/15 text-win' : 'bg-surface-2 text-muted'}>
              {minutesAgo < 15 ? '● online ' : 'seen '}
              {timeAgo(c.lastSeen!)}
            </Pill>
          )}
          {c.timesPlayed ? (
            <Pill className="bg-primary/15 text-primary">played {c.timesPlayed}×</Pill>
          ) : null}
          {c.trophies != null && (
            <Pill>
              <GiTrophyCup /> {c.trophies.toLocaleString()}
            </Pill>
          )}
          {c.eloRating != null && <Pill className="bg-accent/15 text-accent">Elo {c.eloRating}</Pill>}
          {c.sources
            .filter((s) => s === 'Leaderboard')
            .map((s) => (
              <Pill key={s}>{s}</Pill>
            ))}
        </div>
      </button>
    </li>
  );
}

function OpponentPanel({
  opponent: { candidate, profile, battles, history },
  myTag,
  gameTypes,
  setGameTypes,
}: {
  opponent: Opponent;
  myTag: string;
  gameTypes: string[];
  setGameTypes: (next: string[]) => void;
}) {
  // the deck the matchup section looks at: the one you pick, else their last used deck
  const [picked, setPicked] = useState<CardInfo[] | null>(null);
  const focused = picked ?? recentDecks(battles, battleTypesFor(gameTypes)).latest;

  const wins = history.filter((h) => h.result === 'win').length;
  const losses = history.filter((h) => h.result === 'loss').length;
  const clan = profile?.clan ?? (candidate.clanName ? { name: candidate.clanName, badgeId: candidate.clanBadgeId } : null);

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            {profile ? cleanName(profile.name) : candidate.name}
            <ClanBadge badgeId={clan?.badgeId} size={26} />
          </h2>
          <p className="text-sm text-muted">
            <bdi>{clan?.name ?? 'No clan'}</bdi> · {candidate.tag}
          </p>
          {profile && (
            <p className="mt-2 flex items-center gap-1 font-semibold text-accent">
              <GiTrophyCup /> {profile.trophies.toLocaleString()}
              {profile.arena && <span className="ml-2 font-normal text-muted">{profile.arena.name}</span>}
            </p>
          )}
        </div>
        <div className="text-right">
          {history.length > 0 ? (
            <>
              <p className="text-xs uppercase tracking-wide text-muted">Your record</p>
              <p className="text-xl font-bold">
                <span className="text-win">{wins}W</span> <span className="text-muted">/</span>{' '}
                <span className="text-loss">{losses}L</span>
              </p>
            </>
          ) : (
            <Pill>First time you meet</Pill>
          )}
          <Link
            href={`/players?tag=${encodeURIComponent(candidate.tag)}`}
            className="mt-2 block text-xs text-primary hover:underline"
          >
            Full profile →
          </Link>
        </div>
      </Card>

      <Card>
        <SectionTitle right={<GameTypeFilter selected={gameTypes} onChange={setGameTypes} />}>
          Recent decks
        </SectionTitle>
        <RecentDecks
          battles={battles}
          types={battleTypesFor(gameTypes)}
          focused={myTag ? focused : null}
          onFocus={myTag ? setPicked : undefined}
        />
      </Card>

      {myTag && focused && <Matchups myTag={myTag} deck={focused} />}

      {history.length > 0 && (
        <section>
          <SectionTitle>Your matches against them</SectionTitle>
          <MatchList matches={history} />
        </section>
      )}
    </div>
  );
}

// Your last scouted opponents, with the result once sync has saved the match
function RecentlyScouted({
  recent,
  myTag,
  selectedTag,
  onPick,
  onClear,
}: {
  recent: RecentScout[];
  myTag: string;
  selectedTag?: string;
  onPick: (r: RecentScout) => void;
  onClear: () => void;
}) {
  const { version } = useSync();
  const [matches, setMatches] = useState<Encounter[]>([]);

  // reload after every sync, so results show up as soon as they're saved
  useEffect(() => {
    if (!myTag) return;
    fetch(`/api/encounters?myTag=${encodeURIComponent(myTag)}&limit=50`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setMatches)
      .catch(() => {});
  }, [myTag, version]);

  // a match against them that started around or after the moment you scouted them
  const resultFor = (r: RecentScout) =>
    matches.find(
      (m) => m.opponent.tag === r.tag && new Date(m.playedAt).getTime() > r.at - 15 * 60_000
    );

  return (
    <section>
      <SectionTitle
        right={
          <button onClick={onClear} className="text-xs text-muted hover:text-fg">
            Clear
          </button>
        }
      >
        Recently scouted
      </SectionTitle>
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
        {recent.map((r) => {
          const match = resultFor(r);
          return (
            <li key={r.tag}>
              <button
                onClick={() => onPick(r)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-2 ${
                  selectedTag === r.tag ? 'bg-primary/10' : ''
                }`}
              >
                <ClanBadge badgeId={r.clanBadgeId} size={18} />
                <span className="min-w-0 flex-1 truncate">
                  <bdi className="font-medium">{r.name}</bdi>
                  <span className="text-muted"> · {timeAgo(new Date(r.at))}</span>
                </span>
                {match && (
                  <Pill
                    className={
                      match.result === 'win'
                        ? 'bg-win/15 text-win'
                        : match.result === 'loss'
                          ? 'bg-loss/15 text-loss'
                          : undefined
                    }
                  >
                    {match.result === 'win' ? 'Won' : match.result === 'loss' ? 'Lost' : 'Draw'}{' '}
                    {match.myCrowns}-{match.opponentCrowns}
                  </Pill>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// Polls the endpoint your iPhone shortcut posts to
function PhoneListener({ onReceive }: { onReceive: (name: string, clan: string) => void }) {
  const lastId = useRef(0);
  const [last, setLast] = useState<{ name: string; at: number } | null>(null);

  useInterval(async () => {
    const res = await fetch('/api/shortcut/text').catch(() => null);
    if (!res?.ok) return;
    const { id, name, clan } = await res.json();
    // first poll: just remember what's there, don't search an old push
    if (lastId.current === 0) {
      lastId.current = id || -1;
      return;
    }
    if (id && id !== lastId.current && name) {
      lastId.current = id;
      setLast({ name, at: id });
      onReceive(name, clan ?? '');
    }
  }, 1000);

  return (
    <span
      className="flex min-w-0 items-center gap-1.5 text-xs text-muted"
      title="Send a name from the iPhone shortcut (see README) and it is searched right away"
    >
      <FiSmartphone className="shrink-0" />
      {last ? (
        <span className="truncate">
          <bdi>{last.name}</bdi> · {timeAgo(new Date(last.at))}
        </span>
      ) : (
        <>
          <span className="h-2 w-2 animate-pulse rounded-full bg-win" /> listening
        </>
      )}
    </span>
  );
}
