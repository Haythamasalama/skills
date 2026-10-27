#!/usr/bin/env sh
# Links every skill and agent of this repo into Claude Code's personal folders, so they work in every project.
# Safe to run again: existing links are refreshed, real folders with the same name are left alone.
set -eu

ROOT="$(cd "$(dirname "$0")" && pwd)"
SKILLS_DIR="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
AGENTS_DIR="${CLAUDE_AGENTS_DIR:-$HOME/.claude/agents}"
mkdir -p "$SKILLS_DIR" "$AGENTS_DIR"

link() {
  source="$1"
  target="$2"
  if [ -L "$target" ]; then
    ln -sfn "$source" "$target"
  elif [ -e "$target" ]; then
    echo "skipped $(basename "$target"): a real file or folder already has this name in $(dirname "$target")"
    return
  else
    ln -s "$source" "$target"
  fi
  echo "linked  $(basename "$target")"
}

for skill in "$ROOT"/skills/*/; do
  [ -f "$skill/SKILL.md" ] && link "${skill%/}" "$SKILLS_DIR/$(basename "$skill")"
done

for agent in "$ROOT"/agents/*.md; do
  [ -f "$agent" ] && link "$agent" "$AGENTS_DIR/$(basename "$agent")"
done

echo "done: skills in $SKILLS_DIR, agents in $AGENTS_DIR"
