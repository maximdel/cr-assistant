// lib/screenText.ts
// Text read from an in-match screenshot (iOS "Extract Text from Image") -> guesses for
// the opponent's name and clan. They're at the top left of the screen, so they come
// first in reading order; the rest (timer, elixir, card costs, your own name) is noise.
import { nameSimilarity, simplify } from '@/lib/names';

// lines that are never a name: numbers, timers, "x2", game UI words
const JUNK = /^[\d\s:.,x×%+\-/()]*$/i;
const UI_WORDS = [
  'time left',
  'elixir',
  'overtime',
  'sudden death',
  'tiebreaker',
  'vs',
  'ranked',
  'ladder',
  'trophy road',
  'path of legends',
  'king',
  'level',
  'lvl',
  'next',
  'emote',
];

export type Guess = { name: string; clan: string };

export function readScreenText(text: string, ignore: string[] = []) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !JUNK.test(l))
    .filter((l) => !UI_WORDS.some((w) => simplify(l) === simplify(w) || l.toLowerCase().startsWith(`${w} `)))
    // your own name and clan can be on screen too
    .filter((l) => !ignore.some((mine) => mine && nameSimilarity(l, mine) >= 0.9));

  // most likely first: name + clan on the first two lines
  const [a, b, c] = lines;
  const guesses: Guess[] = [];
  if (a) guesses.push({ name: a, clan: b ?? '' });
  if (a && b) guesses.push({ name: a, clan: '' }); // no clan, b was something else
  if (b && c) guesses.push({ name: b, clan: c }); // something above the name was read too

  return { lines, guesses };
}
