// GET ?deck=26000014.1,26000006.2,26000010,... -> JPEG of the deck (see lib/deckImage.tsx)
// Each card is "id" or "id.evolutionLevel" (1 = evolution, 2 = hero).
import { errorResponse } from '@/lib/clashApi';
import { parseDeckParam, renderDeckImage } from '@/lib/deckImage';

export async function GET(req: Request) {
  const deck = parseDeckParam(new URL(req.url).searchParams.get('deck') ?? '');
  try {
    const jpeg = await renderDeckImage(deck);
    return new Response(new Uint8Array(jpeg), {
      headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=86400' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
