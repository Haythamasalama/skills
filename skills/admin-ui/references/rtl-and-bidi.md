# Direction and bidi

How one set of markup runs RTL in Arabic and LTR in English, where the registry needs help, and
how to keep mixed-language text in order. Nothing is written twice.

## Where direction comes from

1. **`<html lang dir>`, synced on every Inertia visit.** Inertia swaps pages under one document, so
   a `dir` written by the server on first load outlives a language switch. A small
   `syncDocumentLanguage()` in `app.ts` sets both on each navigation.
2. **`<ConfigProvider :dir :locale>` at the root of every layout.** This is what Reka reads.
   Without it every primitive places its popper and resolves its arrow keys as if the page were
   LTR: the dropdown opens off-screen and nothing in the CSS explains why. (It is the one place
   hand-written code imports from `reka-ui` directly.)
3. **The registry generated with `--rtl`**, so `components/ui/` speaks logical properties. Don't
   hand-patch it.

## What you write

Logical, always: `ms-` `me-` `ps-` `pe-` `start-` `end-` `border-s` `border-e` `rounded-s`
`rounded-e` `text-start` `text-end`. Never `ml-` `mr-` `pl-` `pr-` `left-` `right-` `text-left`
`text-right`.

## Isolate runs of the other language

Any run of text in a language different from its surroundings must be isolated, or neutral
characters (slashes, digits, brackets, trailing punctuation) jump ends and the line renders
reversed. This is a correctness bug, not a style preference.

```html
<p class="bidi" lang="ar" dir="rtl">وين ساكنة؟</p>
<p class="bidi" lang="en" dir="ltr">wēn sākne?</p>
```

A `.bidi` utility sets `unicode-bidi: isolate`, and the font is picked from `:lang()`. Inside a
translated string, wrap the run in U+2066 … U+2069 (LRI … PDI) instead.

## `dir="ltr"` is for display, not for typing

A Latin identifier shown inside Arabic copy (a host, a URL, a database name, a permission key)
goes in a `dir="ltr"` wrapper, so bidi does not reorder it around the dots:

```vue
<a :href="customer.url" dir="ltr">{{ customer.url }}</a>
<span class="font-mono text-xs" dir="ltr">{{ permission.key }}</span>
```

**Never on a plain input.** It drags the caret to the far side from where the reader starts, and
an Arabic placeholder ends up on the wrong edge of its own box. An input that holds Latin (a code,
a host, a URL, a JSON body) takes `:dir="autoDir(value)"`:

```ts
export const autoDir = (value: unknown): 'auto' | undefined =>
    value === null || value === undefined || value === '' ? undefined : 'auto';
```

`dir="auto"` alone is not enough: it reads the value, an empty box has none, browsers fall back to
LTR, and the placeholder lands on the wrong edge. `autoDir` returns `undefined` while the box is
empty (the page decides) and `"auto"` once there is a value.

**An affix with meaning makes the whole group LTR.** An `InputGroup` whose affix side matters (a
subdomain with a `.example.test` suffix, a `db_` prefix, the dial code before a phone number) is
`dir="ltr"`, affix included.

**A leading icon is not an affix.** An `InputGroupAddon` holding only an icon carries no order, so
the group stays in the page direction: the icon sits at the start, the label above agrees, and a
Latin value still renders left to right on its own. Adding `dir="ltr"` there flips the whole field
away from the rest of the form. Email, password, price, a bare host: all plain.

## `rtl:` and `ltr:` for what must differ

Logical properties cover position and spacing. What they can't cover (a glyph that points, a
transform, a shadow offset) takes Tailwind's direction variants, which read `dir` on `<html>`:

```vue
<ChevronRightIcon class="rtl:rotate-180" />     <!-- symmetrical: rotate -->
<LogInIcon class="rtl:-scale-x-100" />          <!-- an arrow inside a glyph: mirror -->
```

- **Rotate** a glyph that is symmetrical about its centre (chevrons, plain arrows).
- **Mirror** (`-scale-x-100`) one that is not (an arrow entering a door).
- Use `ChevronLeft` for "previous" and `ChevronRight` for "next" and let the class flip both. Don't
  swap components by direction.
- **A directional character typed into copy (`→`, `←`) can do neither.** It is an icon, never a
  literal.
- Prefer these variants to writing a rule twice, and never branch on the page direction in script
  for something CSS can state.

**Flip:** chevrons, arrows, back/forward, undo/redo, indent, reply, send.
**Never flip:** clocks, checkmarks, play buttons, logos, anything containing a digit or a letter.

## Registry gaps and the fixes

`--rtl` rewrites properties that have logical twins. Anything with no logical form (a transform, a
shadow offset, a background position) it leaves alone, so the component looks right in English and
broken in Arabic. Fix them with one **unlayered** block at the foot of the stylesheet (unlayered
because Tailwind's utilities are layered and would otherwise win).

Found in the shadcn-vue registry in 2026-09/10; re-check after upgrading:

1. **`SheetContent` stayed physical.** It positions on `left-0`/`right-0` while `Sidebar` treats
   `side` as start/end, so in Arabic the mobile drawer sat on the wrong edge and slid in from the
   wrong one. The override flips the edge and the enter/exit translate variables. Key it on **two**
   `data-slot` values: the sidebar's mobile branch overwrites the sheet's slot name with
   `"sidebar"`, so a selector on `sheet-content` alone silently matches nothing.
2. **`AlertDialogHeader` aligns with `sm:text-left`.** Every confirmation goes through it, so in
   Arabic the question sat against the left edge. Restate it as `text-align: start` inside the same
   breakpoint, leaving the small-screen centring alone.
3. **`Switch`'s thumb travels on `translate`.** In Arabic the thumb rests at the right and the
   checked state pushed it further right, out of the track. Mirror the checked travel only;
   unchecked is `0` in both directions.
4. **Hardcoded English in a registry component.** Override at the call site (a slot,
   `aria-label`), never by editing the file.

Components that still held physical classes but were not in use yet; fix them the moment one is:

| Component | What is physical |
|---|---|
| `ToggleGroupItem` | `first:rounded-l-*` / `last:rounded-r-*`, `border-l-0`, inline paddings |
| `SidebarRail` | `group-data-[side=right]:left-0`, `group-data-[side=left]:-right-4` |
| `TabsTrigger` | `group-data-vertical/tabs:after:-right-1` (vertical tabs only) |

Things that were already right in that sweep: pagination arrows, the breadcrumb separator, the
sidebar's collapsible chevron and the toaster all flip.

## Charts are the exception

Chart libraries draw axes left to right. A time series reading left to right inside an Arabic page
is the normal convention; leave it.

## Checking it

Switch the language from the user menu and look at the same screen. What breaks first: poppers
(wrong side), drawers (wrong edge), icons that imply direction, anything with a physical class, and
anything that animates or offsets. When adding a registry component that animates or offsets,
toggle it once in Arabic before believing it.
