---
name: laravel-code-quality
description: Use when writing, reviewing or cleaning up Laravel PHP for quality and safety rather than layout — formatting with Pint, one-line method signatures, named arguments, the few-comments rule and when PHPDoc is allowed, naming and types, readable conditionals (guard clauses, named conditions, elseif, match), private methods over single-use classes; security (fail-closed authorization, routes inside auth groups, file-route permissions, row-level visibility, Form Request validation, one-value-or-list fields, mass assignment, bound raw SQL, XSS, secrets and env(), throttle keys, random_int, signed public links); sensitive operations such as refunds, payouts, data exports and access grants (duplicate-submit protection, once-only execution, maker-checker approvals, self-approval, overrides, step-up auth, append-only audit logs, masking, bounded output); tests that guard all of this; the numbered anti-pattern catalogue; the code review report format. Also triggers on "review this diff", "code review", "clean this up", "is this secure", "anti-pattern", "double submit", "approval flow", "audit log", "مراجعة الكود", "جودة الكود", "تنظيف الكود", "التعليقات", "ثغرة", "أمان", "موافقات".
metadata:
  summary: "Laravel code style, security, sensitive operations and code review."
  tags: laravel, php
---

# Laravel code quality

**Read when:** reviewing a diff, finishing a change, or writing code that touches permissions, input,
raw SQL, secrets, audit trails, approvals or anything that must run only once.
**Owns:** style and comments, conditionals, security rules, sensitive-operation patterns, testing rules
for those paths, the anti-pattern catalogue (stable numbers), the review report format and severity.

Written for PHP 8.3+, Laravel 12 and Pest 4 (checked 2026-11-03). Match the codebase first: these are
defaults for new code, not a reason to rewrite working code in an unrelated change.

## TL;DR

- **Pint owns formatting**: `vendor/bin/pint --dirty` on changed files. Never hand-align.
- **One-line method signatures.** Only DTO constructors list one property per line.
- **Named arguments** when a call passes a bare literal or two values that could be swapped unnoticed.
- **Write few comments.** Default to none; keep a 1–2 line WHY a reader would get wrong without it.
- **Readable conditionals:** guard clauses first, named conditions, one `elseif` chain for an exclusive
  choice, `match` or a map when branches only pick values.
- **Fail closed.** Deny by default, check on the server every time, record denials. An empty scope
  narrows to nothing, never to everything.
- **Every route inside its auth group;** a file or export route checks the linking page's permission.
- **Bind every SQL value.** Identifiers come from an allowlist. `{!! !!}` only through a sanitizer.
- **Secrets never leave**: not in responses, logs, DTOs, errors or the repository. `config()`, not `env()`.
- **Once-only work claims the row atomically;** a form that must not run twice carries a server-issued key.
- **Nobody approves their own request;** nothing is written while a change waits for approval.
- **Audit logs are append-only** and record denials and overrides, without secrets or raw personal data.
- **Never skip or delete a failing test**; never point a test run at a working database.

## Before you call a change done

1. `vendor/bin/pint --dirty`.
2. Run the affected tests (`php artisan test --compact --filter=…`), including a failure path.
3. Read the diff against the [anti-pattern catalogue](references/anti-patterns.md).
4. Run the [comment check](references/code-style-and-comments.md#the-check-before-calling-a-change-done).
5. Security pass for anything touching routes, input, SQL, output, secrets or permissions.

## Where each topic lives

| I'm working on… | Read |
|---|---|
| Formatting, signatures, named arguments, comments, PHPDoc, naming, types, `readonly`, morph types | [code-style-and-comments.md](references/code-style-and-comments.md) |
| An `if`, `elseif`, `match`, ternary or compound condition | [conditionals.md](references/conditionals.md) |
| Routes, permissions, row visibility, validation, mass assignment, raw SQL, XSS, secrets, throttles, public links | [security.md](references/security.md) |
| Refunds, payouts, exports, access grants: duplicate submits, once-only, approvals, overrides, step-up, audit logs, masking | [sensitive-operations.md](references/sensitive-operations.md) |
| The test database, what to test at which layer, fakes, failure paths | [testing.md](references/testing.md) |
| Checking a diff against known mistakes (numbered) | [anti-patterns.md](references/anti-patterns.md) |
| Writing up a review, and what each severity means | [review-output.md](references/review-output.md) |

Cite findings by anti-pattern number (`#40`) and `file:line`; numbers never change. Severity
(🔴 / 🟡 / 🟢) is defined once, in [review-output.md](references/review-output.md#severity).

## Decided rules that look odd

These go against generic Laravel advice on purpose. Do not "fix" them in review.

| Rule | Why |
|---|---|
| Few comments, no docblocks that restate signatures | typed signatures say more; restating comments rot |
| One-line signatures, even long ones | every method scans the same; a signature diff is one line |
| DTO (a `readonly` class that carries data between layers, named `*Data`) properties in `snake_case` | keys match columns and validated input; no mapping layer |
| Static single-operation classes (`final class IssueInvoice { public static function handle() }`) resolve their dependencies with `app()` | a static method cannot take constructor injection; one pattern end to end |
| Methods that read from a module may return Eloquent models instead of read DTOs | a later refactor; never block a change on it (#12) |
| No speculative indexes; never custom-name indexes or constraints | write cost; custom names drift between environments |
| A private method rather than a new single-use class | files earn their place through reuse |
| `$guarded = []` tolerated on existing models whose writes all pass through a DTO | the DTO lists the columns; new user-input models still use `$fillable` |
