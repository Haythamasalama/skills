# Branches, commit scopes and pull requests

**Read when:** naming a branch, choosing a commit scope in a DDD Laravel repo, opening a PR, or staging files.
**Owns:** branch names, the layer-based scope list, the commit line, the PR body, squash merging, what
never to commit.

## TL;DR

- Branch: `<type>/<scope>-<short-description>`, lowercase kebab-case.
- Commit and PR title: `<type>(<scope>): <description>` (Conventional Commits), imperative, no period.
- Scopes name the layer that changed (`domain-actions`, `api-controllers`, `migrations`).
- Squash-merge; the PR title becomes the commit subject, so get it right before merging.
- Stage named files, never `git add -A` / `git add .`. Never commit `.env*`, keys, credentials or dumps.
- Push and open a PR only when the owner asks.

## Workflow

1. Branch from the main branch. Never commit to it directly.
2. Open a PR; reference an issue in the body if the team tracks one.
3. Request review, iterate, then squash-merge.
4. Never force-push or rebase the main branch. Force-pushing your own feature branch during review is fine.

## Branch names

```
feat/api-controllers-invoice-endpoints
fix/domain-actions-invoice-total-rounding
refactor/domain-services-delegate-to-actions
```

## The commit line

Types: `feat` (new behaviour), `fix` (a bug), `refactor` (same behaviour, new shape), `perf`, `test`,
`docs`, `style` (formatting only), `chore`, `ci`, `build`, `revert`. A breaking change adds `!` after the
scope and a `BREAKING CHANGE:` footer. The body says why, not what the diff already shows.

One commit is one reason to change: a migration and the Action that needs it go together, an unrelated
rename goes in its own commit. Why: each commit then reverts cleanly on its own.

## Scopes by layer

Pick the most specific scope that fits. Read `git log --oneline -30` first and reuse the scopes the repo
already has.

| Layer | Scopes |
|---|---|
| Domain | `domain-actions`, `domain-contracts`, `domain-services`, `domain-dtos`, `domain-enums`, `domain-exceptions`, `domain-entities`, `domain-scopes`, `domain-abilities`, `domain-model-traits`, `domain-providers`, `domain-observers`, `domain-traits` |
| Presentation | `{panel}-controllers`, `{panel}-requests`, `{panel}-resources`, `{panel}-routes`, `{panel}-pages` (lower-cased panel folder name: `admin-controllers`, `api-requests`) |
| Shared | `migrations`, `middleware`, `routes`, `config`, `events`, `jobs`, `notifications`, `policies`, `commands`, `exceptions`, `helpers`, `mail`, `tests`, `deps` |

Projects often prefer one scope per **domain or feature** (`feat(billing): …`). Either is fine; follow the
history, and do not mix the two in one repo.

```
feat(domain-actions): add IssueInvoice with a once-only claim
fix(api-controllers): return 201 from InvoiceController::store
perf(domain-scopes): use whereByType for status filters
fix(migrations): drop duplicate index on invoices.customer_id
test(domain-actions): cover IssueInvoice rollback paths
```

## PR body

```
## Why
One or two sentences: the problem, or the issue it closes (Closes #12).

## What changed
- The behaviour that changed, by area. Not a file list.

## How it was checked
- vendor/bin/pint --dirty
- php artisan test --filter=Invoice
- What you clicked through by hand, if anything.
```

Answer every review comment, either with the commit that fixes it or with the reason it stays. When
squash-merging, edit the final message so it reads as one clean commit, not a list of "fix review" lines.

## What never goes in a commit

- `.env`, `.env.*` (only `.env.example` with placeholder values).
- The app key, API tokens, private keys, cloud credentials, any secret JSON.
- Database dumps, exported data, `storage/logs/*`, local debug output, generated build output that is not
  meant to be tracked.

Stage by name so an untracked secret or a large binary is never swept in by accident. If a secret was
committed, rotate it; deleting it in a later commit does not remove it from history.

## Before committing

1. `vendor/bin/pint --dirty`, then the affected tests.
2. Review the diff, including the comment check in
   [code-style-and-comments.md](code-style-and-comments.md).
3. Split into one commit per reason to change.
