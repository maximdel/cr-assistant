// GET ?deck=26000014.1,26000006.2,26000010,... -> PNG of the deck
// Each card is "id" or "id.evolutionLevel" (1 = evolution, 2 = hero).
// Used for the picture in the phone notification. It's square (3 x 3: the 8 cards and
// the average elixir), because iOS crops notification thumbnails to a square, and an
// expanded notification shows it at full width, so each card gets a third of the screen.
import { clashApi, errorResponse } from '@/lib/clashApi';
import type { CardInfo } from '@/types/battle';
import { ImageResponse } from 'next/og';

const CARD_W = 200;
const CARD_H = 240;
const GAP = 6;
const SIZE_W = CARD_W * 3 + GAP * 4;
const SIZE_H = CARD_H * 3 + GAP * 4;

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

  const tile = { width: CARD_W, height: CARD_H, display: 'flex' } as const;

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: GAP,
        padding: GAP,
        width: SIZE_W,
        height: SIZE_H,
        background: '#0a0e1a',
      }}
    >
      {images.map((src, i) =>
        src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} width={CARD_W} height={CARD_H} alt="" />
        ) : (
          <div key={i} style={{ ...tile, background: '#1a2238' }} />
        ),
      )}
      {/* 9th tile: average elixir */}
      <div
        style={{
          ...tile,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
          background: '#1a2238',
          color: '#d158f0',
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700 }}>{avg}</div>
        <div style={{ fontSize: 30, color: '#8b93a9' }}>avg elixir</div>
      </div>
    </div>,
    {
      width: SIZE_W,
      height: SIZE_H,
      headers: { 'Cache-Control': 'public, max-age=86400' },
    },
  );
}
