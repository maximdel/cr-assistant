'use client';

import { timeAgo } from '@/lib/format';
import { useSync } from '@/lib/sync';
import { useMyProfile, useMyTag } from '@/lib/useMyTag';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { FiChevronDown, FiRefreshCw } from 'react-icons/fi';
import { GiTrophyCup } from 'react-icons/gi';
import { useOnClickOutside } from 'usehooks-ts';
import { Button, Input } from './components/ui';
import { cleanName } from '@/lib/names';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/scout', label: 'Scout' },
  { href: '/players', label: 'Players' },
  { href: '/rankings', label: 'Rankings' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/favicon.ico" alt="" width={32} height={32} priority />
          <span className="hidden sm:inline">CR Assistant</span>
        </Link>

        {/* nav links */}
        <nav className="order-last -mx-1 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
          {NAV.map(({ href, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  active ? 'bg-surface-2 text-fg' : 'text-muted hover:text-fg'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SyncIndicator />
          <PlayerChip />
        </div>
      </div>
    </header>
  );
}

function SyncIndicator() {
  const [myTag] = useMyTag();
  const { enabled, setEnabled, syncing, nextIn, error, serverManaged, lastSync } = useSync();
  if (!myTag) return null;

  // the server saves your matches on its own: just show that it's working
  if (serverManaged) {
    return (
      <span
        title={error ?? 'Your matches are saved by the server every 2 minutes'}
        className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs ${
          error ? 'border-loss/50 text-loss' : 'border-win/40 text-win'
        }`}
      >
        <FiRefreshCw />
        {error ? 'Sync error' : lastSync ? `Synced ${timeAgo(lastSync.at)}` : 'Server sync'}
      </span>
    );
  }

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      title={error ?? (enabled ? 'Auto-sync is on. Click to pause' : 'Auto-sync is paused. Click to start')}
      className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition ${
        error
          ? 'border-loss/50 text-loss'
          : enabled
            ? 'border-win/40 text-win'
            : 'border-border text-muted hover:text-fg'
      }`}
    >
      <FiRefreshCw className={syncing ? 'animate-spin' : ''} />
      {enabled ? (
        <span className="tabular-nums">
          {syncing ? 'Syncing' : `${Math.floor(nextIn / 60)}:${String(nextIn % 60).padStart(2, '0')}`}
        </span>
      ) : (
        <span>Sync off</span>
      )}
    </button>
  );
}

function PlayerChip() {
  const [myTag, setMyTag, removeMyTag] = useMyTag();
  const { profile, error } = useMyProfile();
  const [open, setOpen] = useState(false);
  const [draftTag, setDraftTag] = useState('');
  const ref = useRef<HTMLDivElement>(null!);
  useOnClickOutside(ref, () => setOpen(false));

  // Save to localStorage
  const saveTag = () => {
    const cleanTag = draftTag.trim().toUpperCase().replace(/^#?/, '#');
    if (cleanTag.length < 4) return;
    setMyTag(cleanTag);
    setDraftTag('');
    setOpen(false);
  };

  const tagForm = (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        saveTag();
      }}
    >
      <Input
        value={draftTag}
        onChange={(e) => setDraftTag(e.target.value)}
        placeholder="#YOURTAG"
        className="w-32 [&:not(:placeholder-shown)]:uppercase"
      />
      <Button type="submit" className="px-3">
        Save
      </Button>
    </form>
  );

  // no tag yet: just the form
  if (!myTag) return tagForm;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1 text-left hover:border-muted"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 text-sm font-bold text-accent">
          {cleanName(profile?.name ?? '?').slice(0, 1).toUpperCase()}
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-medium">{profile ? cleanName(profile.name) : myTag}</span>
          {profile ? (
            <span className="flex items-center gap-1 text-xs text-accent">
              <GiTrophyCup /> {profile.trophies.toLocaleString()}
            </span>
          ) : (
            error && <span className="block text-xs text-loss">profile unavailable</span>
          )}
        </span>
        <FiChevronDown className="text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 space-y-3 rounded-xl border border-border bg-surface p-4 shadow-xl">
          <div>
            <p className="font-medium">{profile ? cleanName(profile.name) : 'Your account'}</p>
            <p className="text-xs text-muted">
              {myTag}
              {profile?.clan && (
                <>
                  {' · '}
                  <bdi>{profile.clan.name}</bdi>
                </>
              )}
              {profile?.arena && ` · ${profile.arena.name}`}
            </p>
            {error && <p className="mt-1 text-xs text-loss">{error}</p>}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted">Switch account</p>
            {tagForm}
          </div>
          <Button
            variant="danger"
            className="w-full"
            onClick={() => {
              removeMyTag();
              setOpen(false);
            }}
          >
            Forget this tag
          </Button>
        </div>
      )}
    </div>
  );
}
