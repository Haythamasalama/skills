# shadcn-vue in Arabic (RTL)

What the registry needs to run right to left from the same markup, and the gaps it still has.

## Turning it on

1. **Generate the registry in RTL mode.** New project: `npx shadcn-vue@latest init --rtl` (or
   `create --rtl`). Existing one: set `"rtl": true` in `components.json`, then re-add the installed
   components (`npx shadcn-vue@latest add <name> --overwrite`) and read `git diff` (checked 2026-11-03).
2. **`<html lang dir>`** set by the app, and kept in sync when the language changes without a reload
   (an Inertia visit, a Nuxt route change).
3. **`<ConfigProvider :dir :locale>` from `reka-ui` at the root of every layout.** Reka reads direction
   from it, not from the CSS. Without it every popper is placed and every arrow key resolved as if the
   page were LTR: the dropdown opens off-screen. This is the one place hand-written code imports
   `reka-ui` directly.

## What you write

- Logical classes only: `ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`, `border-s`,
  `rounded-s-*`, `gap-*` instead of `space-x-*`.
- A glyph that points: `rtl:rotate-180` when it is symmetrical (chevrons, plain arrows),
  `rtl:-scale-x-100` when it is not (an arrow entering a door). Clocks, checkmarks and logos never flip.
- A Latin value inside Arabic text (URL, host, key, phone): `dir="ltr"` on the element that shows it,
  never on a plain input.
- An `InputGroup` with a meaningful affix (`db_`, `.example.test`, a dial code) is LTR as a whole; one
  whose `InputGroupAddon` holds only an icon stays in the page direction.

## Registry gaps and the fixes

RTL mode rewrites properties that have logical twins. Anything with no logical form (a transform, a
shadow offset, a background position) is left alone, so the component looks right in English and
broken in Arabic. Fix them with one **unlayered** block at the foot of the stylesheet (unlayered
because Tailwind's utilities are layered and would otherwise win).

Found in 2026-09/10; re-check after upgrading:

1. **`SheetContent` stayed physical.** It positions on `left-0`/`right-0` while `Sidebar` treats
   `side` as start/end, so in Arabic the mobile drawer sat on the wrong edge and slid in from the
   wrong one. The override flips the edge and the enter/exit translate variables. Key it on **two**
   `data-slot` values: the sidebar's mobile branch overwrites the sheet's slot name with `"sidebar"`,
   so a selector on `sheet-content` alone silently matches nothing.
2. **`AlertDialogHeader` aligns with `sm:text-left`.** Restate it as `text-align: start` inside the
   same breakpoint, leaving the small-screen centring alone.
3. **`Switch`'s thumb travels on `translate`.** In Arabic the checked state pushed the thumb out of
   the track. Mirror the checked travel only; unchecked is `0` in both directions.
4. **Hardcoded English in a component.** Override at the call site (a slot, `aria-label`), never by
   editing the file.

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
(wrong edge), icons that imply direction, and anything that animates or offsets. When adding a
component that animates or offsets, toggle it once in Arabic before believing it.
