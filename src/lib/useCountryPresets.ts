'use client';
import { useLocalStorage } from 'usehooks-ts';

export type Country = { id: number; name: string; countryCode?: string };

// Countries you picked on the rankings page. Scout also searches their leaderboards.
export function useCountryPresets() {
  const [presets, setPresets] = useLocalStorage<Country[]>('countryPresets', [], {
    initializeWithValue: false,
  });

  const addPreset = (c: Country) =>
    setPresets((prev) => (prev.some((p) => p.id === c.id) ? prev : [...prev, c]));
  const removePreset = (id: number) => setPresets((prev) => prev.filter((p) => p.id !== id));

  return { presets, addPreset, removePreset };
}
