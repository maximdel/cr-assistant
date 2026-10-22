// GET ?deck=26000014.1,26000006.2,26000010,... -> PNG of the deck
// Each card is "id" or "id.evolutionLevel" (1 = evolution, 2 = hero).
// Used for the picture in the phone notification: a square 3 x 3 grid (the 8 cards and
// the average elixir). Square, because iOS crops notification thumbnails to a square
// and cuts off the bottom of tall pictures in expanded notifications.
import { clashApi, errorResponse } from '@/lib/clashApi';
import type { CardInfo } from '@/types/battle';
import { ImageResponse } from 'next/og';

const TILE = 210; // square tile per card
const GAP = 6;
const SIZE = TILE * 3 + GAP * 4;

// Card art is 285 x 420 with transparent space around the card frame (and room for the
// evolution / hero crown on top). We crop to the frame: x 14-271, y 66-388.
const ART = { w: 285, h: 420, frameX: 14, frameY: 66, frameW: 257, frameH: 322 };
const scale = TILE / ART.frameH;

export async function GET(req: Request) {
  const deck = (new URL(req.url).searchParams.get('deck') ?? '')
    .split(/[,;]/) // commas: proxies like `tailscale serve` drop queries containing ";"
    .filter(Boolean)
    .slice(0, 8)
    .map((c) => c.split('.').map(Number));

  // every card's artwork, cached for a day
  let cards: CardInfo[];
  try {
    cards = (await clashApi<{ items: CardInfo[] }>('/cards', 86400)).items;
  } catch (err) {
    return errorResponse(err);
  }
  const byId = new Map(cards.map((c) => [c.id, c]));
  const deckCards = deck.map(([id, evo]) => ({ card: byId.get(id), evo }));
  const images = deckCards.map(({ card, evo }) => {
    const icons = card?.iconUrls;
    return (
      (evo === 1 && icons?.evolutionMedium) || (evo === 2 && icons?.heroMedium) || icons?.medium
    );
  });
  const costs = deckCards.map(({ card }) => card?.elixirCost).filter((c) => c != null);
  const avg = costs.length ? (costs.reduce((a, b) => a + b, 0) / costs.length).toFixed(1) : '?';

  const tile = {
    width: TILE,
    height: TILE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const;

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: GAP,
        padding: GAP,
        width: SIZE,
        height: SIZE,
        background: '#0a0e1a',
      }}
    >
      {images.map((src, i) => (
        <div key={i} style={tile}>
          {/* the card frame only: the full art, shifted and clipped */}
          <div
            style={{
              display: 'flex',
              position: 'relative',
              overflow: 'hidden',
              width: ART.frameW * scale,
              height: ART.frameH * scale,
              borderRadius: 10,
              background: src ? 'transparent' : '#1a2238',
            }}
          >
            {src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                width={ART.w * scale}
                height={ART.h * scale}
                style={{ position: 'absolute', left: -ART.frameX * scale, top: -ART.frameY * scale }}
              />
            )}
          </div>
        </div>
      ))}
      {/* 9th tile: average elixir */}
      <div
        style={{
          ...tile,
          flexDirection: 'column',
          borderRadius: 16,
          background: '#1a2238',
          color: '#d158f0',
        }}
      >
        <div style={{ fontSize: 88, fontWeight: 700 }}>{avg}</div>
        <div style={{ fontSize: 28, color: '#8b93a9' }}>avg elixir</div>
      </div>
    </div>,
    {
      width: SIZE,
      height: SIZE,
      headers: { 'Cache-Control': 'public, max-age=86400' },
    },
  );
}
