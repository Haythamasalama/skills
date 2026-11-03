#!/usr/bin/env sh
# Checks the repo's shape: every skill stands alone, names are unique, frontmatter and size limits hold.
# Prints "ok" when there is nothing to fix.
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
problems=0

fail() { echo "$1"; problems=$((problems + 1)); }

frontmatter() {
  awk -v key="$2" 'NR==1&&/^---/{f=1;next} f&&/^---/{exit} f&&$0~"^"key":"{sub("^"key": *",""); print; exit}' "$1"
}

all_names=""
for pack in "$ROOT"/*/; do
  pack_name="$(basename "$pack")"
  [ -d "$pack/skills" ] || [ -d "$pack/agents" ] || continue
  [ -f "$pack/README.md" ] || fail "$pack_name: missing README.md"
  for skill in "$pack"/skills/*/; do
    [ -d "$skill" ] || continue
    all_names="$all_names $(basename "$skill")"
  done
  for agent in "$pack"/agents/*.md; do
    [ -f "$agent" ] || continue
    all_names="$all_names $(basename "$agent" .md)"
  done
done

dupes="$(printf '%s\n' $all_names | sort | uniq -d)"
[ -z "$dupes" ] || fail "names used more than once: $(echo $dupes)"

for skill in "$ROOT"/*/skills/*/; do
  name="$(basename "$skill")"
  rel="${skill#"$ROOT"/}"
  file="$skill/SKILL.md"
  if [ ! -f "$file" ]; then fail "$rel: missing SKILL.md"; continue; fi
  [ "$(frontmatter "$file" name)" = "$name" ] || fail "$rel: frontmatter name is not \"$name\""
  [ -n "$(frontmatter "$file" description)" ] || fail "$rel: frontmatter description is empty"
  lines=$(wc -l < "$file")
  [ "$lines" -le 250 ] || fail "$rel""SKILL.md: $lines lines (limit 250)"
  for ref in "$skill"/references/*.md; do
    [ -f "$ref" ] || continue
    lines=$(wc -l < "$ref")
    [ "$lines" -le 400 ] || fail "${ref#"$ROOT"/}: $lines lines (limit 400)"
  done

  # A skill must work when installed alone, so nothing may point outside its own folder.
  hits=$(grep -nE '\]\(\.\./' "$file"; grep -rnE --include='*.md' '\]\(\.\./\.\./' "$skill" | grep -v "/SKILL.md:" | sed "s|$ROOT/||")
  [ -z "$hits" ] || fail "$rel: links that leave the skill folder:
$hits"
  for other in $all_names; do
    [ "$other" = "$name" ] && continue
    # A library can share a skill's name (shadcn-vue), so only references to it as a skill count.
    hits=$(grep -rniE --include='*.md' -e "(^|[^a-z0-9-])$other[\`*\]]*( \(?the\)?)? skill|skills?[\`*:]* +(the )?[\`*\[]*$other([^a-z0-9-]|\$)|/$other/" "$skill" | grep -v "skills-check: allow")
    [ -z "$hits" ] || fail "$rel: mentions the skill \"$other\":
$(echo "$hits" | sed "s|$ROOT/||" | head -5)"
  done
done

for agent in "$ROOT"/*/agents/*.md; do
  [ -f "$agent" ] || continue
  name="$(basename "$agent" .md)"
  [ "$(frontmatter "$agent" name)" = "$name" ] || fail "${agent#"$ROOT"/}: frontmatter name is not \"$name\""
done

if [ "$problems" -eq 0 ]; then
  echo ok
else
  echo
  echo "$problems problem(s). Fix them, or mark a deliberate line with 'skills-check: allow'."
  exit 1
fi
