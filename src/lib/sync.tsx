'use client';
// Auto-sync of your matches, shared by the whole app (header indicator, home page list).
// Runs on whatever page is open, as long as it's switched on.
// If the server already syncs your tag (SYNC_TAG), the browser just follows its status.
import { useMyTag } from '@/lib/useMyTag';
import type { ServerSyncStatus } from '@/lib/serverSync';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useInterval, useLocalStorage } from 'usehooks-ts';

const SYNC_EVERY = 120; // seconds

type SyncState = {
  enabled: boolean;
  setEnabled: (on: boolean) => void;
  syncing: boolean;
  nextIn: number;
  lastSync: { at: Date; saved: number } | null;
  newIds: number[]; // matches saved by the latest sync, to highlight them
  error: string | null;
  version: number; // goes up after every sync, so lists know when to refresh
  syncNow: () => Promise<void>;
  serverManaged: boolean; // the server syncs this tag on its own
};

const SyncContext = createContext<SyncState | null>(null);

export function SyncProvider({ children }: { children: ReactNode }) {
  const [myTag] = useMyTag();
  // remember if syncing was on, so it keeps going after a reload
  const [enabled, setEnabled] = useLocalStorage('autoSync', false, {
    initializeWithValue: false,
  });
  const [syncing, setSyncing] = useState(false);
  const [nextIn, setNextIn] = useState(0);
  const [lastSync, setLastSync] = useState<SyncState['lastSync']>(null);
  const [newIds, setNewIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [server, setServer] = useState<ServerSyncStatus | null>(null);
  const serverManaged = !!server?.tag && server.tag === myTag.toUpperCase();

  const lastServerRun = useRef<string | null>(null);

  // follow the server sync: check its status now and every 30 s
  const applyServerStatus = (status: ServerSyncStatus) => {
    setServer(status);
    if (!status.lastRun || status.lastRun === lastServerRun.current) return;

    // a new server run: show it, and refresh lists (not on the first check)
    const firstCheck = lastServerRun.current === null;
    lastServerRun.current = status.lastRun;
    setLastSync({ at: new Date(status.lastRun), saved: status.lastSaved });
    setError(status.error);
    if (!firstCheck) {
      setVersion((v) => v + 1);
      if (status.lastSaved) setNewIds(status.newIds);
    }
  };
  const checkServer = () =>
    fetch('/api/sync')
      .then((r) => (r.ok ? r.json() : null))
      .then((status) => status && applyServerStatus(status))
      .catch(() => {});

  useInterval(checkServer, myTag ? 30_000 : null);
  useEffect(() => {
    if (myTag) checkServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myTag]);

  const syncNow = async () => {
    setNextIn(SYNC_EVERY);
    if (!myTag) {
      setError('Save your player tag first');
      return;
    }
    setSyncing(true);
    try {
      const res = await fetch('/api/encounters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag: myTag }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');

      setError(null);
      setLastSync({ at: new Date(), saved: data.saved });
      if (data.saved) setNewIds(data.newIds);
      setVersion((v) => v + 1);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSyncing(false);
    }
  };

  // countdown, and resync when it hits 0 (it starts at 0, so turning it on syncs right away)
  useInterval(
    () => {
      if (nextIn <= 1) syncNow();
      else setNextIn(nextIn - 1);
    },
    enabled && !syncing && !serverManaged ? 1000 : null
  );

  return (
    <SyncContext.Provider
      value={{
        enabled,
        setEnabled,
        syncing,
        nextIn,
        lastSync,
        newIds,
        error,
        version,
        syncNow,
        serverManaged,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error('useSync must be used inside <SyncProvider>');
  return ctx;
}
