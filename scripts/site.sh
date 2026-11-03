#!/usr/bin/env sh
# Opens the skills browser at http://localhost:4321. It reads the packs live, so edits show at once.
set -eu

SITE="$(cd "$(dirname "$0")/../site" && pwd)"
[ -d "$SITE/node_modules" ] || npm --prefix "$SITE" install
exec npm --prefix "$SITE" run dev -- --open
