#!/bin/bash
# Usage: notify.sh TITLE MESSAGE [PRIORITY 1-5]
# Sends a push alert through ntfy, using NTFY_URL from ~/cr-assistant/.env.
# Does nothing when NTFY_URL is empty. Never fails the caller.
url=$(grep -E '^NTFY_URL=' "$HOME/cr-assistant/.env" 2>/dev/null | tail -1 | cut -d= -f2-)
[ -n "$url" ] || exit 0
curl -s -m 10 -H "Title: $1" -H "Priority: ${3:-3}" -d "$2" "$url" >/dev/null || echo "notify failed" >&2
exit 0
