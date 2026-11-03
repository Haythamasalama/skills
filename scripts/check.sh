#!/usr/bin/env sh
# Checks the repo's shape: every skill stands alone, names are unique, frontmatter and size limits hold.
# Prints "ok" when there is nothing to fix.
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
problems=0

fail() { echo "$1"; problems=$((problems + 1)); }

frontmatter() {
  awk -v key="$2" 'NR==1&&/^---/{f=1;next} f&&/^---/{exit} f&&$0~"^ *"key":"{sub("^ *"key": *",""); print; exit}' "$1"
}

all_names=""
for skill in "$ROOT"/skills/*/; do
  all_names="$all_names $(basename "$skill")"
done

# A skill of ours must not take the name of a recommended one, or installing both overwrites one.
if [ -f "$ROOT/skills-lock.json" ]; then
  for name in $all_names; do
    grep -q "\"$name\": {" "$ROOT/skills-lock.json" && fail "skills/$name: same name as a skill in skills-lock.json"
  done
fi

for skill in "$ROOT"/skills/*/; do
  name="$(basename "$skill")"
  rel="skills/$name"
  file="$skill/SKILL.md"
  if [ ! -f "$file" ]; then fail "$rel: missing SKILL.md"; continue; fi
  [ "$(frontmatter "$file" name)" = "$name" ] || fail "$rel: frontmatter name is not \"$name\""
  [ -n "$(frontmatter "$file" description)" ] || fail "$rel: frontmatter description is empty"
  case "$(frontmatter "$file" description)" in
    \"*|\'*) ;;
    *": "*) fail "$rel: description has an unquoted \": \", which breaks YAML; wrap it in double quotes" ;;
  esac
  [ -n "$(frontmatter "$file" tags)" ] || fail "$rel: frontmatter metadata.tags is empty"
  lines=$(wc -l < "$file")
  [ "$lines" -le 250 ] || fail "$rel/SKILL.md: $lines lines (limit 250)"
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
    # A library can share a skill's name, so only references to it as a skill count.
    hits=$(grep -rniE --include='*.md' -e "(^|[^a-z0-9-])$other[\`*\]]*( \(?the\)?)? skill|skills?[\`*:]* +(the )?[\`*\[]*$other([^a-z0-9-]|\$)|/$other/" "$skill" | grep -v "skills-check: allow")
    [ -z "$hits" ] || fail "$rel: mentions the skill \"$other\":
$(echo "$hits" | sed "s|$ROOT/||" | head -5)"
  done
done

# The README is the repo's front page, so it must list every skill, and its badges must match the counts.
readme="$ROOT/README.md"
for name in $all_names; do
  grep -q "](skills/$name)" "$readme" || fail "README.md: skill \"$name\" is not listed"
done
lock_names=$(sed -n 's/^    "\([^"]*\)": {$/\1/p' "$ROOT/skills-lock.json")
for name in $lock_names; do
  grep -q "\[$name\](" "$readme" || fail "README.md: recommended skill \"$name\" is not listed"
done
own_count=$(echo $all_names | wc -w | tr -d ' ')
lock_count=$(echo $lock_names | wc -w | tr -d ' ')
grep -q "badge/skills-$own_count-" "$readme" || fail "README.md: the skills badge should say $own_count"
grep -q "badge/recommended-$lock_count-" "$readme" || fail "README.md: the recommended badge should say $lock_count"

if [ "$problems" -eq 0 ]; then
  echo ok
else
  echo
  echo "$problems problem(s). Fix them, or mark a deliberate line with 'skills-check: allow'."
  exit 1
fi
