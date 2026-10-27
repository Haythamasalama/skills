---
name: commit-messages
description: Use when writing a commit message, staging or committing changes, splitting work into several commits, or rewording a commit, in any repository. Covers the Conventional Commits format, choosing a type and scope, what belongs in the body, footers and breaking changes, how to split a diff into commits that revert cleanly, and how to reword safely. Triggers include "commit this", "write the commit message", "split this into commits", "reword the last commit", «اعمل commit», «رسالة الكوميت», «قسّم الكوميتات».
---

# Commit messages

Conventional Commits ([v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)) for any
repository. Commit only when the user asks; many owners review and commit themselves.

## TL;DR

- `type(scope): description`: imperative, lowercase start, no trailing period, under ~72 chars.
- The body explains **why**, not what. The diff already shows the what.
- One commit per reason to change. Test: can it be reverted alone without taking something
  unrelated with it?
- Breaking change: `!` before the colon and/or a `BREAKING CHANGE:` footer.
- Learn the repo's scopes from its history before inventing one.
- The build (with its type check) passes before the commit, not after.
- Reword only commits that are not pushed, unless the owner says otherwise.

## Before you write

```bash
git status
git diff --staged            # what is actually going in
git log --oneline -20        # the house style
git log --format=%s | grep -oE '^[a-z]+(\([^)]+\))?!?:' | sort | uniq -c | sort -rn | head -20
```

The last line lists the types and scopes the repo already uses. Check that the history really
follows the convention: commits from before it was adopted are not a model.

## Format

```
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

The colon and the space after it are required. The description starts right after them.

## Types

`feat` and `fix` are the only two the spec defines. The rest are convention.

| Type | Use for |
|---|---|
| `feat` | new behaviour a user can observe |
| `fix` | a defect. Say what was broken, not only what changed |
| `docs` | documentation, READMEs, agent instructions and skills |
| `refactor` | behaviour identical, structure different |
| `perf` | a measured improvement. Quote the before and after |
| `style` | formatting only, zero behaviour change |
| `test` | adding or changing tests only. Skip it in a repo with no tests |
| `build` | build tooling, containers, web server config, dependencies |
| `ci` | CI workflows |
| `chore` | housekeeping that fits nothing above. Reach for it last |
| `revert` | reverting an earlier commit; name it in the body |

## Scope

A noun naming the part of the codebase touched: a feature area, a layer, or a tool (`auth`,
`i18n`, `rtl`, `print`, `deps`, `docker`). Optional, but in a repo with clear seams it usually
writes itself. Use the scopes the history already has. If a change spans more than two scopes, it
is probably two commits.

## Description

Imperative mood, lowercase start, no trailing period, under ~72 characters. It completes the
sentence "If applied, this commit will …".

```
feat(lesson): add lesson 3 on food and drink
fix(print): restore the answer key hidden by the match block rewrite
refactor(blocks): render vocab through TargetText
```

Not:

```
Added lesson 3.              (past tense, full stop)
fix: bug                     (says nothing)
feat(blocks): update files   (says nothing)
```

Follow the repo if it uses a ticket prefix or a different case; consistency with the log beats
this file.

## Body

Optional. One blank line after the description, then free-form paragraphs wrapped at ~72.

Write one when the change is not self-evident from the diff. Explain the **why**:

- the failure mode being prevented;
- the constraint that forced this approach;
- the alternative you rejected, and the reason.

When a commit touches a convention the codebase depends on but nothing enforces (a print
contract, a bidi isolation class, a glob, module-level singletons, a "null means hidden" rule),
say so in the body. Those are the ones that break silently.

Don't narrate the session ("first I tried…"), list files, or restate the diff.

## Footers

One blank line after the body. A token, then `: ` or ` #`, then the value. Tokens use `-` instead
of spaces (`Reviewed-by`, `Refs`), which is what separates a footer from another body paragraph.
`BREAKING CHANGE` is the only token allowed to contain a space.

Use the attribution line (`Co-Authored-By: …`) that the environment or the owner specifies, and
only that one. Don't invent one.

## Breaking changes

Either a `!` before the colon, or a `BREAKING CHANGE:` footer, or both. `BREAKING-CHANGE` is a
synonym. The token must be uppercase; everything else in the format is case-insensitive.

A change is breaking when it forces work outside the commit: a public URL people were given
changes, an API or event contract changes, the shape of stored data or content changes, a config
key or environment variable is renamed, a supported version is dropped. A change that only affects
the app's own rendering is not breaking, however visible it is.

```
refactor(routes)!: consolidate on the programme pages

BREAKING CHANGE: /courses and /lesson/* are retired. They 301 to the new
pages in both the router and the web server config. Change one, change the
other: CI asserts the redirects against a real container.
```

## Splitting work

- One commit per reason to change. Could this commit be reverted on its own without undoing
  something unrelated?
- **Content and code go in separate commits.** A content update (`feat(content): add lesson 12`)
  should revert without undoing a component fix that landed the same afternoon.
- A refactor and the feature built on it are two commits: the refactor first, behaviour unchanged.
- Formatting churn gets its own `style` commit, or stays out of the diff.
- Stage by hunk when one file holds two reasons: `git add -p <file>`.

## Rewording

| Situation | Do |
|---|---|
| last commit, not pushed | `git commit --amend` (message only: `--amend -m "…"`, or `--amend` with no staged changes) |
| an older commit, not pushed | `git rebase -i <base>` and mark it `reword`. Without an interactive terminal, script both editors (`GIT_SEQUENCE_EDITOR` turns `pick <sha>` into `reword <sha>`, `GIT_EDITOR` writes the new message), or ask the owner to do it |
| already pushed to a shared branch | don't rewrite. Ask the owner; a force-push rewrites everyone's history |

Amending changes the commit's SHA. Never amend to "fix" a commit that a hook rejected: the commit
did not happen, so amending would change the previous one. Fix the problem and commit again.

## Before committing

- The build passes. If the build runs a type check first (for example `vue-tsc` before
  `vite build`), template errors surface only there. A commit that does not build is not finished.
- Lint and format the files you touched.
- For anything visual, check it in a real browser before committing, not after.
- Read `git diff --staged` once more. Nothing temporary, no secrets, no stray debug output.
