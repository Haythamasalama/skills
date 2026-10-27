# Branches, commit scopes and pull requests

**Read when:** naming a branch, choosing a commit scope in a DDD Laravel repo, opening a PR, or staging files.
**Owns:** branch names, the layer-based scope list, PR titles and body, squash merging, what never to commit.
**See also:** commit message format, types, bodies and splitting: the [commit-messages](../../commit-messages/SKILL.md) skill

## TL;DR

- Branch: `<type>/<scope>-<short-description>`, lowercase kebab-case.
- Commit format, types, body, splitting and when to commit: the [commit-messages](../../commit-messages/SKILL.md) skill. A PR
  title uses the same `<type>(<scope>): <description>` line.
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

## Scopes by layer

Pick the most specific scope that fits, after reading the history for the scopes the repo already
uses ([how](../../commit-messages/SKILL.md#before-you-write)).

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

```markdown
## Summary
- What changed and why, as short bullets.

## Test plan
- [ ] Steps a reviewer can follow.
- [ ] Tests added or updated.

Closes #123   <!-- only if an issue exists -->
```

Write the body for a reviewer who has not seen the conversation: the problem, the decision, what is not
done yet. Keep the title short and put detail in the body.

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
3. Split into commits per [commit-messages](../../commit-messages/SKILL.md#splitting-work).
