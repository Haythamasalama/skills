# How this repo is written

Every skill here must help in **any** project, on any machine, and must work when it is the only skill
installed. The layout follows the [Agent Skills](https://agentskills.io) format used by the official
skill repos, so the standard CLI installs straight from this repo: `npx skills add haythamasalama/skills`.

## Layout

```
skills/<name>/
  SKILL.md            required: frontmatter + the short version
  references/*.md     optional: one topic per file, linked from SKILL.md
  scripts/            optional: helpers that work anywhere
  assets/             optional: templates and copy-ready files
skills-lock.json      official and community skills we recommend, in the CLI's own lock format
scripts/              check.sh, privacy-scan.sh, site.sh (repo tools, never installed)
site/                 the local page that lists the skills
```

- `<name>`: lowercase kebab-case, says the subject, never a project or client name.
- Skills from others are never copied in. Add them to `skills-lock.json` by installing them once with
  `npx skills add <source> --skill <name>` in a scratch project and copying its lock entry. A skill of
  ours never takes the name of one in the lock file (`shadcn-vue-kit` beside the official `shadcn-vue`).
- Group skills with tags, not folders: `metadata.tags` in the frontmatter (see below).

## Every skill stands alone

- No links outside the skill's own folder, and no mention of another skill ("see the X skill").
  A skill may be installed without any other one, so a pointer to it would lead nowhere.
- When a skill needs a fact that another skill also holds, write the part it needs into this skill.
  Inside one skill, one fact lives in one place; across skills, repeating is expected.
- `sh scripts/check.sh` enforces this. Mark a deliberate line with `skills-check: allow`.

## SKILL.md

```yaml
---
name: <name>                # same as the folder
description: "Use when …"   # one paragraph: when to load it, what it covers, trigger phrases (English + a few Arabic);
                            # quote it when it contains ": "
metadata:
  tags: laravel, php        # technologies, lowercase, most specific first; the site's tabs come from these
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
