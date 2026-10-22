#!/bin/bash
# Pulls origin/main, and if it changed: install and migrate (if needed), lint, build, restart.
# If any step fails it rolls back to the previous commit, keeps running that, sends an
# alert, and doesn't retry that same commit again.
# Run by cr-assistant-update.timer; logs: journalctl -u cr-assistant-update
set -uo pipefail

# Everything is inside main() so bash has read the whole script before `git reset`
# replaces this file with a newer version.
main() {
  cd "$HOME/cr-assistant" || exit 1
  local notify="$HOME/cr-assistant/deploy/notify.sh"
  local failed_file="$HOME/.cache/cr-assistant-failed-commit"

  git fetch -q origin main || { echo "git fetch failed" >&2; exit 0; }
  local old new subject
  old=$(git rev-parse HEAD)
  new=$(git rev-parse origin/main)
  [ "$old" = "$new" ] && exit 0
  [ "$(cat "$failed_file" 2>/dev/null)" = "$new" ] && exit 0 # already failed, wait for a fix

  subject=$(git log -1 --format=%s "$new")
  echo "Updating ${old:0:7} -> ${new:0:7}: $subject"
  git reset -q --hard "$new"

  if install_if_needed "$old" "$new" && migrate_if_needed "$old" "$new" && npm run lint && npm run build; then
    sudo systemctl restart cr-assistant.service
    rm -f "$failed_file"
    echo "Deployed ${new:0:7}"
    "$notify" "🚀 CR Assistant ${new:0:7} deployed" "$subject" 1
  else
    echo "Checks failed for ${new:0:7}, rolling back to ${old:0:7}" >&2
    mkdir -p "$(dirname "$failed_file")" && echo "$new" >"$failed_file"
    git reset -q --hard "$old"
    npm ci && npm run build && sudo systemctl restart cr-assistant.service
    "$notify" "❌ CR Assistant ${new:0:7} not deployed" \
      "\"$subject\" failed install/migrate/lint/build. Still running ${old:0:7}. Details: journalctl -u cr-assistant-update" 4
    exit 1
  fi
}

# npm ci only when the dependencies changed (it's slow and wipes node_modules)
install_if_needed() {
  git diff --quiet "$1" "$2" -- package.json package-lock.json && [ -d node_modules ] && return 0
  npm ci
}

# prisma migrate deploy only when there are new migrations. The running app (match sync)
# can briefly hold the database lock, so retry a few times instead of failing on it.
migrate_if_needed() {
  git diff --quiet "$1" "$2" -- prisma/migrations && return 0
  local i
  for i in 1 2 3 4 5; do
    npx prisma migrate deploy && return 0
    echo "Migration failed (attempt $i), retrying in 5 s" >&2
    sleep 5
  done
  return 1
}

main "$@"
exit
