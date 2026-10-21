'use client';

import { ALL_GAME_TYPES } from '@/lib/gameTypes';

// Toggle chips for the game modes
export function GameTypeFilter({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {ALL_GAME_TYPES.map(({ key, label }) => {
        const on = selected.includes(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              on
                ? 'border-primary/60 bg-primary/15 text-primary'
                : 'border-border text-muted hover:text-fg'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
