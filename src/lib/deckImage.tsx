// lib/deckImage.tsx
// Picture of a deck for the phone notification: a square 3 x 3 grid (the 8 cards and
// the average elixir). Square, because iOS crops notification thumbnails to a square
// and cuts off the bottom of tall pictures in expanded notifications.
// Saved as JPEG (~10x smaller than PNG, it has to reach a phone quickly) and kept in
// memory, so /api/scan can start drawing it before the shortcut even asks for it.
import { clashApi } from '@/lib/clashApi';
import type { CardInfo } from '@/types/battle';
import { ImageResponse } from 'next/og';
import sharp from 'sharp';

const TILE = 210; // square tile per card
const GAP = 6;
const SIZE = TILE * 3 + GAP * 4;

// Card art is 285 x 420 with transparent space around the card frame (and room for the
// evolution / hero crown on top). We crop to the frame: x 14-271, y 66-388.
const ART = { w: 285, h: 420, frameX: 14, frameY: 66, frameW: 257, frameH: 322 };
const scale = TILE / ART.frameH;

// [card id, evolution level (0, 1 = evolution, 2 = hero)]
export type DeckSlot = [id: number, evo: number];

// "26000014.1,26000006" <-> [[26000014, 1], [26000006, 0]]
export const parseDeckParam = (param: string): DeckSlot[] =>
  param
    .split(/[,;]/) // commas: proxies like `tailscale serve` drop queries containing ";"
    .filter(Boolean)
    .slice(0, 8)
    .map((c) => {
      const [id, evo] = c.split('.').map(Number);
      return [id, evo || 0];
    });

export const deckParam = (cards: CardInfo[]) =>
  cards.map((c) => (c.evolutionLevel ? `${c.id}.${c.evolutionLevel}` : c.id)).join(',');

// On globalThis, so /api/scan and /api/deck-image share them (they can be separate module copies)
const g = globalThis as typeof globalThis & {
  deckImages?: Map<string, Promise<Buffer>>;
  cardArt?: Map<string, Promise<string>>;
};
const rendered = (g.deckImages ??= new Map()); // deck -> JPEG
const art = (g.cardArt ??= new Map()); // image URL -> data URL

// The JPEG for a deck; the same deck asked twice is only drawn once
export function renderDeckImage(deck: DeckSlot[]): Promise<Buffer> {
  const key = deck.map(([id, evo]) => `${id}.${evo}`).join(',');
  let image = rendered.get(key);
  if (!image) {
    image = draw(deck);
    image.catch(() => rendered.delete(key)); // a failed drawing can be retried
    rendered.set(key, image);
    if (rendered.size > 100) rendered.delete(rendered.keys().next().value!); // keep the newest 100
  }
  return image;
}

// Card artwork, downloaded once and kept as a data URL
function cardArt(url: string) {
  let data = art.get(url);
  if (!data) {
    data = fetch(url)
      .then((r) => r.arrayBuffer())
      .then((b) => `data:image/png;base64,${Buffer.from(b).toString('base64')}`);
    data.catch(() => art.delete(url));
    art.set(url, data);
  }
  return data;
}

async function draw(deck: DeckSlot[]): Promise<Buffer> {
  // every card's artwork URLs, cached for a day
  const { items } = await clashApi<{ items: CardInfo[] }>('/cards', 86400);
  const byId = new Map(items.map((c) => [c.id, c]));
  const deckCards = deck.map(([id, evo]) => ({ card: byId.get(id), evo }));

  const images = await Promise.all(
    deckCards.map(({ card, evo }) => {
      const icons = card?.iconUrls;
      const url =
        (evo === 1 && icons?.evolutionMedium) || (evo === 2 && icons?.heroMedium) || icons?.medium;
      return url ? cardArt(url) : null;
    })
  );
  const costs = deckCards.map(({ card }) => card?.elixirCost).filter((c) => c != null);
  const avg = costs.length ? (costs.reduce((a, b) => a + b, 0) / costs.length).toFixed(1) : '?';

  const tile = {
    width: TILE,
    height: TILE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const;

  const png = await new ImageResponse(
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
    { width: SIZE, height: SIZE }
  ).arrayBuffer();

  return sharp(Buffer.from(png)).jpeg({ quality: 82 }).toBuffer();
}
