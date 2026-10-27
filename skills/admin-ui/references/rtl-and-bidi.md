# Direction and bidi

How one set of markup runs RTL in Arabic and LTR in English on this stack, and where the registry
needs help. Nothing is written twice.

The generic bidi rules (logical classes, isolating mixed-language runs, `dir="auto"` and inputs,
which icons flip and how, Latin digits, Arabic fonts, charts) live once in the `nuxt-ui` skill's
[i18n-rtl.md](../../nuxt-ui/references/i18n-rtl.md); they hold for any stack. This file keeps what
is specific to Inertia, Reka and the shadcn-vue registry.

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

Logical classes always
([the mapping](../../nuxt-ui/references/i18n-rtl.md#layout-once-both-directions)). Mixed-language
runs and inputs follow
[Mixed-direction text](../../nuxt-ui/references/i18n-rtl.md#mixed-direction-text); in this registry:

```vue
<a :href="customer.url" dir="ltr">{{ customer.url }}</a>
<span class="font-mono text-xs" dir="ltr">{{ permission.key }}</span>
<Input v-model="form.host" :dir="autoDir(form.host)" />
```

The affix group that turns `dir="ltr"` is an `InputGroup` whose affix carries order; an
`InputGroupAddon` holding only an icon is not an affix, so that group stays in the page direction.

Glyphs that point use Tailwind's direction variants on the Lucide component
([which and how](../../nuxt-ui/references/i18n-rtl.md#icons-that-point-somewhere)):

```vue
<ChevronRightIcon class="rtl:rotate-180" />     <!-- symmetrical: rotate -->
<LogInIcon class="rtl:-scale-x-100" />          <!-- an arrow inside a glyph: mirror -->
```

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

Charts keep their left-to-right axes: [Charts](../../nuxt-ui/references/i18n-rtl.md#charts).

## Checking it

Switch the language from the user menu and look at the same screen. What breaks first: poppers
(wrong side), drawers (wrong edge), icons that imply direction, anything with a physical class, and
anything that animates or offsets. When adding a registry component that animates or offsets,
toggle it once in Arabic before believing it.
