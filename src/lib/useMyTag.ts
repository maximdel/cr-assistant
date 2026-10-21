'use client';
import type { PlayerProfile } from '@/types/player';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

// Your own player tag, saved in the browser. Every component using this hook
// updates when it changes (e.g. when you save a new tag in the header).
export function useMyTag() {
  return useLocalStorage('myPlayerTag', '', {
    serializer: (v) => v,
    deserializer: (v) => v,
    initializeWithValue: false, // avoid hydration mismatches
  });
}

// Your profile from the API (name, trophies, current deck...), null until loaded
export function useMyProfile() {
  const [myTag] = useMyTag();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!myTag) return;
    let cancelled = false;
    fetch(`/api/players/${encodeURIComponent(myTag)}`)
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || 'Could not load your profile');
          setProfile(null);
        } else {
          setError(null);
          setProfile(data);
        }
      })
      .catch(() => !cancelled && setError('Could not load your profile'));
    return () => {
      cancelled = true;
    };
  }, [myTag]);

  // a cleared tag means no profile
  return { profile: myTag ? profile : null, error: myTag ? error : null };
}
