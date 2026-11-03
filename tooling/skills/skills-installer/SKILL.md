---
name: skills-installer
description: Use when the user asks to install, add, update, list or remove skills or agents from their personal skills repo in the current project — "نزّل مهارة X بهالمشروع", "نزّل سكيلز لارافيل", "ضيف حزمة vue-inertia", "شو المهارات اللي عندي", "حدّث المهارات", "install the laravel skills here", "add the shadcn-vue skill to this project", "which skills do I have". It finds the repo, lists packs and skills, copies the chosen ones into the project's .claude folder with the repo's install script, and reports what landed. Also opens the local skills browser on request («افتح صفحة المهارات»).
---

# Skills installer

**Read when:** the user wants skills from their own skills repo in the project you are working in.
**Owns:** finding the repo, choosing what to install, running the install script, updating and
removing installed skills, and opening the skills browser.

The repo is a set of **packs** (a subject folder: `laravel`, `vue-inertia`, …), each with `skills/`
and sometimes `agents/`. Every skill works alone, so installing one never needs another.

## TL;DR

- Repo: `$SKILLS_REPO` if set, else `~/Desktop/projects/web/skills`. If neither has
  `scripts/install.sh`, ask the user where it is; don't clone or search the disk.
- See what exists: `sh "$REPO/scripts/install.sh" --list`. Never guess a name.
- Install into the project root, never into the repo itself:
  `sh "$REPO/scripts/install.sh" <pack|skill|agent>… --to "<project root>"`.
- A pack name installs all its skills and agents; a skill name installs that one only.
- The script copies into `<project>/.claude/skills/` and `.claude/agents/`, and skips a folder of the
  same name that did not come from the repo. Pass `--force` only when the user says to replace it.
- Report in the user's language: what was installed, what was skipped and why.

## Steps

1. **Find the project root:** `git rev-parse --show-toplevel`, or the working directory when it is not
   a git repo. Confirm it is the project the user means if the working directory looks unrelated.
2. **Find the repo** as in the TL;DR and run `--list`.
3. **Pick what to install.**
   - The user named a pack or a skill: use it as is.
   - The user described a need ("Laravel backend", "Vue pages with Inertia"): match it to the list,
     say in one line which skills you chose and why, and install them.
   - Nothing matches: say so, show the list, install nothing.
4. **Install** with `--to "<project root>"`.
5. **Report:** each installed name, each skipped one with the reason from the script's output, and
   that the skills load from the next message in this project. Mention that `.claude/skills/` can be
   committed so the whole team gets them.

## Updating

- Run the same install command again: copies that carry a `.skills-repo` file are replaced with the
  repo's current version. The file records the pack and the repo commit they came from.
- To get the latest repo first, run `git -C "$REPO" pull --ff-only` only when the user asks for it.
- An agent that differs from the repo's copy is skipped; replace it with `--force` only on request.

## Removing

Delete `<project>/.claude/skills/<name>` (or `.claude/agents/<name>.md`) only when the user asks, and
only when it holds a `.skills-repo` file; otherwise it is the user's own skill, so ask first.

## The skills browser

`sh "$REPO/scripts/site.sh"` opens a local page at `http://localhost:4321` to browse, search and copy
install commands. It runs a dev server: start it in the background and give the user the address.

## Never

- Install into `~/.claude` unless the user asks for it on this machine (`--global`). The `tooling`
  pack is the only one meant for that.
- Edit, commit or push the skills repo from here. Changing a skill is a separate request.
