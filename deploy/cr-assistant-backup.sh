#!/bin/bash
# Nightly SQLite backup: consistent snapshot (safe while the app runs), integrity check,
# gzip, keep the newest 30. Alerts via ntfy if anything goes wrong.
# Restore: stop the app, gunzip a backup over data/cr-assistant.db, start the app.
set -uo pipefail

src="$HOME/cr-assistant/data/cr-assistant.db"
dir="${BACKUP_DIR:-$HOME/backups/cr-assistant}"
keep=30
out="$dir/cr-assistant-$(date +%F).db"

fail() {
  echo "$1" >&2
  "$HOME/cr-assistant/deploy/notify.sh" "💾 CR Assistant backup failed" "$1" 4
  rm -f "$out.tmp"
  exit 1
}

mkdir -p "$dir" || fail "Can't create $dir"
[ -f "$src" ] || fail "Database not found at $src"
sqlite3 "$src" ".backup '$out.tmp'" || fail "sqlite3 .backup failed"
[ "$(sqlite3 "$out.tmp" 'PRAGMA integrity_check;')" = "ok" ] || fail "The new backup failed its integrity check"
gzip -f "$out.tmp" && mv -f "$out.tmp.gz" "$out.gz" || fail "Compressing the backup failed"

ls -1t "$dir"/cr-assistant-*.db.gz | tail -n +$((keep + 1)) | xargs -r rm --
echo "Backed up to $out.gz ($(du -h "$out.gz" | cut -f1)); $(ls "$dir"/cr-assistant-*.db.gz | wc -l) backups kept"
