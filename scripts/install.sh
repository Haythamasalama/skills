#!/usr/bin/env sh
# Copies packs, skills or agents from this repo into a project's .claude folder (or ~/.claude with --global).
#
#   sh scripts/install.sh --list
#   sh scripts/install.sh laravel                    # a whole pack, into the current folder
#   sh scripts/install.sh laravel-ddd shadcn-vue --to ~/code/app
#   sh scripts/install.sh tooling --global
#
# A copy carries a .skills-repo file; only folders that have it are replaced on the next install.
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="$PWD"
FORCE=0
NAMES=""

usage() { sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'; exit "${1:-0}"; }

packs() {
  for dir in "$ROOT"/*/; do
    [ -d "$dir/skills" ] || [ -d "$dir/agents" ] && basename "$dir"
  done
}

description() {
  awk 'NR==1&&/^---/{f=1;next} f&&/^---/{exit} f&&/^description:/{sub(/^description: *"?/,""); print; exit}' "$1" | cut -c1-110
}

list() {
  for pack in $(packs); do
    echo "$pack"
    for skill in "$ROOT/$pack"/skills/*/; do
      [ -f "$skill/SKILL.md" ] && printf '  %-28s %s…\n' "$(basename "$skill")" "$(description "$skill/SKILL.md")"
    done
    for agent in "$ROOT/$pack"/agents/*.md; do
      [ -f "$agent" ] && printf '  %-28s agent\n' "$(basename "$agent" .md)"
    done
  done
}

while [ $# -gt 0 ]; do
  case "$1" in
    --list) list; exit 0 ;;
    --to) TARGET="${2:?--to needs a folder}"; shift ;;
    --global) TARGET="$HOME" ;;
    --force) FORCE=1 ;;
    -h|--help) usage ;;
    -*) echo "unknown option: $1" >&2; usage 1 ;;
    *) NAMES="$NAMES $1" ;;
  esac
  shift
done

[ -n "$NAMES" ] || usage 1
[ -d "$TARGET" ] || { echo "no such folder: $TARGET" >&2; exit 1; }
TARGET="$(cd "$TARGET" && pwd)"
[ "$TARGET" = "$ROOT" ] && { echo "refusing to install into the skills repo itself" >&2; exit 1; }

DEST="$TARGET/.claude"
COMMIT="$(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown)"

install_skill() {
  # POSIX sh has no local variables, so these names must not collide with the main loop's.
  skill_src="${1%/}"
  skill_name="$(basename "$skill_src")"
  skill_dst="$DEST/skills/$skill_name"
  if [ -e "$skill_dst" ] && [ ! -f "$skill_dst/.skills-repo" ] && [ "$FORCE" -eq 0 ]; then
    echo "skipped $skill_name: $skill_dst exists and was not installed from this repo (use --force)"
    return
  fi
  mkdir -p "$DEST/skills"
  rm -rf "$skill_dst"
  cp -R "$skill_src" "$skill_dst"
  printf 'pack=%s\ncommit=%s\n' "$2" "$COMMIT" > "$skill_dst/.skills-repo"
  echo "skill   $skill_name"
}

install_agent() {
  agent_src="$1"
  agent_file="$(basename "$agent_src")"
  agent_dst="$DEST/agents/$agent_file"
  if [ -e "$agent_dst" ] && ! cmp -s "$agent_src" "$agent_dst" && [ "$FORCE" -eq 0 ]; then
    echo "skipped agent $agent_file: a different $agent_dst exists (use --force)"
    return
  fi
  mkdir -p "$DEST/agents"
  cp "$agent_src" "$agent_dst"
  echo "agent   ${agent_file%.md}"
}

for name in $NAMES; do
  if [ -d "$ROOT/$name/skills" ] || [ -d "$ROOT/$name/agents" ]; then
    for skill in "$ROOT/$name"/skills/*/; do
      [ -f "$skill/SKILL.md" ] && install_skill "$skill" "$name"
    done
    for agent in "$ROOT/$name"/agents/*.md; do
      [ -f "$agent" ] && install_agent "$agent"
    done
    continue
  fi
  found=""
  for pack in $(packs); do
    if [ -f "$ROOT/$pack/skills/$name/SKILL.md" ]; then
      install_skill "$ROOT/$pack/skills/$name" "$pack"; found=1
    elif [ -f "$ROOT/$pack/agents/$name.md" ]; then
      install_agent "$ROOT/$pack/agents/$name.md"; found=1
    fi
  done
  [ -n "$found" ] || { echo "not found: $name (see --list)" >&2; exit 1; }
done

echo "done: $DEST"
