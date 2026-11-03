# Review output

**Read when:** reporting the findings of a code review, by hand or from a reviewer agent.
**Owns:** the report template, ordering, tone and severity markers.
**See also:** [anti-patterns.md](anti-patterns.md)

## TL;DR

- Cite `file:line` for every finding.
- Pair each problem with the corrected code.
- Architecture and security first; formatting last or not at all (Pint owns it).
- Severity: 🔴 block · 🟡 should fix · 🟢 can wait. Cite the anti-pattern number when one matches.
- Omit empty sections. Say plainly when a change is solid.

## Template

```markdown
## Review

### Files reviewed
- `src/Domain/Billing/Actions/IssueInvoice.php`
- `src/Presentation/Api/Controllers/Invoice/InvoiceController.php`

### Verdict
✅ Approve  /  ⚠️ Approve with suggestions  /  ❌ Changes required

### Architecture and layers
- 🔴 `InvoiceService.php:42` — query in a Service (#5). Move it to `GetOverdueInvoices` and delegate.

### Security
- 🔴 `routes/api.php:88` — export route outside the auth group (#53).

### Data and queries
- 🟡 `InvoiceController.php:31` — `$request->all() + [...]` lets the request override `customer_id` (#32).

### API and presentation
- 🔴 `InvoiceController.php:57` — `store` returns 200 (#69); return `res(status: 201)`.

### Code quality
- 🟡 `IssueInvoice.php:12` — comment restates the next line (#49); delete it.

### Suggestions
- 🟢 …

### What is good
- Specific, not generic ("the transition guard covers self-approval and has a test for it").

### Summary
Files: 2 · 🔴 3 · 🟡 2 · 🟢 1
```

## How to write findings

- One finding per problem, with the offending line and the fix side by side when it is not obvious.
- Lead with what can break production or leak data, then layer violations, then the rest.
- Suggest the fix; do not only name the smell.
- Point to the anti-pattern number and its catalogue entry instead of re-explaining it.
- Keep it short. A balanced review gets read; a wall of nits gets ignored.
- Scope findings to what the change touched. Pre-existing problems go in a short "seen nearby" note, not
  in the blocking list.
- Do not flag a decision the project documented as a deliberate deviation.

## Severity

| Flag | Meaning | Typical findings |
|---|---|---|
| 🔴 Critical | must fix before merge | security holes, broken boundaries, missing transactions on multi-row writes, contract regressions |
| 🟡 Warning | should fix; debt if left | raw arrays for DTOs, logic in a controller, missing eager loads |
| 🟢 Suggestion | optional | naming, small refactors the author may defer |
