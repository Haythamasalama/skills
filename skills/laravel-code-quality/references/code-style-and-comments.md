# Code style and comments

**Read when:** writing or reviewing any PHP, and always before a commit (the comment check).
**Owns:** formatting, one-line signatures, the comment and PHPDoc policy, naming, types, `readonly`,
imports, morph type values, private methods over single-use classes.
**See also:** [conditionals.md](conditionals.md) · [anti-patterns.md](anti-patterns.md) ·
layer rules: the [laravel-ddd](../../laravel-ddd/SKILL.md) skill

## TL;DR

- Pint owns formatting. Run `vendor/bin/pint --dirty` on the files you changed; never hand-align.
- **Method signatures stay on one line**, however long. Only DTO constructors go one property per line.
- **Write few comments; default to none.** A comment says a WHY a competent reader would get wrong
  without it, in 1–2 lines. Delete anything that restates code or narrates history.
- PHPDoc only for what a signature cannot say: array shapes, generic collections, meaningful `@throws`.
  No docblocks on top of classes or methods that restate them. Never `@inheritdoc`.
- A comment above a declaration is a `/** … */` docblock; `//` lives only inside a method body.
- **Before every commit**, list each comment line you added and delete each one that fails the bar.
  Leave pre-existing comments alone unless asked.
- A step that one class needs stays a private method there; a new class needs real reuse.
- Types on every parameter and return; `?Type`, not `Type|null`. `readonly` wherever nothing changes.

## Formatting

- `vendor/bin/pint --dirty` formats only modified files. Run the full `vendor/bin/pint` only when asked;
  a repo-wide format buries the real diff.
- If Pint's output is wrong for the project, change `pint.json`, not the code around it.
- `[]`, never `array()`. Single quotes unless interpolating (`"Invoice {$number} issued"`).
- One class per `use`; Pint orders them; no unused imports.

## One-line signatures (deliberate)

```php
// ❌
public function getInvoice(
    ?int $id = null,
    ?FilterInvoiceData $filters = null,
    array $withRelations = []
): ?Invoice;

// ✅
public function getInvoice(?int $id = null, ?FilterInvoiceData $filters = null, array $withRelations = []): ?Invoice;
```

Why: every Contract, Action and Service method then scans the same way, and a diff of a signature is one
line. The exception is a DTO constructor: one promoted property per line.

## Comments

### The bar

Would a competent reader get this wrong without the comment? If not, delete it. A comment earns its place
when it records a constraint, an invariant, a workaround, or a quirk of something outside the code.

```php
// ✅ a WHY nobody could guess
// The provider returns 502 for a few seconds after a deploy; treat it as a soft failure.
if ($response->status() === 502) {
    return null;
}
```

### What to delete

- **Restating the code.** `// get the invoice` above `getInvoice()`.
- **Narrating steps.** One comment per non-obvious decision, not one per line.
- **History.** "Changed from X", "added after the bug in Y", ticket or decision numbers with their story:
  that is the commit message's job. A live constraint is fine ("keep while app v2.3 still sends this").
- **Repetition.** State a rationale once, where it is enforced, not at every call site.
- **Explaining the language** or naming what the next line does.
- **Docblocks that restate the signature:**

```php
// ❌
/**
 * Get an invoice by id.
 * @param int $id The invoice id
 * @return Invoice|null The invoice or null
 */
public function getInvoice(int $id): ?Invoice

// ✅ the signature is the documentation
public function getInvoice(int $id): ?Invoice
```

- **Comments on self-evident code.** Filter scopes, `when()` chains, guards, getters, mappers and early
  returns read as they are. A long filter scope with zero comments is the target, not a gap.

```php
// ❌
->when(
    // only when the caller sent the flag, since false is a real value
    ! is_null($filters?->is_paid),
    fn (Builder $q) => $q->where('is_paid', $filters->is_paid)
)

// ✅
->when(! is_null($filters?->is_paid), fn (Builder $q) => $q->where('is_paid', $filters->is_paid))
```

- **Long comments.** More than two lines means a better name or an extracted, well-named method is due.

### Rules of placement

- Above a method, property, constant or class: `/** … */`, never `//`.
- Inside a method body: `//`.
- Rewriting code means rewriting (or deleting) its comments. A stale comment is worse than none.
- Cite a decision record by its number instead of restating its reasoning, if the project keeps them.

### The pre-commit check

1. `git diff` and list every added comment or docblock line.
2. For each, ask: what would go wrong without it?
3. No answer → delete. Keep only what has one.

## When PHPDoc is needed

```php
/** @param InvoiceLineData[] $lines */
public function __construct(public readonly int $customer_id, public readonly array $lines) {}

/** @return Collection<int, Invoice> */
public function overdue(): Collection

/** @throws InvoiceAlreadyIssued */
public static function handle(Invoice $invoice): Invoice
```

1. Element types of an `array` parameter or property (shapes: `array{id: int, name: string}`).
2. Generic collection types for static analysis.
3. `@throws` when the exception is meaningful to the caller.

An `array` parameter without a shape is a review finding; usually it should be a DTO instead.

## Naming

| Thing | Case | Example |
|---|---|---|
| Classes, enums, interfaces | `PascalCase` | `IssueInvoice`, `InvoiceContract` |
| Methods, variables, parameters | `camelCase` | `getInvoice()`, `$invoiceId` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_LINES` |
| Enum cases | the project's one choice | `PAID` or `Paid`, never both |
| DTO properties | `snake_case` (deliberate carve-out) | `$customer_id` |
| Files | match the class exactly | `IssueInvoice.php` |

- Names say what a thing is or does: `isRegisteredForDiscounts`, not `discount()`.
- Booleans read as questions: `isLocked`, `hasLines`, `wasUnlinked`.
- Suffixes follow the layout skill: Actions have none, DTOs end in `Data`, interfaces in `Contract`,
  implementations in `Service`.

## Types

```php
// ❌
public function getInvoice($id) {}
public function findInvoice(int $id): Invoice|null {}

// ✅
public function getInvoice(int $id): ?Invoice {}
```

- Every parameter and return typed. `?Type` for nullable; real unions (`int|array|null` on a filter) are fine.
- `void` and `never` where they apply.
- `mixed` only at a true boundary, narrowed right away.

## `readonly`

DTOs always. Value objects nearly always. Controllers and other classes whose only properties are
injected dependencies: `private readonly` promoted properties. A class with no state at all can be
`final readonly`.

## Morph type values

When the app has no morph map, write type values as `Invoice::class`. Never instantiate a model to read its
name (`(new Invoice)->getMorphClass()`). On an instance you already hold, `$model->getMorphClass()` is fine
and is correct either way. If the app enforces a morph map, use the alias through `getMorphClass()` or the
map, never a hard-coded class string.

## Private methods over single-use classes

```php
// ❌ a class whose only caller is one Action
final class FormatReminderLines
{
    public static function handle(Invoice $invoice): array { /* … */ }
}

// ✅ a private step next to the code that uses it
final class SendInvoiceReminder
{
    public static function handle(Invoice $invoice): void
    {
        $lines = self::reminderLines($invoice);
        // …
    }

    private static function reminderLines(Invoice $invoice): array { /* … */ }
}
```

A class earns its own file through reuse (more than one caller). Readability alone is a reason for a
better private method, not a new class. Raise it before adding one. This does not change how Actions are
split by operation; it is about the steps inside one.

## Static analysis

Run Larastan / PHPStan at the highest level the codebase passes, and raise it over time. Conventions that
can be checked statically belong in a rule (custom PHPStan rule or Pest `arch()`), not only in prose.

## Verify

```bash
# Multi-line method signatures
grep -rnE "function [a-zA-Z_]+\($" src/ app/ --include='*.php'

# @inheritdoc
grep -rni "@inheritdoc" src/ app/

# // comments directly above a declaration
grep -rnE -A1 "^\s*// " src/ --include='*.php' | grep -E "^\S+-[0-9]+-\s*(public|protected|private|final|class|const|function)"

# Hard-coded morph class strings
grep -rnE "_type'\s*=>\s*'[A-Z][A-Za-z\\\\]+'" src/

# Instantiating a model only for its morph class
grep -rn "(new [A-Z][A-Za-z]*)->getMorphClass()" src/
```
