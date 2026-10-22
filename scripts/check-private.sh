#!/bin/bash
# Blocks commits/pushes that would publish private details: API keys, private keys,
# Tailscale hostnames and IPs, home network IPs, ntfy topics. The repo is public.
# Used by .githooks/pre-commit and .githooks/pre-push (enabled by `npm run setup`).
#   scripts/check-private.sh staged          # what's about to be committed
#   scripts/check-private.sh range A..B      # commits about to be pushed (any git log range)
# Bypass for a known false positive: git commit/push --no-verify
set -uo pipefail

PATTERNS=(
  'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.'         # API key / JWT
  'BEGIN [A-Z ]*PRIVATE KEY'                             # SSH / TLS private key
  '[a-z0-9-]+\.tail[0-9a-f]{4,}\.ts\.net'                # Tailscale MagicDNS name
  '(^|[^0-9.])100\.(6[4-9]|[7-9][0-9]|1[01][0-9]|12[0-7])\.[0-9]{1,3}\.[0-9]{1,3}' # Tailscale IP
  '(^|[^0-9.])192\.168\.[0-9]{1,3}\.[0-9]{1,3}'          # home network IP
  'ntfy\.sh/[A-Za-z0-9_-]*[0-9a-f]{8,}'                  # private ntfy topic
)
regex=$(IFS='|'; echo "${PATTERNS[*]}")

case "${1:-}" in
  staged) diff=$(git diff --cached -U0 -- . ':!package-lock.json') ;;
  range) diff=$(git log -p -U0 --format= "${@:2}" -- . ':!package-lock.json') ;;
  *) echo "usage: $0 staged | range <git log range>" >&2; exit 2 ;;
esac

# only lines being added
hits=$(printf '%s\n' "$diff" | grep -E '^\+' | grep -v '^+++' | grep -nE "$regex")
[ -z "$hits" ] && exit 0

echo "✖ Blocked: this would publish something private (the repo is public):" >&2
printf '%s\n' "$hits" | cut -c1-160 | sed 's/^/   /' >&2
echo "Replace it with a placeholder, or use --no-verify if it's a false positive." >&2
exit 1
