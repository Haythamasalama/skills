# Review output

**Read when:** reporting the findings of a code review, by hand or from a reviewer agent.
**Owns:** the report template, ordering, tone, and the definition of each severity.

## TL;DR

- Cite `file:line` for every finding.
- Pair each problem with the corrected code.
- Security and boundaries first; formatting last or not at all (Pint owns it).
- Mark each finding 🔴, 🟡 or 🟢 as defined below. Cite the anti-pattern number when one matches.
- Omit empty sections. Say plainly when a change is solid.

## Severity

| Flag | Meaning | In review | Typical findings |
|---|---|---|---|
| 🔴 Critical | must fix before merge | block | security holes, broken module boundaries, partial writes (no transaction), once-only work that can run twice, response-contract regressions |
| 🟡 Warning | should fix; debt if left | fix in this change if reasonable, otherwise a follow-up | raw arrays for DTOs, logic in a controller, missing eager loads, comments that restate code |
| 🟢 Suggestion | optional | recommend; do not block | naming, small refactors the author may defer |

## Template

```markdown
## Review

### Files reviewed
- `src/Domain/Billing/Actions/IssueRefund.php`
- `app/Http/Controllers/RefundController.php`

### Verdict
✅ Approve  /  ⚠️ Approve with suggestions  /  ❌ Changes required

### Security
- 🔴 `routes/web.php:88` — export route outside the auth group (#53).

### Boundaries and layers
- 🔴 `RefundService.php:42` — query in a Service (#5). Move it to `GetPendingRefunds` and delegate.

### Data and queries
- 🟡 `RefundController.php:31` — `$request->all() + [...]` lets the request override `customer_id` (#32).

### API and responses
- 🔴 `RefundController.php:57` — `store` returns 200 (#69); return 201 with the resource.

### Code quality
- 🟡 `IssueRefund.php:12` — comment restates the next line (#49); delete it.

### Suggestions
- 🟢 …

### Seen nearby (not blocking)
- Older problems in files the change touched, one line each.

### What is good
- Specific, not generic ("the transition guard covers self-approval and has a test for it").

### Summary
Files: 2 · 🔴 3 · 🟡 2 · 🟢 1
```

## How to write findings

- One finding per problem, with the offending line and the fix side by side when it is not obvious.
- Lead with what can break production or leak data, then boundary violations, then the rest.
- Suggest the fix; do not only name the smell.
- Point to the anti-pattern number instead of re-explaining it.
- Keep it short. A balanced review gets read; a wall of nits gets ignored.
- Scope findings to what the change touched. Pre-existing problems go under "Seen nearby", not in the
  blocking list.
- Do not flag a decision the project documented as a deliberate deviation.
