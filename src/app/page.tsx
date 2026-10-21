'use client';

import { timeAgo } from '@/lib/format';
import { useSync } from '@/lib/sync';
import { useMyProfile, useMyTag } from '@/lib/useMyTag';
import type { Encounter } from '@/types/encounter';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { GiTrophyCup } from 'react-icons/gi';
import ClanBadge from './components/ClanBadge';
import DeckDisplay from './components/DeckDisplay';
import MatchList from './components/MatchList';
import { Button, Card, ErrorText, Input, SectionTitle } from './components/ui';

export default function Home() {
  const [myTag] = useMyTag();
  return myTag ? <Dashboard myTag={myTag} /> : <Welcome />;
}

// First visit: explain the app and ask for a tag
function Welcome() {
  const [, setMyTag] = useMyTag();
  const [tag, setTag] = useState('');

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8 text-center">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">
          Scout your opponents.
          <br />
          <span className="text-accent">Learn from your matches.</span>
        </h1>
        <p className="text-muted">
          See what your opponent plays before the match starts, and keep a history of every
          battle to find out what you lose to.
        </p>
      </div>

      <form
        className="mx-auto flex max-w-sm gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const clean = tag.trim().toUpperCase().replace(/^#?/, '#');
          if (clean.length >= 4) setMyTag(clean);
        }}
      >
        <Input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Your player tag, e.g. #2RGCUYU"
          className="[&:not(:placeholder-shown)]:uppercase"
          autoFocus
        />
        <Button type="submit">Start</Button>
      </form>
      <p className="text-xs text-muted">
        Find your tag in the game: tap your name at the top left of the main screen.
      </p>

      <div className="grid gap-3 text-left sm:grid-cols-3">
        {[
          ['1. Save your tag', 'So the app knows which matches are yours.'],
          ['2. Turn on sync', 'Your matches are saved every 2 minutes while the app is open.'],
          ['3. Scout', 'Type or send your opponent’s name from your phone when a match starts.'],
        ].map(([title, text]) => (
          <Card key={title} className="p-4">
            <p className="font-medium">{title}</p>
            <p className="text-sm text-muted">{text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ myTag }: { myTag: string }) {
  const { profile, error: profileError } = useMyProfile();
  const sync = useSync();
  const [matches, setMatches] = useState<Encounter[] | null>(null);

  // reload the list after every sync
  useEffect(() => {
    fetch(`/api/encounters?myTag=${encodeURIComponent(myTag)}&limit=30`)
      .then((r) => r.json())
      .then(setMatches)
      .catch(() => setMatches([]));
  }, [myTag, sync.version]);

  const recent = matches ?? [];
  const wins = recent.filter((m) => m.result === 'win').length;
  const losses = recent.filter((m) => m.result === 'loss').length;

  return (
    <div className="space-y-6">
      <ErrorText>{profileError}</ErrorText>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* profile */}
        <Card className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-bold">{profile?.name ?? myTag}</h1>
              <p className="flex items-center gap-1.5 text-sm text-muted">
                {myTag}
                {profile?.clan && (
                  <>
                    {' · '}
                    <ClanBadge badgeId={profile.clan.badgeId} size={16} />
                    {profile.clan.name}
                  </>
                )}
              </p>
            </div>
            {profile && (
              <div className="flex flex-wrap gap-4">
                <Stat label="Trophies" value={profile.trophies.toLocaleString()} accent />
                {profile.arena && <Stat label="Arena" value={profile.arena.name} />}
                {profile.bestPathOfLegendSeasonResult?.rank && (
                  <Stat
                    label="Best ranked"
                    value={`#${profile.bestPathOfLegendSeasonResult.rank.toLocaleString()}`}
                  />
                )}
              </div>
            )}
          </div>
          {profile?.currentDeck && (
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-muted">Ladder deck</p>
              <DeckDisplay cards={profile.currentDeck} size="sm" />
            </div>
          )}
        </Card>

        {/* sync */}
        <Card className="space-y-4">
          <SectionTitle>Match sync</SectionTitle>
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span>
              <span className="block font-medium">Auto-save my matches</span>
              <span className="text-xs text-muted">Every 2 min, on any page of the app</span>
            </span>
            <input
              type="checkbox"
              checked={sync.enabled}
              onChange={(e) => sync.setEnabled(e.target.checked)}
              className="h-5 w-5 accent-[var(--color-win)]"
            />
          </label>
          <Button
            variant="secondary"
            className="w-full"
            onClick={sync.syncNow}
            disabled={sync.syncing}
          >
            <FiRefreshCw className={sync.syncing ? 'animate-spin' : ''} />
            Sync now
          </Button>
          <p className="text-xs text-muted">
            {sync.lastSync
              ? `Last sync ${timeAgo(sync.lastSync.at)}: ${sync.lastSync.saved} new match${sync.lastSync.saved === 1 ? '' : 'es'}`
              : 'Ladder, ranked, challenge and war battles are saved. Events are skipped.'}
          </p>
          <ErrorText>{sync.error}</ErrorText>
        </Card>
      </div>

      {/* recent matches */}
      <section>
        <SectionTitle
          right={
            recent.length > 0 && (
              <span className="text-sm text-muted">
                Last {recent.length}:{' '}
                <span className="font-semibold text-win">{wins}W</span> /{' '}
                <span className="font-semibold text-loss">{losses}L</span> ·{' '}
                {Math.round((wins / recent.length) * 100)}%
              </span>
            )
          }
        >
          Saved matches
        </SectionTitle>
        {matches === null ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : (
          <MatchList
            matches={recent}
            highlight={sync.newIds}
            empty="No matches saved yet. Turn on sync or click “Sync now”."
          />
        )}
      </section>

      <p className="text-center text-sm text-muted">
        In a match? <Link href="/scout" className="text-primary hover:underline">Scout your opponent →</Link>
      </p>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className={`flex items-center gap-1 font-semibold ${accent ? 'text-accent' : ''}`}>
        {accent && <GiTrophyCup />}
        {value}
      </p>
    </div>
  );
}
