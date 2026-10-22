// GET ?deck=26000014.1;26000006.2;26000010;... -> PNG of the deck (4 x 2 cards)
// Each card is "id" or "id.evolutionLevel" (1 = evolution, 2 = hero).
// Used for the picture in the phone notification.
import { clashApi, errorResponse } from '@/lib/clashApi';
import type { CardInfo } from '@/types/battle';
import { ImageResponse } from 'next/og';

const CARD_W = 150;
const CARD_H = 180;
const GAP = 8;

export async function GET(req: Request) {
  const deck = (new URL(req.url).searchParams.get('deck') ?? '')
    .split(';')
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
  const images = deck.map(([id, evo]) => {
    const icons = byId.get(id)?.iconUrls;
    return (
      (evo === 1 && icons?.evolutionMedium) || (evo === 2 && icons?.heroMedium) || icons?.medium
    );
  });

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: GAP,
        padding: GAP,
        width: CARD_W * 4 + GAP * 5,
        background: '#0a0e1a',
      }}
    >
      {images.map((src, i) =>
        src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} width={CARD_W} height={CARD_H} alt="" />
        ) : (
          <div key={i} style={{ width: CARD_W, height: CARD_H, background: '#1a2238' }} />
        ),
      )}
    </div>,
    {
      width: CARD_W * 4 + GAP * 5,
      height: CARD_H * 2 + GAP * 3,
      headers: { 'Cache-Control': 'public, max-age=86400' },
    },
  );
}
