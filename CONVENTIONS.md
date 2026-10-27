# How a skill in this repo is written

Every skill here must help in **any** project, on any machine. The `skill-publisher` agent follows this file.

## Layout

```
skills/<name>/
  SKILL.md            required: frontmatter + the short version
  references/*.md     optional: one topic per file, linked from SKILL.md
  scripts/            optional: helpers that work anywhere
  assets/             optional: templates (HTML, JSON, …)
```

- `<name>`: lowercase kebab-case, says the subject (`whatsapp-business-platform`, `laravel-ddd`), never a
  project or client name.
- Agents live in `agents/<name>.md` (Claude Code subagent format).

## SKILL.md

```yaml
---
name: <name>            # same as the folder
description: Use when … # one paragraph: when to load it, what it covers, trigger phrases (English + a few Arabic)
---
```

Then, in this order:
1. **Read when / Owns / See also** — two or three lines.
2. **TL;DR** — the rules that matter most, as bullets.
3. Sections, short. Anything long moves to `references/` and gets a row in a "where each topic lives" table.

Limits: SKILL.md ≤ 250 lines, each reference ≤ 400 lines. One fact lives in one place; link instead of
repeating.

## Content

- English, short plain sentences; no marketing words, no invented numbers.
- Keep each hard-won rule with a one-line **why**.
- Facts that change (versions, API fields, prices, dates) carry the date they were checked: "(checked 2026-10-27)".
- Neutral examples (Invoice, Customer, Product), not real business entities.

## Privacy (the publisher refuses to push until this is clean)

- No secrets: tokens, API keys, passwords, private keys, `.env` values.
- No personal data: emails, phone numbers, addresses, customer names, screenshots with real data.
- No absolute paths from a machine (`/Users/…`, `/private/tmp/…`); use `~/` or `$HOME` only where a path is the point. <!-- privacy-scan: allow -->
- No names of employers, clients or private projects (the local list is in
  `~/.config/skills/private-terms.txt`, never committed). Public product examples (e.g. a public
  platform used as a reference) are fine when the skill needs them.
- Run `scripts/privacy-scan.sh` before every commit; it must print `clean`.

## Commits

Conventional Commits: `feat(<skill>): add …`, `fix(<skill>): …`, `docs: …`. One skill per commit when possible.
