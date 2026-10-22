# Running CR Assistant on a home server

Host the app on an always-on Linux machine and reach it privately over HTTPS from your
phone, anywhere, through [Tailscale](https://tailscale.com). Nothing is exposed to the
public internet, so the app needs no login.

```
 phone / laptop ──Tailscale (HTTPS :8443)──▶ home server
                                              ├─ tailscale serve :8443 ─▶ 127.0.0.1:8788
                                              ├─ cr-assistant.service   (app + match sync)
                                              ├─ cr-assistant-update.timer (pulls GitHub main)
                                              └─ cr-assistant-backup.timer (nightly DB backup)
```

What you get:
- The app at `https://<machine>.<tailnet>.ts.net:8443`, only reachable from your devices.
- Your matches saved every 2 minutes by the server itself (`SYNC_TAG`), even when no
  browser is open.
- Every 5 minutes it checks GitHub: a new commit on `main` is installed, migrated,
  linted and built, then the app restarts on it. If anything fails it rolls back.
- A database backup every night, and optional push alerts through ntfy.

This follows the same setup as a typical Ubuntu + Tailscale home server. If the
machine is new, install Ubuntu Server, Node 24 (NodeSource) and Tailscale first.

## 1. Code and settings
```bash
git clone https://github.com/maximdel/cr-assistant.git ~/cr-assistant
cd ~/cr-assistant
cp .env.example .env && chmod 600 .env
mkdir -p data
```

Edit `.env`:

| Key | Value |
|---|---|
| `CR_API_TOKEN` | a Clash Royale API key created for the server's **public** IP |
| `DATABASE_URL` | `file:./data/cr-assistant.db` |
| `SYNC_TAG` | your tag, **in quotes**: `"#ABC123"` |
| `PUBLIC_URL` | `https://<machine>.<tailnet>.ts.net:8443` |
| `NTFY_URL` | optional: `https://ntfy.sh/cr-assistant-<random>` for alerts |

The API key must allow the IP your server goes out to the internet with (at home, the
same as your home computer). If it changes often, see "My IP keeps changing" in the
README.

```bash
npm ci && npx prisma migrate deploy && npm run build
```

## 2. Services
```bash
sudo ~/cr-assistant/deploy/install.sh
```

This installs and starts everything in `deploy/`, and makes the app available at
`https://<machine>.<tailnet>.ts.net:8443` (`tailscale serve`). Re-run it whenever
something in `deploy/` changes.

| Unit | What it does |
|---|---|
| `cr-assistant.service` | The app on 127.0.0.1:8788. Starts on boot, restarts on crash |
| `cr-assistant-update.timer` | Every 5 min: deploy new commits on `main` |
| `cr-assistant-backup.timer` | Every night ~03:45: database backup to `~/backups/cr-assistant` |
| `cr-assistant-failed@.service` | Alert when one of the above fails |
| `/etc/sudoers.d/92-cr-assistant-restart` | Lets the updater restart the app, nothing else |

## Day to day
| Task | Command (on the server) |
|---|---|
| Is it running? | `systemctl status cr-assistant` |
| App logs (live) | `journalctl -u cr-assistant -f` |
| What did the updater do? | `journalctl -u cr-assistant-update` |
| Which version is live? | `git -C ~/cr-assistant log --oneline -1` |
| Update right now | `sudo systemctl start cr-assistant-update` |
| Back up right now | `sudo systemctl start cr-assistant-backup` |

**Deploying a change** = pushing to `main`. Don't edit code on the server: the updater
resets it to `origin/main`. `.env` and `data/` are git-ignored and safe.

**Restore a backup:**
```bash
sudo systemctl stop cr-assistant
gunzip -c ~/backups/cr-assistant/cr-assistant-2026-11-20.db.gz > ~/cr-assistant/data/cr-assistant.db
sudo systemctl start cr-assistant
```

Next: set up the phone Shortcut, see [SHORTCUT.md](SHORTCUT.md).
