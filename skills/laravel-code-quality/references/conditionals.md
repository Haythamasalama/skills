# Readable conditionals

**Read when:** writing or reviewing an `if`, `elseif`, `match`, a ternary, or a condition with more than one part.
**Owns:** guard clauses, naming conditions, `elseif` for sequential checks, lookup maps instead of branches.

## TL;DR

- **Guard clauses first.** Handle the special or failing case, `return` / `throw` / `$fail()`, and let the
  main path run last, unindented. No `else` after a `return`.
- **Name the condition.** A condition with more than one part goes in a variable named for its meaning, or
  a private method if it is reused. The name replaces the comment you would otherwise write.
- **One `if / elseif` chain for an exclusive choice** in the middle of a method, never a row of separate `if`s.
- **`match`, a constant map, config or an enum method for value picking.** Branches that only map one value
  to another are a table in disguise.

## Pick the tool

| The code… | Use |
|---|---|
| stops for a special case (invalid input, nothing to do, a failed check) | a guard clause |
| has a condition you have to read twice | a named variable or a private method |
| picks one of several actions, then continues | one `if / elseif` chain |
| maps one value to another | `match`, a `const` array, config, or an enum method |

Splitting a method so a chain becomes guard clauses is often the best move of all.

## 1. Guard clauses

```php
// ❌ every case nested in one chain
private static function recordChange(Invoice $invoice, ?Customer $previous): void
{
    if (! $previous) {
        self::record($invoice, 'invoice.customer_set');
    } elseif ($previous->is($invoice->customer)) {
        self::record($invoice, 'invoice.customer_updated');
    } else {
        self::record($invoice, 'invoice.customer_moved');
    }
}

// ✅ each case leaves; the last line is the main path
private static function recordChange(Invoice $invoice, ?Customer $previous): void
{
    if (! $previous) {
        self::record($invoice, 'invoice.customer_set');

        return;
    }

    if ($previous->is($invoice->customer)) {
        self::record($invoice, 'invoice.customer_updated');

        return;
    }

    self::record($invoice, 'invoice.customer_moved');
}
```

Fail first rather than wrapping the happy path:

```php
// ❌ the real work is one level deep; the failure waits in the else
if ($invoice->status === InvoiceStatus::DRAFT) {
    // … issue it …
} else {
    throw InvoiceException::alreadyIssued();
}

// ✅
throw_unless($invoice->status === InvoiceStatus::DRAFT, InvoiceException::alreadyIssued());

// … issue it …
```

Validation rules follow the same shape: empty value, wrong format and out-of-range each return early; the
expensive checks run at the bottom.

## 2. Name the condition

```php
// ❌ a ternary inside the condition
if ($isYearly ? $months > 12 : $months < 1) {
    $fail(__('validation.invalid_period'));
}

// ✅
$periodIsValid = $isYearly ? $months <= 12 : $months >= 1;

if (! $periodIsValid) {
    $fail(__('validation.invalid_period'));
}
```

```php
// ❌ two checks and a comparison to decode
if ($previousCustomer && ! $previousCustomer->is($invoice->customer)) {
    self::notifyMove($invoice, $previousCustomer);
}

// ✅
$customerChanged = $previousCustomer && ! $previousCustomer->is($invoice->customer);

if ($customerChanged) {
    self::notifyMove($invoice, $previousCustomer);
}
```

- Reused, or several statements long: a private method in the same class (`isCompleteAddress()`), not a
  new class.
- Mixed concerns: group by meaning (`$meetsTaxRules && $creditIsAvailable`) rather than five `&&` parts.

## 3. `elseif` for sequential checks

```php
// ❌ separate ifs for one exclusive choice: all run, a later one can fire on state an earlier one changed
if (! $previous) {
    $key = 'invoice.customer_set';
}
if ($previous && $previous->is($invoice->customer)) {
    $key = 'invoice.customer_updated';
}
if ($previous && ! $previous->is($invoice->customer)) {
    $key = 'invoice.customer_moved';
}

// ✅ one chain; its order is the priority
if (! $previous) {
    $key = 'invoice.customer_set';
} elseif ($previous->is($invoice->customer)) {
    $key = 'invoice.customer_updated';
} else {
    $key = 'invoice.customer_moved';
}
```

Write `elseif`, not `else if` (PSR-12; Pint rewrites it). When the chain is the last thing a method does,
or you can move it into its own method, prefer guard clauses.

## 4. Maps instead of branches

```php
// ❌ branches that only pick a value
if ($this === self::PAID) {
    return 'ok';
} elseif ($this === self::CANCELLED) {
    return 'danger';
}

// ✅
return match ($this) {
    self::PAID => 'ok',
    self::CANCELLED => 'danger',
    self::DRAFT, self::ISSUED => 'warn',
};
```

| The mapping… | Use |
|---|---|
| belongs to an enum case | a method on the enum (`label()`, `tone()`) so callers never branch on the case |
| is a fixed list inside one class | a `private const` array |
| is data the business may change | a config file |
| is a one-off pick in a method | `match` |

`match` is for **values**. When branches *do* different things, use guard clauses or an `elseif` chain;
`match (true)` used for side effects reads worse than either. On a status enum, list every case and leave
out `default`, so a new case fails loudly.

## Verify

These find existing code too. Treat the output as a review list scoped to what you changed.

```bash
# else / elseif right after a return: guard-clause candidates
grep -rnE -B2 "\} ?(elseif|else)\b" src/ app/ --include='*.php' | grep -E "return|throw" | head

# Ternaries inside an if condition: name them
grep -rnE "if \(.*\?.*:.*\) \{" src/ app/ --include='*.php'

# else if instead of elseif
grep -rn "else if" src/ app/ --include='*.php'
```
