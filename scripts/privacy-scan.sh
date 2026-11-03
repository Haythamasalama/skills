#!/usr/bin/env sh
# Fails when anything private is about to be committed. Prints "clean" when there is nothing to fix.
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TERMS_FILE="${SKILLS_PRIVATE_TERMS:-$HOME/.config/skills/private-terms.txt}"
TARGETS="$ROOT/skills $ROOT/README.md $ROOT/CONVENTIONS.md $ROOT/skills-lock.json"
found=0

check() {
  label="$1"
  pattern="$2"
  hits=$(grep -rInE "$pattern" $TARGETS 2>/dev/null | grep -v "privacy-scan: allow" | grep -vE "${3:-^\$}")
  if [ -n "$hits" ]; then
    printf '\n[%s]\n%s\n' "$label" "$hits"
    found=1
  fi
}

check "absolute machine paths" '/Users/[A-Za-z]|/private/tmp/|/home/[a-z]+/'
check "tokens and keys" '(gh[opsu]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|xox[abp]-[A-Za-z0-9-]{10,}|EAA[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----)'
check "secrets in assignments" '(password|passwd|secret|api_key|apikey|access_token)[\"'"'"' ]*[:=][\"'"'"' ]*[A-Za-z0-9/+_-]{12,}'
check "email addresses" '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|net|org|io|sa|me|dev|co)\b' '@example\.(com|net|org)\b'
check "phone numbers" '(\+|00)966[0-9 ]{8,}|\b05[0-9]{8}\b|\b9200[0-9 ]{5,}'

if [ -f "$TERMS_FILE" ]; then
  terms=$(grep -vE '^\s*(#|$)' "$TERMS_FILE" | paste -sd '|' -)
  [ -n "$terms" ] && check "private names (from $TERMS_FILE)" "$terms"
fi

if [ "$found" -eq 0 ]; then
  echo clean
else
  echo
  echo "Fix the lines above (or mark a deliberate line with 'privacy-scan: allow'), then run again."
  exit 1
fi
