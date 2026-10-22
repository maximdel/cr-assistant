// src/app/api/scan/route.ts
// The iPhone shortcut posts the text of an in-match screenshot here.
// We find the opponent, and answer with what the shortcut shows as a notification:
//   title = their name · clan (so you can check what was read)
//   body  = their cards
//   image = picture of the deck
// The Scout page also opens them (through the phone push).
import { clashApi, errorResponse, normalizeTag } from '@/lib/clashApi';
import { recentDecks } from '@/lib/deck';
import { SYNCED_TYPES } from '@/lib/gameTypes';
import { searchOpponents } from '@/lib/opponentSearch';
import { push } from '@/lib/phonePush';
import { readScreenText } from '@/lib/screenText';
import type { BattleLogEntry, CardInfo } from '@/types/battle';
import type { PlayerProfile } from '@/types/player';
import type { Candidate } from '@/types/search';
import { NextResponse } from 'next/server';

// Body: { "text": "<everything iOS read from the screenshot>", "myTag": "#ABC" (optional) }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const text = String(body.text ?? '');
  const myTag = body.myTag || process.env.SYNC_TAG;

  try {
    // your own name and clan can be on screen too: ignore them
    const me = myTag
      ? await clashApi<PlayerProfile>(`/players/${encodeURIComponent(normalizeTag(myTag))}`, 600).catch(
          () => null
        )
      : null;
    const { lines, guesses } = readScreenText(text, [me?.name ?? '', me?.clan?.name ?? '']);

    if (!guesses.length) {
      return NextResponse.json({ found: false, title: 'Nothing read', body: 'No text found on the screenshot.', lines });
    }

    // try each guess, keep the best match overall
    const results = await Promise.all(guesses.map((g) => searchOpponents(g)));
    const best = results
      .flatMap((r) => r.candidates)
      .sort((a, b) => b.score - a.score)[0] as Candidate | undefined;

    if (!best) {
      const g = guesses[0];
      return NextResponse.json({
        found: false,
        title: 'Opponent not found',
        body: `Read “${g.name}”${g.clan ? ` / “${g.clan}”` : ''}`,
        lines,
      });
    }

    // their deck: the last ranked one if they have one, else the last one in any synced mode
    const log = await clashApi<BattleLogEntry[]>(`/players/${encodeURIComponent(best.tag)}/battlelog`);
    const deck = recentDecks(log, ['pathOfLegend']).latest ?? recentDecks(log, SYNCED_TYPES).latest;

    // open them on the Scout page too
    push(best.name, best.clanName ?? '');

    return NextResponse.json({
      found: true,
      title: `${best.name} · ${best.clanName ?? 'No clan'}`,
      body: deck ? deck.map(cardLabel).join(', ') : 'No recent battles',
      image: deck ? deckImageUrl(req, deck) : null,
      player: { tag: best.tag, name: best.name, clan: best.clanName ?? null },
      lines,
    });
  } catch (err) {
    return errorResponse(err);
  }
}

const cardLabel = (c: CardInfo) =>
  c.evolutionLevel === 1 ? `Evo ${c.name}` : c.evolutionLevel === 2 ? `Hero ${c.name}` : c.name;

// absolute URL, the shortcut downloads it for the notification
function deckImageUrl(req: Request, deck: CardInfo[]) {
  const base =
    process.env.PUBLIC_URL ??
    `${req.headers.get('x-forwarded-proto') ?? 'http'}://${req.headers.get('x-forwarded-host') ?? req.headers.get('host')}`;
  const cards = deck.map((c) => (c.evolutionLevel ? `${c.id}.${c.evolutionLevel}` : c.id)).join(',');
  return `${base}/api/deck-image?deck=${cards}`;
}
