# Code style and comments

**Read when:** writing or reviewing any PHP, and always before calling a change done (the comment check).
**Owns:** formatting, one-line signatures, named arguments, the comment and PHPDoc policy and the comment
check, naming, types, `readonly`, imports, morph type values, private methods over single-use classes.

## TL;DR

- Pint owns formatting. Run `vendor/bin/pint --dirty` on the files you changed; never hand-align.
- **Method signatures stay on one line**, however long. Only DTO constructors go one property per line.
- **Named arguments** when a call passes a bare literal (`true`, `null`, a number) or two or more values
  of the same type.
- **Write few comments; default to none.** A comment says a WHY a competent reader would get wrong
  without it, in 1–2 lines. Delete anything that restates code or narrates history.
- PHPDoc only for what a signature cannot say: array shapes, generic collections, meaningful `@throws`.
  No docblocks on top of classes or methods that restate them. Never `@inheritdoc`.
- A comment above a declaration is a `/** … */` docblock; `//` lives only inside a method body.
- A step that one class needs stays a private method there; a new class needs real reuse.
- Types on every parameter and return; `?Type`, not `Type|null`. `readonly` wherever nothing changes.

## Formatting

- `vendor/bin/pint --dirty` formats only modified files. Run the full `vendor/bin/pint` only when asked;
  a repo-wide format buries the real diff. CI runs `vendor/bin/pint --test` and fails on any change it
  would make.
- If Pint's output is wrong for the project, change `pint.json`, not the code around it. Start from the
  `laravel` preset and add only the rules the team decided.
- `[]`, never `array()`. Single quotes unless interpolating (`"Invoice {$number} issued"`).
- Curly braces on every control structure, even a one-line body.
- One class per `use`; Pint orders them; no unused imports.
- New models declare casts in a `casts()` method, not the `$casts` property. Leave existing ones until
  that model is refactored.

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

Why: every public method then scans the same way, and a diff of a signature is one line. The exception is
a DTO constructor: one promoted property per line.

## Named arguments at call sites

Name the arguments when a call to your own code passes:

- a bare literal (`true`, `false`, `null`, a number), whose meaning the call cannot show;
- two or more values of the same type, which could be swapped without any error.

```php
// ❌ what is `true`, and which model is the customer?
new InvoiceFormProps($invoice, true, $customer, $employee);

// ✅
new InvoiceFormProps(invoice: $invoice, isCreate: true, customer: $customer, preparedBy: $employee);
```

A call with one obvious argument (`getInvoice($id)`) or a framework helper (`abort(404)`,
`route('invoices.show', $id)`) stays positional. Why the limit: a named call ties the caller to the
parameter name, so renaming the parameter means updating its named callers.

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

- **Restating the code.** `// get the invoice` above `getInvoice()`; a docblock that repeats a method or
  constant name in a sentence.
- **Narrating steps.** One comment per non-obvious decision, not one per line.
- **History.** "Changed from X", "added after the bug in Y", ticket numbers with their story: that belongs
  in the change description. A live constraint is fine ("keep while app v2.3 still sends this").
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

### The check before calling a change done

1. Read your diff and list every comment or docblock line you added.
2. For each, ask: what would go wrong without it?
3. No answer → delete it. Keep only what has one.

Leave pre-existing comments alone unless asked; they are not part of your change.

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
| Enum cases | the project's one choice | `PAID` or `Paid`, never both in one codebase |
| DTO properties | `snake_case` (deliberate carve-out) | `$customer_id` |
| Files | match the class exactly | `IssueInvoice.php` |

- Names say what a thing is or does: `isRegisteredForDiscounts`, not `discount()`.
- Booleans read as questions: `isLocked`, `hasLines`, `wasRefunded`.
- In a layered layout, suffixes say the role: single-operation classes have none (`IssueInvoice`), DTOs
  end in `Data`, interfaces in `Contract`, their implementations in `Service`.

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
// ❌ a class whose only caller is one operation class
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
better private method, not a new class. Raise it before adding one. This does not change how operations
are split into classes (one per create, update, issue…); it is about the steps inside one.

## Static analysis

Run Larastan / PHPStan at the highest level the codebase passes, and raise it over time. Conventions that
can be checked statically belong in a rule (custom PHPStan rule or Pest `arch()`), not only in prose.

## Verify

These find existing code too. Treat the output as a review list scoped to what you changed.

```bash
# Multi-line method signatures
grep -rnE "function [a-zA-Z_]+\($" src/ app/ --include='*.php'

# @inheritdoc
grep -rni "@inheritdoc" src/ app/

# // comments directly above a declaration
grep -rnE -A1 "^\s*// " src/ app/ --include='*.php' | grep -E "^\S+-[0-9]+-\s*(public|protected|private|final|class|const|function)"

# Hard-coded morph class strings
grep -rnE "_type'\s*=>\s*'[A-Z][A-Za-z\\\\]+'" src/ app/

# Instantiating a model only for its morph class
grep -rn "(new [A-Z][A-Za-z]*)->getMorphClass()" src/ app/
```
