'use client';
import { deckKey } from '@/lib/deck';
import { minutesSince, timeAgo } from '@/lib/format';
import { ALL_GAME_TYPES, battleTypesFor } from '@/lib/gameTypes';
import { useCountryPresets } from '@/lib/useCountryPresets';
import { useMyTag } from '@/lib/useMyTag';
import type { BattleLogEntry } from '@/types/battle';
import type { Encounter } from '@/types/encounter';
import type { PlayerProfile } from '@/types/player';
import type { Candidate } from '@/types/search';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FiSearch, FiSmartphone } from 'react-icons/fi';
import { GiTrophyCup } from 'react-icons/gi';
import { useInterval } from 'usehooks-ts';
import ClanBadge from '../components/ClanBadge';
import DeckDisplay from '../components/DeckDisplay';
import { GameTypeFilter } from '../components/GameTypeFilter';
import MatchList from '../components/MatchList';
import RecentDecks from '../components/RecentDecks';
import { Button, Card, EmptyState, ErrorText, Input, Pill, SectionTitle, Spinner } from '../components/ui';

type Opponent = {
  candidate: Candidate;
  profile: PlayerProfile | null;
  battles: BattleLogEntry[];
  history: Encounter[];
};

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
  const [loadingTag, setLoadingTag] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);

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
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSearching(false);
    }
  };

  // Load everything about the chosen player
  const pickOpponent = async (candidate: Candidate) => {
    setLoadingTag(candidate.tag);
    setError('');
    const tag = encodeURIComponent(candidate.tag);
    try {
      const [profileRes, logRes, history] = await Promise.all([
        fetch(`/api/players/${tag}`),
        fetch(`/api/players/${tag}/battlelog`),
        fetch(`/api/encounters?opponent=${tag}${myTag ? `&myTag=${encodeURIComponent(myTag)}` : ''}`)
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => []),
      ]);
      const battles = await logRes.json();
      if (!logRes.ok) throw new Error(battles.error || 'Could not load their battle log');

      setOpponent({
        candidate,
        profile: profileRes.ok ? await profileRes.json() : null,
        battles,
        history,
      });
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
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Scout opponent</h1>
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
          <OpponentPanel opponent={opponent} gameTypes={gameTypes} setGameTypes={setGameTypes} />
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
  gameTypes,
  setGameTypes,
}: {
  opponent: Opponent;
  gameTypes: string[];
  setGameTypes: (next: string[]) => void;
}) {
  const wins = history.filter((h) => h.result === 'win').length;
  const losses = history.filter((h) => h.result === 'loss').length;
  const clan = profile?.clan ?? (candidate.clanName ? { name: candidate.clanName, badgeId: candidate.clanBadgeId } : null);
  const lastBattleDeck = battles.find((b) => b.team.length === 1 && b.team[0].cards.length === 8)
    ?.team[0].cards;
  const sameAsLast =
    profile?.currentDeck && lastBattleDeck && deckKey(profile.currentDeck) === deckKey(lastBattleDeck);

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            {profile?.name ?? candidate.name}
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

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <SectionTitle right={<GameTypeFilter selected={gameTypes} onChange={setGameTypes} />}>
            Recent decks
          </SectionTitle>
          <RecentDecks battles={battles} types={battleTypesFor(gameTypes)} />
        </Card>

        {profile?.currentDeck && (
          <Card>
            <SectionTitle
              right={sameAsLast && <Pill className="bg-win/15 text-win">same as last match</Pill>}
            >
              Deck selected in game
            </SectionTitle>
            <DeckDisplay cards={profile.currentDeck} />
            <p className="mt-2 text-xs text-muted">
              The deck in their active slot right now (it may differ from the one used in some
              modes).
            </p>
          </Card>
        )}
      </div>

      {history.length > 0 && (
        <section>
          <SectionTitle>Your matches against them</SectionTitle>
          <MatchList matches={history} />
        </section>
      )}
    </div>
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
      className="flex items-center gap-1.5 text-xs text-muted"
      title="Send a name from the iPhone shortcut (see README) and it is searched right away"
    >
      <FiSmartphone />
      {last ? (
        <>
          received “<bdi>{last.name}</bdi>” {timeAgo(new Date(last.at))}
        </>
      ) : (
        <>
          <span className="h-2 w-2 animate-pulse rounded-full bg-win" /> listening
        </>
      )}
    </span>
  );
}
