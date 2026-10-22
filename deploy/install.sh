#!/bin/bash
# Installs/refreshes the CR Assistant systemd units and the Tailscale HTTPS address.
# Safe to re-run after changing anything in deploy/ (the updater pulls new code,
# but only this script installs unit files).
#   sudo ~/cr-assistant/deploy/install.sh
set -euo pipefail

[ "$(id -u)" = 0 ] || { echo "Run with sudo: sudo $0" >&2; exit 1; }
user="${SUDO_USER:?run via sudo from your normal user}"
home=$(getent passwd "$user" | cut -d: -f6)
src="$(cd "$(dirname "$0")" && pwd)"

units=(cr-assistant.service cr-assistant-update.service cr-assistant-update.timer
  cr-assistant-backup.service cr-assistant-backup.timer cr-assistant-failed@.service)

# The unit files are written for user "maxim"; adapt them to whoever runs this.
for u in "${units[@]}"; do
  sed -e "s#/home/maxim/#$home/#g" -e "s/^User=maxim$/User=$user/" "$src/$u" >"/etc/systemd/system/$u"
done
chmod +x "$src"/*.sh

# The updater may restart the app, and nothing else, without a password.
rule="/etc/sudoers.d/92-cr-assistant-restart"
echo "$user ALL=(root) NOPASSWD: /usr/bin/systemctl restart cr-assistant.service" >"$rule.tmp"
chmod 440 "$rule.tmp" && visudo -cq -f "$rule.tmp" && mv "$rule.tmp" "$rule"

systemctl daemon-reload
systemctl enable -q cr-assistant.service cr-assistant-update.timer cr-assistant-backup.timer
systemctl restart cr-assistant-update.timer cr-assistant-backup.timer
systemctl restart cr-assistant.service

# Private HTTPS on the tailnet: https://<machine>.<tailnet>.ts.net:8443
tailscale serve --bg --https=8443 http://127.0.0.1:8788

systemctl list-timers 'cr-assistant-*' --no-pager
systemctl is-active cr-assistant.service
