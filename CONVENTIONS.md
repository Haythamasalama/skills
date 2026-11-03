# How this repo is written

Every skill here must help in **any** project, on any machine, and must work when it is the only skill
installed. The `skill-publisher` agent follows this file.

## Layout

```
<pack>/                 one subject: laravel, vue-inertia, whatsapp, …
  README.md             Arabic: one line on the pack, then a table of its skills and agents
  skills/<name>/
    SKILL.md            required: frontmatter + the short version
    references/*.md     optional: one topic per file, linked from SKILL.md
    scripts/            optional: helpers that work anywhere
    assets/             optional: templates (HTML, JSON, …)
  agents/<name>.md      optional: Claude Code subagents for this subject
scripts/                install.sh, check.sh, privacy-scan.sh (repo tools, never installed)
```

- `<pack>` and `<name>`: lowercase kebab-case, say the subject, never a project or client name.
- Skill and agent names are unique across the whole repo: they land in the same `.claude/skills` and
  `.claude/agents` folders of a project. When two packs need a similar skill, prefix it with the pack
  (`vue-inertia-ui-review`, `nuxt-ui-review`).
- A project gets skills with `sh scripts/install.sh <pack|skill>… --to <project>`; they are copied into
  `<project>/.claude/`. Only `tooling` goes to `~/.claude` (`--global`).

## Every skill stands alone

- No links outside the skill's own folder, and no mention of another skill ("see the X skill").
  A skill may be installed without any other one, so a pointer to it would lead nowhere.
- When a skill needs a fact that another skill also holds, write the part it needs into this skill.
  Inside one skill, one fact lives in one place; across skills, repeating is expected.
- A pack groups skills by subject; it does not make them depend on each other.
- `sh scripts/check.sh` enforces this. Mark a deliberate line with `skills-check: allow`.

## SKILL.md

```yaml
---
name: <name>            # same as the folder
description: Use when … # one paragraph: when to load it, what it covers, trigger phrases (English + a few Arabic)
---
```

Then, in this order:
1. **Read when / Owns** — two lines.
2. **TL;DR** — the rules that matter most, as bullets.
3. Sections, short. Anything long moves to `references/` and gets a row in a "where each topic lives" table.

Limits: SKILL.md ≤ 250 lines, each reference ≤ 400 lines.

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
- Run `sh scripts/privacy-scan.sh` and `sh scripts/check.sh` before every commit; they must print
  `clean` and `ok`.

## Commits

Conventional Commits: `feat(<skill>): add …`, `fix(<skill>): …`, `docs: …`. One skill per commit when possible.
