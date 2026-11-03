# Arabic (RTL)

**Read when:** the app runs in Arabic, something sits on the wrong side, or you are about to type
`left`, `right`, `ml-` or `pr-`.
**Owns:** turning RTL on, where Reka reads direction from, what you write, `dir="ltr"` on values,
and the registry's RTL gaps with their fixes.

## TL;DR

- Generate the registry with RTL on (`"rtl": true`), set `<html lang dir>`, and wrap every layout in
  Reka's `ConfigProvider :dir`.
- Write logical classes only; `rtl:` variants for what has no logical form.
- `dir="ltr"` goes on an element that **shows** a Latin value, not on a plain input.
- RTL mode cannot rewrite transforms and offsets. The fixes live unlayered in the stylesheet.

## Turning it on

1. **The registry in RTL mode** (checked 2026-11-03 against shadcn-vue.com/docs/rtl):
   - new project: `npx shadcn-vue@latest init --rtl` (or `create --rtl`);
   - existing project: `npx shadcn-vue@latest migrate rtl` rewrites every file in the `ui` folder
     and sets `"rtl": true`. A path or glob limits it: `migrate rtl "resources/js/components/ui/**"`.
     Read `git diff` after.
   With `rtl` on, `add` writes logical classes (`left-*` → `start-*`), flips the supported icons with
   `rtl:rotate-180`, and makes slide animations logical (`slide-in-from-right` → `slide-in-from-end`).
2. **`<html lang dir>`** set by the app, and kept in sync when the language changes without a reload
   (an Inertia visit, a Nuxt route change). Why: a `dir` written once on first load outlives a switch
   of language.
3. **`<ConfigProvider :dir :locale>` from `reka-ui` at the root of every layout.** Reka reads
   direction from it, not from CSS. Without it every popper is placed and every arrow key resolved
   as if the page were LTR: the dropdown opens off-screen and nothing in the CSS explains why.

```vue
<script setup lang="ts">
import { ConfigProvider } from 'reka-ui';

defineProps<{ dir: 'ltr' | 'rtl'; locale: string }>();
</script>

<template>
    <ConfigProvider :dir="dir" :locale="locale">
        <slot />
    </ConfigProvider>
</template>
```

4. **Portalled content that slides in** (`PopoverContent`, `TooltipContent`) may need `:dir` passed
   directly, because the logical slide utilities in `tw-animate-css` read direction from the element
   itself (per the docs, checked 2026-11-03).

## What you write

- Logical classes only: `ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`/`text-end`,
  `border-s`/`border-e`, `rounded-s-*`. Never `ml-`, `pr-`, `left-`, `text-left`.
- A glyph that points: `rtl:rotate-180` when it is symmetrical (chevrons, plain arrows),
  `rtl:-scale-x-100` when it is not (an arrow entering a door). Clocks, checkmarks and logos never
  flip. A typed `→` cannot flip at all, so use an icon.
- Prefer `rtl:` / `ltr:` variants to branching on the direction in script.

## `dir="ltr"` is for display, not for typing

- A Latin value shown inside Arabic text (URL, host, email, code, key) sits in an element with
  `dir="ltr"`, so bidi does not reorder it around dots and slashes.
- **Never on a plain input.** It moves the caret to the far side and puts an Arabic placeholder on
  the wrong edge. An input that holds Latin takes `dir="auto"` only once it has a value:
  `:dir="value ? 'auto' : undefined"`. Why: `dir="auto"` reads the value, and an empty box falls
  back to LTR.
- An `InputGroup` whose affix is part of the value (a `.example.com` suffix, a `+1` dial code, a
  prefix such as `inv_`) is LTR as a whole. One whose `InputGroupAddon` holds only an icon stays in
  the page direction.

## Registry gaps and the fixes

RTL mode rewrites properties that have logical twins. A transform, a shadow offset or a background
position has none, so the component looks right in English and broken in Arabic. The fixes are one
**unlayered** block at the foot of the stylesheet, already in
[../assets/app.css](../assets/app.css). Unlayered because Tailwind's utilities are layered and
would otherwise win.

Found with shadcn-vue 2.8.x (checked 2026-11-03); re-check after upgrading:

1. **`SheetContent` stays physical.** It positions on `left-0`/`right-0` while `Sidebar` treats
   `side` as start/end, so in Arabic the mobile sidebar sat on the wrong edge and slid in from the
   wrong one. The fix flips the edge and the enter/exit translate variables. It keys on **two**
   `data-slot` values: the sidebar's mobile branch overwrites the sheet's slot name with
   `"sidebar"`, so a selector on `sheet-content` alone matches nothing.
2. **`AlertDialogHeader` aligns with a physical `sm:text-left`.** The fix restates it as
   `text-align: start` inside the same breakpoint, leaving the small-screen centring alone.
3. **`Switch`'s thumb travels on `translate`.** In Arabic the checked state pushed the thumb out of
   the track. The fix mirrors the checked travel only; unchecked is `0` both ways.
4. **Hardcoded English inside a component.** Override at the call site (a slot, `aria-label`).

The docs list **Calendar, Pagination and Sidebar** as not migrated automatically; check them in
Arabic when you add them. Still physical in that build, fix them the moment you use one:

| Component | What is physical |
|---|---|
| `ToggleGroupItem` | `first:rounded-l-*` / `last:rounded-r-*`, `border-l-0`, inline paddings |
| `SidebarRail` | `group-data-[side=right]:left-0`, `group-data-[side=left]:-right-4` |
| `TabsTrigger` | `group-data-vertical/tabs:after:-right-1` (vertical tabs only) |

## Checking it

Switch the language and look at the same screen. What breaks first: poppers (wrong side), drawers
(wrong edge), icons that imply direction, and anything that animates or offsets. When adding a
component that animates or offsets, toggle it once in Arabic before believing it.
