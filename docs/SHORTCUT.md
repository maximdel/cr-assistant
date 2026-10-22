# Scouting from your phone (iPhone / iPad Shortcut)

During a match, one tap on the back of your phone: the Shortcut takes a screenshot,
reads your opponent's name and clan (top left of the screen), and a notification
shows **who it found**, the **type of deck** they play ("Log Bait", "Hog Cycle"…) and a picture of their cards. The Scout page
of the app (on a tablet or computer, if you have one open) opens them too.

```
 screenshot ─▶ iOS reads the text (on the phone) ─▶ POST /api/scan ─▶ notification
                                                     finds the opponent,
                                                     their last ranked deck
```

You don't need to time it: the name and clan stay at the top left for the whole
match. The text is read on the phone (iOS is very good at it, including Chinese,
Japanese and Korean); only the text is sent, not the image.

## What you need
- The app running somewhere your phone can reach, ideally your own server over
  Tailscale (see [DEPLOY.md](DEPLOY.md)). Below, `https://YOUR-SERVER` is that address,
  e.g. `https://<machine>.<tailnet>.ts.net:8443`.
- `SYNC_TAG` set on the server (or add `myTag` to the request, see below), so your
  own name on screen is ignored.

## Create the Shortcut
In the **Shortcuts** app, tap **+** and add these actions in order:

1. **Take Screenshot**
2. **Extract Text from** *Screenshot*
3. **Get Contents of URL**
   - URL: `https://YOUR-SERVER/api/scan`
   - Tap **Show More**: Method **POST**, Request Body **JSON**
   - Add a field: key `text`, type **Text**, value: the *Text* from step 2
4. **Get Dictionary Value** for key `image` in *Contents of URL*
5. **Get Contents of URL**: URL = *Dictionary Value* (this downloads the deck picture)
6. **Get Dictionary Value** for key `title` in the *Contents of URL* from step 3
7. **Get Dictionary Value** for key `body` in the *Contents of URL* from step 3
8. **Show Notification**
   - Title: the *Dictionary Value* from step 6
   - Body: the *Dictionary Value* from step 7
   - Attachment: the *Contents of URL* from step 5 (the picture)

Name it something short like **Scout**.

If the server has no `SYNC_TAG`, add a second JSON field in step 3: key `myTag`, value
your tag (e.g. `#ABC123`), so your own name on screen isn't mistaken for the opponent.

The answer looks like this:
```json
{
  "found": true,
  "title": "Ryu · But Destroy",
  "body": "Barrel Cycle · you 1W 0L",
  "image": "https://YOUR-SERVER/api/deck-image?deck=27000010.1,26000074,…",
  "lines": ["Ryu", "But Destroy"]
}
```
When nobody is found, `title` says so and `body` shows what was read, so you can see
if the text came out wrong. (`image` is then empty and step 5 just gets nothing.)

**See the cards big:** the picture next to the notification text is a small thumbnail
(iOS decides its size). **Long-press the notification** (or pull it down) to expand it:
the deck then fills the width of the screen, 3 cards per row.

## Trigger it without leaving the game
- **iPhone: Back Tap.** Settings → Accessibility → Touch → **Back Tap** → Double Tap →
  pick your Shortcut. Double-tap the back of the phone during a match.
- **iPad** (no Back Tap): Settings → Accessibility → Touch → **AssistiveTouch** → turn
  it on, and set a Custom Action (e.g. Double-Tap) to your Shortcut. Or just ask Siri:
  "Scout".

The first run asks for permission to take screenshots and to connect to your server;
allow both ("Always Allow").

## Tips
- The phone must be able to reach the server: with Tailscale, keep the Tailscale VPN on.
- Which deck is shown: their last **ranked** deck if they played ranked recently,
  otherwise their last deck in any mode the app tracks.
- The full picture (all their recent decks, your record against them and against
  decks like theirs) is on the Scout page.

## Without a server
Running the app on your computer works too: start it with `npm run dev:phone`, and use
`http://<your-computer-ip>:3000/api/scan` as the URL (same Wi‑Fi). Leave out the deck
picture steps, or set `PUBLIC_URL=http://<your-computer-ip>:3000` in `.env` so the
picture link works from the phone.
