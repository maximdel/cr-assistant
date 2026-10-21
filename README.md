# CR Assistant

A personal Clash Royale companion that runs on your own computer. It's built to help you **learn from your matches**, not just look up stats.

- **Scout**: type (or send from your phone) your opponent's name and clan when a match starts. The app finds who it is and shows the decks they've played recently, the deck selected in their profile, and your record against them.
- **Match history**: your battles are saved automatically, with both decks, the result and the full battle data. The game's battle log only keeps your last ~25 battles, so anything the app doesn't save is lost.
- **Players**: look up anyone by tag and star the ones you want to keep around.
- **Rankings**: Path of Legends leaderboards, global or for the countries you pick, with your own rank and the Elo needed for each milestone.

> Coming next: matchup analytics (how you do against decks sharing 8/7/6 cards with a given list, per-card win rates, and so on).

## Quick start

You need [Node.js](https://nodejs.org) 20.19 or newer.

```bash
git clone https://github.com/maximdel/cr-assistant.git
cd cr-assistant
npm run setup
npm run dev
```

Then open http://localhost:3000, enter your player tag in the top right and click **Save**.

`npm run setup` installs everything, asks for your API key, creates the local database and checks that the key works. You can run it again at any time; it doesn't erase anything.

## Getting an API key

The app uses the official [Clash Royale API](https://developer.clashroyale.com).

1. Create an account at https://developer.clashroyale.com and go to **My Account → Create New Key**.
2. Under **Allowed IP addresses**, enter your public IP. If you don't know it, run `npm run setup`: when the key is refused, the error message shows the IP the API saw.
3. Put the key in `.env` as `CR_API_TOKEN=...`, or paste it when `npm run setup` asks.

**My IP keeps changing.** Home IPs change from time to time, and the key then stops working. To avoid that, use the [RoyaleAPI proxy](https://docs.royaleapi.com/proxy.html): create a key for the IP `45.79.218.79` and add this line to `.env`:

```
CR_API_BASE_URL=https://proxy.royaleapi.dev/v1
```

## Auto-saving your matches

Click **Sync off** in the header (or use the switch on the home page). While the app is open, on any page, it checks your battle log every 2 minutes and saves new 1v1 Ladder, Ranked, Challenge and Clan War battles. Events, friendlies and boat battles are skipped. Sync stays on after you reload. Newly saved matches are marked **new** in the list on the home page; click a match to see both decks.

## How Scout finds your opponent

The official API can't search players by name, so Scout combines three sources:

1. **Players you've played before** (from your saved matches): found by name alone.
2. **Clan members**: if you give (part of) the clan name, it searches matching clans and their members. Members who were **online in the last few minutes** are ranked first, since your opponent is in a match with you right now.
3. **Path of Legends leaderboards**: the global one plus the countries saved on the Rankings page, for higher ranked opponents.

Tips:
- Any **3 or more characters** of the clan name work, in any script, so you can type just the latin part of a clan name. A clan tag (`#ABC123`) works too.
- Names are matched loosely: case, accents and fancy unicode letters don't matter (`xorg` finds `ⓍⓄⓇⒼ`), and small OCR mistakes are tolerated.
- Opponents without a clan can only be found if you've played them before or they're on a leaderboard.
- When one result is a clear match, its decks open straight away.

## Sending your opponent from your phone (iPhone Shortcut)

At the start of a match, a Shortcut on your phone can screenshot the game, read the opponent's name and clan, and send them to the app. The Scout page then searches and shows their decks on its own. This is also the easiest way to search clan names in scripts you can't type: iOS text recognition handles many scripts, including Chinese, Japanese and Korean.

1. Start the app so your phone can reach it (same Wi‑Fi):
   ```bash
   npm run dev:phone
   ```
   Find your computer's local IP (on a Mac: `ipconfig getifaddr en0`).
2. In the **Shortcuts** app, create a shortcut with:
   - **Take Screenshot**
   - **Extract Text from Image** (optionally crop the screenshot to the name area first, for cleaner results)
   - **Get Contents of URL**: `http://<your-computer-ip>:3000/api/shortcut/text`, method **POST**, request body **JSON**, with either
     - `name` and `clan` fields, or
     - a single `text` field (the first line is read as the name, the second as the clan)
3. Tip: trigger it with **Back Tap** (Settings → Accessibility → Touch → Back Tap) so it's one double-tap on the back of your phone.

Keep the Scout page open on your computer (or tablet) and it'll update within a second.

> `npm run dev` only listens on your own computer. `npm run dev:phone` makes the app reachable by other devices on your network, so only use it on a network you trust.

## Scripts

| Command | What it does |
|---|---|
| `npm run setup` | First-time setup (safe to re-run) |
| `npm run dev` | Start the app at http://localhost:3000 |
| `npm run dev:phone` | Same, but reachable from your phone on the same Wi‑Fi |
| `npm run build` / `npm start` | Production build, slightly faster |
| `npm run db:studio` | Browse your saved data in Prisma Studio |
| `npm run lint` | Lint the code |

## How it's built

- [Next.js](https://nextjs.org) (App Router) + React + Tailwind CSS
- SQLite through [Prisma](https://www.prisma.io): your data stays in `prisma/dev.db` on your machine
- All Clash Royale API calls go through the app's own server (`src/app/api/`), so your key is never sent to the browser

```
src/
  app/            pages (/, /scout, /players, /rankings) and API routes (app/api)
  app/components/ deck display, match list, shared UI pieces
  lib/            API helper, database client, sync, name matching, deck helpers, game modes
  types/          shapes of the API responses
prisma/           database schema and migrations
scripts/          setup script
```

## Troubleshooting

- **"API key not allowed from this IP"**: your IP changed. Update the key's allowed IPs, or use the proxy (see above).
- **"CR_API_TOKEN is not set"**: add your key to `.env` and restart the app.
- **The phone shortcut doesn't reach the app**: use `npm run dev:phone`, check that both devices are on the same Wi‑Fi, and check the IP in the shortcut.

---

Not affiliated with Supercell. This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. See [Supercell's Fan Content Policy](https://supercell.com/en/fan-content-policy/).
