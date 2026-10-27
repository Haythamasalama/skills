---
name: laravel-code-quality
description: Use when writing, reviewing or cleaning up Laravel PHP (and its Inertia/Vue pages) for quality and safety rather than layout — formatting with Pint, one-line method signatures, the few-comments rule and when PHPDoc is allowed, naming and types, readable conditionals (guard clauses, named conditions, elseif, match), private methods over single-use classes; security (fail-closed authorization, routes inside auth groups, file-route permissions, Form Request validation, mass assignment, bound raw SQL, XSS, secrets and env(), throttle keys, random_int, signed public links); sensitive operations (once-only execution, approvals and self-approval, overrides, step-up auth, append-only audit logs, masking, bounded output); the numbered anti-pattern catalogue; the code review report format; branch, scope and PR conventions. Also triggers on "review this diff", "code review", "clean this up", "is this secure", "anti-pattern", "مراجعة الكود", "جودة الكود", "تنظيف الكود", "التعليقات", "ثغرة", "أمان".
---

# Laravel code quality

**Read when:** reviewing a diff, finishing a change before commit, or writing code that touches
permissions, raw SQL, secrets, audit trails or once-only operations.
**Owns:** style and comments, conditionals, security rules, sensitive-operation patterns, the anti-pattern
catalogue (stable numbers), the review report format, branch and PR conventions.
**See also:** the [laravel-ddd](../laravel-ddd/SKILL.md) skill for where code goes and how layers talk;
the [commit-messages](../commit-messages/SKILL.md) skill for commit message format.

Written for PHP 8.4 and Laravel 12 (checked 2026-10-28). Match the codebase first: these are defaults for
new code, not a reason to rewrite working code in an unrelated change.

## TL;DR

- **Pint owns formatting**: `vendor/bin/pint --dirty` on changed files. Never hand-align.
- **One-line method signatures.** Only DTO constructors list one property per line.
- **Write few comments.** Default to none; keep a 1–2 line WHY a reader would get wrong without it.
  No docblocks that restate a signature, no history, no step-by-step narration. Before each commit, list the
  comments you added and delete every one that fails that bar.
- **Readable conditionals:** guard clauses first, named conditions, one `elseif` chain for an exclusive
  choice, `match` or a map when branches only pick values.
- **Fail closed.** Deny by default, check on the server every time, record denials.
- **Every route inside its auth group;** a file or export route checks the linking page's permission.
- **Bind every SQL value.** Identifiers come from an allowlist. `{!! !!}` only through a sanitizer.
- **Secrets never leave**: not in responses, logs, DTOs, errors or git. `config()` outside `config/`.
- **Once-only work claims the row atomically;** decisions are stored once per (record, actor); nobody
  approves their own request.
- **Audit logs are append-only** and record denials and overrides, without secrets or raw personal data.

## Before you call a change done

1. `vendor/bin/pint --dirty`.
2. Run the affected tests (`php artisan test --compact --filter=…`), including a failure path.
3. Read the diff against the [anti-pattern catalogue](references/anti-patterns.md).
4. Comment check: every added comment line has a reason to exist, or it goes.
5. Security pass for anything touching routes, input, SQL, output, secrets or permissions.

## Where each topic lives

| I'm working on… | Read |
|---|---|
| Formatting, signatures, comments, PHPDoc, naming, types, `readonly`, morph types | [code-style-and-comments.md](references/code-style-and-comments.md) |
| An `if`, `elseif`, `match`, ternary or compound condition | [conditionals.md](references/conditionals.md) |
| Routes, permissions, validation, mass assignment, raw SQL, XSS, secrets, throttles, public links | [security.md](references/security.md) |
| Once-only actions, approvals, overrides, step-up, audit logs, masking, credentials | [sensitive-operations.md](references/sensitive-operations.md) |
| Checking a diff against known mistakes (numbered, with severity) | [anti-patterns.md](references/anti-patterns.md) |
| Writing up a review | [review-output.md](references/review-output.md) |
| Branch names, commit scopes, PR body, what never to commit | [git-and-prs.md](references/git-and-prs.md) |
| Layers, Actions, DTOs, Contracts, controllers, migrations, tests | [laravel-ddd](../laravel-ddd/SKILL.md) |

## Severity, in one line each

- 🔴 **Critical** — security holes, broken boundaries, partial writes, contract regressions. Block.
- 🟡 **Warning** — debt that compounds: raw arrays, logic in the wrong layer, missing eager loads. Fix now or file it.
- 🟢 **Suggestion** — naming, small refactors. Do not block.

Cite findings by anti-pattern number (`#40`) and `file:line`; numbers never change.

## Decided rules that look odd

These go against generic Laravel advice on purpose. Do not "fix" them in review.

| Rule | Why |
|---|---|
| Few comments, no docblocks that restate signatures | typed signatures say more; restating comments rot |
| One-line signatures, even long ones | every method scans the same; diffs stay one line |
| `snake_case` DTO properties | keys match columns, no mapping layer |
| `app()` inside domain classes instead of constructor injection | static Actions cannot be injected; one pattern end to end |
| No speculative indexes; never custom-name indexes | write cost; names drift between environments |
| A private method rather than a new single-use class | files earn their place through reuse |
| 404, not 403, to strangers in multi-tenant apps | a 403 confirms the tenant exists |
