#!/bin/bash
# Render a local HTML page to a PNG with headless Chrome, at 2x by default.
# Usage: render.sh <page.html> <out.png> [width] [height] [query] [scale]
#   query is passed to the page, e.g. "theme=dark&dir=rtl&lang=ar".
# Gives up after 45 seconds (headless Chrome sometimes hangs); run it again.
set -euo pipefail
page="$1"; out="$2"; w="${3:-1200}"; h="${4:-800}"; query="${5:-}"; scale="${6:-2}"
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$chrome" ] || { echo "Google Chrome is not installed at $chrome" >&2; exit 1; }
abs="$(cd "$(dirname "$page")" && pwd)/$(basename "$page")"
url="file://$abs${query:+?$query}"
scheme=1
case "$query" in *theme=dark*) scheme=0 ;; esac
mkdir -p "$(dirname "$out")"
rm -f "$out"
"$chrome" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --blink-settings=preferredColorScheme=$scheme --force-device-scale-factor="$scale" \
  --window-size="$w,$h" --virtual-time-budget=5000 --screenshot="$out" "$url" 2>/dev/null &
pid=$!
for _ in $(seq 1 45); do kill -0 "$pid" 2>/dev/null || break; sleep 1; done
if kill -0 "$pid" 2>/dev/null; then kill "$pid"; pkill -P "$pid" 2>/dev/null || true; fi
[ -s "$out" ] || { echo "render failed for $url, try again" >&2; exit 1; }
sips -g pixelWidth -g pixelHeight "$out" | grep pixel
