# Direction and bidi

How one set of markup runs RTL in Arabic and LTR in English on Inertia + Vue, and where a component
registry needs help. Nothing is written twice.

## Where direction comes from

1. **`<html lang dir>`, synced on every Inertia visit.** Inertia swaps pages under one document, so
   a `dir` written by the server on first load outlives a language switch. A small
   `syncDocumentLanguage()` in `app.ts` sets both on each navigation.
2. **`<ConfigProvider :dir :locale>` at the root of every layout** (from `reka-ui`, which shadcn-vue
   is built on). Without it every primitive places its popper and resolves its arrow keys as if the
   page were LTR: the dropdown opens off-screen and nothing in the CSS explains why.
3. **The component registry generated in RTL mode** (shadcn-vue: `--rtl`, or `"rtl": true` in
   `components.json`), so `components/ui/` speaks logical properties. Don't hand-patch it.

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

- Flex and grid order follow `dir` on their own. Don't reverse them.
- `rtl:` and `ltr:` variants handle the rare exception (`rtl:-scale-x-100`).
- Centring with `left-1/2 -translate-x-1/2` is symmetric and fine.

## Mixed-direction text

Any run in a language other than its surroundings must be isolated, or neutral characters (slashes,
digits, brackets, trailing punctuation) jump ends and the line renders reversed.

- **Left-to-right values inside an Arabic line** (phone numbers, IDs, codes, paths, versions, emails,
  URLs, hosts, permission keys): `dir="ltr"` on the inline element that shows it, or `<bdi dir="ltr">`.
- **Inside a translated string**, wrap the value in Unicode isolates U+2066 … U+2069 (LRI … PDI).
  Add them where the rendered page shows a flip, not in advance: they are invisible in the source.
- **Text a user typed, or a message that can be in either language:** `dir="auto"` on the element.
- Code and commands: `<pre dir="ltr" class="text-start">`.

```vue
<a :href="customer.url" dir="ltr">{{ customer.url }}</a>
<span class="font-mono text-xs" dir="ltr">{{ permission.key }}</span>
<Input v-model="form.host" :dir="autoDir(form.host)" />
```

### Inputs

- **Inputs follow the page direction.** Typing Latin into an RTL input works.
- **`dir="ltr"` is for display, never for a plain input.** It drags the caret to the far side and puts
  an Arabic placeholder on the wrong edge.
- An input that holds Latin (a code, a host, a URL) may take `dir="auto"` once it has a value. An empty
  box has nothing to read and falls back to LTR, so return `undefined` while it is empty:

  ```ts
  export const autoDir = (value: unknown): 'auto' | undefined =>
      value === null || value === undefined || value === '' ? undefined : 'auto';
  ```

- **An affix with meaning makes the whole group LTR**, affix included: a `.example.test` suffix, a
  `db_` prefix, a dial code. An `InputGroupAddon` holding only an icon is not an affix, so that group
  stays in the page direction.

## Icons that point somewhere

- **Flip:** chevrons, arrows, back/forward, undo/redo, reply, send, external link.
- **Never flip:** clocks, phones, checkmarks, play buttons, logos, anything with a digit or a letter.
- **Rotate** (`rtl:rotate-180`) a glyph symmetrical about its centre (chevrons, plain arrows).
  **Mirror** (`rtl:-scale-x-100`) one that is not (an arrow entering a door).
- Use the left chevron for "previous" and the right for "next", and let the class flip both. Don't
  swap icons by direction, and never branch on direction in script for something CSS can state.
- A directional character typed into copy (`→`) can do neither. It is an icon, never a literal.

```vue
<ChevronRightIcon class="rtl:rotate-180" />
<LogInIcon class="rtl:-scale-x-100" />
```

## Numbers, dates and charts

- Latin digits in both languages: numbers with `en-US`, dates with `ar-u-ca-gregory-nu-latn` for Arabic.
- Columns of numbers: `tabular-nums`.
- Chart axes stay left to right inside an Arabic page; put `dir="ltr"` on a numeric axis container.

## Registry gaps and the fixes

RTL mode rewrites properties that have logical twins. Anything with no logical form (a transform, a
shadow offset, a background position) is left alone, so the component looks right in English and
broken in Arabic. Fix them with one **unlayered** block at the foot of the stylesheet (unlayered
because Tailwind's utilities are layered and would otherwise win).

Found in the shadcn-vue registry in 2026-09/10; re-check after upgrading:

1. **`SheetContent` stayed physical.** It positions on `left-0`/`right-0` while `Sidebar` treats
   `side` as start/end, so in Arabic the mobile drawer sat on the wrong edge. The override flips the
   edge and the enter/exit translate variables. Key it on **two** `data-slot` values: the sidebar's
   mobile branch overwrites the sheet's slot name with `"sidebar"`.
2. **`AlertDialogHeader` aligns with `sm:text-left`.** Restate it as `text-align: start` inside the
   same breakpoint, leaving the small-screen centring alone.
3. **`Switch`'s thumb travels on `translate`.** Mirror the checked travel only; unchecked is `0` in
   both directions.
4. **Hardcoded English in a registry component.** Override at the call site (a slot, `aria-label`),
   never by editing the file.

Still physical but not in use in that sweep; fix them the moment one is:

| Component | What is physical |
|---|---|
| `ToggleGroupItem` | `first:rounded-l-*` / `last:rounded-r-*`, `border-l-0`, inline paddings |
| `SidebarRail` | `group-data-[side=right]:left-0`, `group-data-[side=left]:-right-4` |
| `TabsTrigger` | `group-data-vertical/tabs:after:-right-1` (vertical tabs only) |

Already right in that sweep: pagination arrows, the breadcrumb separator, the sidebar's collapsible
chevron and the toaster.

## Checking it

Switch the language and look at the same screen. What breaks first: poppers (wrong side), drawers
(wrong edge), icons that imply direction, anything with a physical class, and anything that animates
or offsets.
