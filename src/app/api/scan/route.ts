// src/app/api/scan/route.ts
// The iPhone shortcut posts the text of an in-match screenshot here.
// We find the opponent, and answer with what the shortcut shows as a notification:
//   title = their name · clan (so you can check what was read)
//   body  = their deck's archetype ("Log Bait"), and your record against this player
//   image = picture of the deck
// The Scout page also opens them (through the phone push).
import { deckArchetype } from '@/lib/archetype';
import { clashApi, errorResponse, normalizeTag } from '@/lib/clashApi';
import { recentDecks } from '@/lib/deck';
import { deckParam, parseDeckParam, renderDeckImage } from '@/lib/deckImage';
import { SYNCED_TYPES } from '@/lib/gameTypes';
import { searchOpponents } from '@/lib/opponentSearch';
import { push } from '@/lib/phonePush';
import { prisma } from '@/lib/prisma';
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

    // the first guess (top two lines) is nearly always right: only try the others if it
    // finds nobody convincing, which saves a lot of API calls
    const bestOf = (results: { candidates: Candidate[] }[]) =>
      results.flatMap((r) => r.candidates).sort((a, b) => b.score - a.score)[0] as
        | Candidate
        | undefined;
    let best = bestOf([await searchOpponents(guesses[0])]);
    if (!best || best.score < 0.85) {
      const others = await Promise.all(guesses.slice(1).map((g) => searchOpponents(g)));
      best = bestOf([{ candidates: best ? [best] : [] }, ...others]);
    }

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

    // start drawing the picture now: it's ready by the time the shortcut asks for it
    if (deck) renderDeckImage(parseDeckParam(deckParam(deck))).catch(() => {});

    // open them on the Scout page too
    push(best.name, best.clanName ?? '');

    // your record against them, if you've met before
    const met = myTag
      ? await prisma.encounter.findMany({
          where: { myTag: normalizeTag(myTag), opponent: { tag: best.tag } },
          select: { result: true },
        })
      : [];
    const record = met.length
      ? ` · ${met.filter((r) => r.result === 'win').length}W ${met.filter((r) => r.result === 'loss').length}L vs them`
      : '';

    return NextResponse.json({
      found: true,
      title: `${best.name} · ${best.clanName ?? 'No clan'}`,
      body: (deck ? deckArchetype(deck) : 'No recent battles') + record,
      image: deck ? deckImageUrl(req, deck) : null,
      player: { tag: best.tag, name: best.name, clan: best.clanName ?? null },
      lines,
    });
  } catch (err) {
    return errorResponse(err);
  }
}

// absolute URL, the shortcut downloads it for the notification
function deckImageUrl(req: Request, deck: CardInfo[]) {
  const base =
    process.env.PUBLIC_URL ??
    `${req.headers.get('x-forwarded-proto') ?? 'http'}://${req.headers.get('x-forwarded-host') ?? req.headers.get('host')}`;
  return `${base}/api/deck-image?deck=${deckParam(deck)}`;
}
