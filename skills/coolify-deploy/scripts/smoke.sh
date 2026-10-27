#!/usr/bin/env bash
# Smoke-test a running container (or any deployed URL) for the things that only break there:
# the health route, deep links, redirects, and cache headers.
#
#   bash smoke.sh http://localhost:8080 \
#     /healthz=200 \
#     /some/deep/link=200 \
#     /old-url=301:/new-url \
#     'header /index.html cache-control no-cache' \
#     'header /assets/app.js cache-control immutable'
#
# Checks:
#   PATH=CODE                 the status code must match
#   PATH=CODE:LOCATION        also the raw Location header (a relative one is expected; an
#                             absolute one with the right path passes with a warning)
#   'header PATH NAME TEXT'   the response header NAME must contain TEXT (case-insensitive)
#
# WAIT=30 bash smoke.sh …     poll the first check up to 30 s while the container starts.
# Exits 1 if any check fails. Read-only: plain GETs, nothing is posted.
set -u

if [ $# -lt 2 ]; then
  sed -n '2,20p' "$0"
  exit 2
fi

base="${1%/}"
shift
WAIT="${WAIT:-0}"
failed=0

fetch() {
  # prints the raw response headers of a GET, without following redirects
  curl -s -o /dev/null -D - --max-time 10 "$base$1" | tr -d '\r'
}

status_of() {
  printf '%s\n' "$1" | awk 'toupper($1) ~ /^HTTP\// { code = $2 } END { print code }'
}

header_of() {
  printf '%s\n' "$1" | awk -v name="$2" 'BEGIN { name = tolower(name) }
    { split($0, parts, ":"); if (tolower(parts[1]) == name) { sub(/^[^:]*:[[:space:]]*/, ""); value = $0 } }
    END { print value }'
}

if [ "$WAIT" -gt 0 ]; then
  first="${1#header }"
  first="${first%%=*}"
  first="${first%% *}"
  for _ in $(seq "$WAIT"); do
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 "$base$first")
    [ "$code" != "000" ] && break
    sleep 1
  done
fi

for check in "$@"; do
  if [ "${check#header }" != "$check" ]; then
    read -r _ path name text <<< "$check"
    headers=$(fetch "$path")
    value=$(header_of "$headers" "$name")
    if printf '%s' "$value" | grep -qi -- "$text"; then
      printf 'ok    %-40s %s: %s\n' "$path" "$name" "$value"
    else
      printf 'FAIL  %-40s %s: "%s" (want "%s")\n' "$path" "$name" "$value" "$text"
      failed=1
    fi
    continue
  fi

  path="${check%%=*}"
  want="${check#*=}"
  want_code="${want%%:*}"
  want_location=""
  [ "$want" != "$want_code" ] && want_location="${want#*:}"

  headers=$(fetch "$path")
  code=$(status_of "$headers")
  location=$(header_of "$headers" location)

  if [ "$code" != "$want_code" ]; then
    printf 'FAIL  %-40s %s (want %s)%s\n' "$path" "${code:-no response}" "$want_code" "${location:+ -> $location}"
    failed=1
  elif [ -n "$want_location" ] && [ "$location" = "$want_location" ]; then
    printf 'ok    %-40s %s -> %s\n' "$path" "$code" "$location"
  elif [ -n "$want_location" ] && [ "${location%"$want_location"}" != "$location" ]; then
    printf 'warn  %-40s %s -> %s (absolute: check the port behind the proxy)\n' "$path" "$code" "$location"
  elif [ -n "$want_location" ]; then
    printf 'FAIL  %-40s %s -> %s (want %s)\n' "$path" "$code" "${location:-no Location}" "$want_location"
    failed=1
  else
    printf 'ok    %-40s %s\n' "$path" "$code"
  fi
done

exit "$failed"
