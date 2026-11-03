# Direction and bidi

**Read when:** the app has Arabic (or any right-to-left language), something sits on the wrong side,
a value reads reversed, or you are about to type `left`, `right`, `ml-` or `pr-`.
**Owns:** where direction comes from, logical properties, mixed-direction text, input direction,
directional icons, numbers and dates, and the registry's RTL gaps.

## TL;DR

- One set of markup runs RTL in Arabic and LTR in English. Nothing is written twice.
- Direction comes from three places: `<html lang dir>` synced on every visit, `ConfigProvider :dir`
  at the root of every layout, and the registry generated with `rtl: true`.
- Logical properties only: `ms-`, `pe-`, `start-`, `text-start`, `border-s`.
- A Latin value inside Arabic copy sits in `dir="ltr"` (display) or gets `:dir="autoDir(value)"`
  (an input).
- A glyph that points takes `rtl:rotate-180` or `rtl:-scale-x-100`.
- Switch the language and look at the same screen before calling it done.

## Where direction comes from

1. **`<html lang dir>`, synced on every Inertia visit** by `syncDocumentLanguage()`
   ([blueprint.md](blueprint.md#libdocumentts-direction-sync)). Inertia swaps pages under one
   document, so a `dir` the server wrote on the first load outlives a language switch. Tailwind's
   `rtl:` and `ltr:` variants read this attribute.
2. **`<ConfigProvider :dir :locale>` at the root of every layout.** Reka reads direction from it,
   not from `<html>`. Without it every primitive places its popper and resolves its arrow keys as if
   the page were LTR: the dropdown opens off-screen and nothing in the CSS explains why. The `Toaster`
   also takes `:dir`.
3. **The registry generated with `rtl: true`** in `components.json`, so `components/ui/` speaks
   logical properties.

Components read direction from `ConfigProvider` or CSS, never from `document` in script.

## Layout once, both directions

| Instead of | Write |
|---|---|
| `ml-2` / `mr-2` | `ms-2` / `me-2` |
| `pl-4` / `pr-4` | `ps-4` / `pe-4` |
| `left-0` / `right-0` | `start-0` / `end-0` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `border-l` / `border-r` | `border-s` / `border-e` |
| `rounded-l-lg` / `rounded-r-lg` | `rounded-s-lg` / `rounded-e-lg` |
| `space-x-2` on a flex row | `gap-2` |

- Flex and grid order follow `dir` on their own; don't reverse them.
- Centring with `left-1/2 -translate-x-1/2` is symmetric and fine.
- What logical properties cannot express (a transform, a shadow offset, a background position) takes
  `rtl:` / `ltr:` variants. Never branch on direction in script for something CSS can state.

## Mixed-direction text

A run in a language other than its surroundings must be isolated, or neutral characters (dots,
slashes, digits, brackets, trailing punctuation) jump ends and the line renders reversed.

- **A Latin value inside an Arabic page** (phone numbers, ids, codes, URLs, emails, versions,
  permission keys): `dir="ltr"` on the element that shows it, or `<bdi dir="ltr">`.
- **Inside a translated sentence**, wrap the value in the Unicode isolates U+2066 (LRI) and U+2069
  (PDI). Add them where the rendered page shows a flip; they are invisible in the source.
- **Text a user typed, or a message in either language:** `dir="auto"` on its element.
- **Code and commands:** `<pre dir="ltr" class="text-start">`.

```vue
<a :href="customer.website" dir="ltr">{{ customer.website }}</a>
<span class="font-mono text-xs" dir="ltr">{{ permission.key }}</span>
```

## Inputs

- **A plain input follows the page direction.** Typing Latin into an RTL input works.
- **`dir="ltr"` is for display, never for a plain input.** It drags the caret to the far edge and
  puts an Arabic placeholder on the wrong side of its own box.
- **An input that holds Latin** (a code, a URL, a JSON body) takes `:dir="autoDir(form.code)"` from
  `lib/direction.ts`. `dir="auto"` alone reads the value, and an empty box has none, so the browser
  falls back to LTR; `autoDir` returns `undefined` while the box is empty (the page decides) and
  `'auto'` once there is a value.
- **An affix with meaning makes the whole group LTR**, affix included: a URL prefix, a unit after a
  number, a dial code before a phone number.
- **A leading icon is not an affix.** An `InputGroupAddon` holding only an icon carries no order, so
  that group stays in the page direction. Email, password, price: all plain.

## Icons that point

- **Flip:** chevrons, arrows, back and forward, undo and redo, reply, send, external link.
- **Never flip:** clocks, phones, checkmarks, play buttons, logos, anything with a digit or a letter.
- **Rotate** (`rtl:rotate-180`) a glyph symmetrical about its centre (chevrons, plain arrows).
  **Mirror** (`rtl:-scale-x-100`) one that is not (an arrow entering a door).
- Use the left chevron for "previous" and the right one for "next", and let the class flip both.
  Don't swap icons by direction.
- A directional character typed into copy (`→`) can do neither, so it is an icon, never a literal.
- A hover nudge with `translate-x-*` needs its `rtl:-translate-x-*` twin.

```vue
<ChevronRightIcon class="rtl:rotate-180" />
<LogInIcon class="rtl:-scale-x-100" />
```

## Numbers, dates and charts

- Latin digits in both languages: numbers with `en-US`, dates with `ar-u-ca-gregory-nu-latn` for
  Arabic. Format in one helper in `lib/`, never with `toLocaleString` in a component.
- Columns of numbers take `tabular-nums`; money and numbers sit in `dir="ltr"` so a minus sign and
  a currency symbol keep their place.
- A date is shown inside `dir="ltr"` (`DateTimeValue` does this).
- Chart axes stay left to right inside an Arabic page; that is the normal reading of a time series.

## Registry gaps

`rtl: true` rewrites the properties that have logical twins. Anything without one (a transform, a
shadow offset, a background position) is left alone, so a component looks right in English and broken
in Arabic. The fixes are unlayered rules at the foot of `assets/app.css`, unlayered because Tailwind's
utilities are layered and would otherwise win.

Found in the shadcn-vue registry (checked 2026-11-03; re-check after upgrading):

1. **`SheetContent` stays physical.** It positions on `left-0` / `right-0` while `Sidebar` treats
   `side` as start and end, so in Arabic the mobile sidebar sits on the wrong edge and slides in from
   the wrong one. The override flips the edge and the enter/exit translate. It keys on **two**
   `data-slot` values, because the sidebar's mobile branch renames the sheet's slot to `"sidebar"`.
2. **`AlertDialogHeader` aligns with `sm:text-left`.** Restated as `text-align: start` inside the same
   breakpoint, leaving the small-screen centring alone.
3. **`Switch`'s thumb travels on `translate`.** The override mirrors the checked travel only; unchecked
   is `0` in both directions.

Still physical in the registry; add an override the moment you use one:

| Component | What is physical |
|---|---|
| `ToggleGroupItem` | `first:rounded-l-*` / `last:rounded-r-*`, `border-l-0`, inline paddings |
| `SidebarRail` | `group-data-[side=right]:left-0`, `group-data-[side=left]:-right-4` |
| `TabsTrigger` | `group-data-vertical/tabs:after:-right-1` (vertical tabs only) |

Already correct: pagination arrows (with `rtl:rotate-180`), the breadcrumb separator, the sidebar's
collapsible chevron and the toaster.

When adding a registry component that animates or offsets, toggle it once in Arabic before trusting
it.

## Checking it

Switch the language and look at the same screen. What breaks first: poppers (wrong side), drawers
(wrong edge), icons that imply direction, anything with a physical class, and anything that animates
or offsets.
