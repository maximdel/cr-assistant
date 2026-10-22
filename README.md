# CR Assistant

A personal Clash Royale companion that runs on your own computer. It's built to help you **learn from your matches**, not just look up stats.

- **Scout**: type (or send from your phone) your opponent's name and clan when a match starts. The app finds who it is and shows the decks they've played recently (the one they used last first), your record against them, and **how you've done against decks like theirs** (same deck, or 7 or 6 cards in common), including which of your decks did best.
- **Match history**: your battles are saved automatically, with both decks, the result and the full battle data. The game's battle log only keeps your last ~25 battles, so anything the app doesn't save is lost.
- **Players**: look up anyone by tag and star the ones you want to keep around.
- **Rankings**: Path of Legends leaderboards, global or for the countries you pick, with your own rank and the Elo needed for each milestone.

- **Copy any deck**: every deck has a *Copy deck link* / *Open in game* link (the official Clash Royale deck link; on your phone it opens the deck in the game).

> Coming next: deeper analytics on your own matches (per-card win rates, your worst matchups, and so on).

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

Click **Sync off** in the header (or use the switch on the home page). When the app runs on a server with `SYNC_TAG` set, the server does this by itself and the header shows **Synced … ago** instead. While the app is open, on any page, it checks your battle log every 2 minutes and saves new 1v1 Ladder, Ranked, Challenge and Clan War battles. Events, friendlies and boat battles are skipped. Sync stays on after you reload. Newly saved matches are marked **new** in the list on the home page; click a match to see both decks.

## How Scout finds your opponent

The official API can't search players by name, so Scout combines three sources:

1. **Players you've played before** (from your saved matches): found by name alone.
2. **Clan members**: if you give (part of) the clan name, it searches matching clans and their members. Members who were **online in the last few minutes** are ranked first, since your opponent is in a match with you right now.
3. **Path of Legends leaderboards**: the global one plus the countries saved on the Rankings page, for higher ranked opponents.

Tips:
- Any **3 or more characters** of the clan name work, in any script, so you can type just the latin part of a clan name. A clan tag (`#ABC123`) works too.
- Names are matched loosely: case, accents and fancy unicode letters don't matter (`xorg` finds `ⓍⓄⓇⒼ`), and small OCR mistakes are tolerated.
- Opponents without a clan can only be found if you've played them before or they're on a leaderboard.
- When one result is a clear match, its decks open straight away. The top results are loaded in the background, so picking another one is instant.
- **Recently scouted** keeps your last 10 lookups one click away, and shows how each match went once sync has saved it.
- The "How you do against this deck" section uses the deck they used last. Click *My record vs this* on another deck to check that one instead.

## Scouting from your phone

During a match, double-tap the back of your iPhone: a Shortcut screenshots the game,
iOS reads your opponent's name and clan, and a notification shows who it found and
their deck, with a picture of the cards. Set it up with **[docs/SHORTCUT.md](docs/SHORTCUT.md)**.

## Hosting it on a home server

Run the app on an always-on machine, reachable privately from your phone through
Tailscale. The server then also saves your matches by itself, with no browser open, and
updates itself when you push to GitHub. See **[docs/DEPLOY.md](docs/DEPLOY.md)**.

## Scripts

| Command | What it does |
|---|---|
| `npm run setup` | First-time setup (safe to re-run) |
| `npm run dev` | Start the app at http://localhost:3000 |
| `npm run dev:phone` | Same, but reachable from your phone on the same Wi‑Fi |
| `npm run build` / `npm start` | Production build, slightly faster |
| `npm run db:studio` | Browse your saved data in Prisma Studio |
| `npm run lint` | Lint the code |

`npm run setup` also turns on two git hooks that refuse to commit or push private details (API keys, Tailscale names and IPs, home IPs, ntfy topics), since the repo is public. See `scripts/check-private.sh`.

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
- **The phone shortcut doesn’t reach the app**: on a server, check the Tailscale VPN is on in your phone; locally, use `npm run dev:phone` with both devices on the same Wi‑Fi. Check the URL in the shortcut.

---

Not affiliated with Supercell. This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. See [Supercell's Fan Content Policy](https://supercell.com/en/fan-content-policy/).
