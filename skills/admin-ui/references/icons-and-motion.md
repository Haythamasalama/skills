# Icons and motion

## Icons: chrome versus content

| Kind | Use |
|---|---|
| Buttons, toggles, menus, chevrons, close, search, status | **Lucide** (`@lucide/vue`) |
| Content a reader takes as meaning (vocabulary glyphs, image fallbacks) | **Emoji** are fine |

Never mix the two in one control. Emoji as chrome has a real cost: `☀️` and `🌙` render as
platform colour glyphs that ignore `currentColor`, so a themed icon button cannot match its own
text colour.

```vue
<script setup lang="ts">
import { MenuIcon, MoonIcon, SunIcon } from '@lucide/vue';
</script>

<template>
    <Button variant="ghost" size="icon" :aria-label="t('common.toggle_theme')">
        <SunIcon v-if="isDark" aria-hidden="true" />
        <MoonIcon v-else aria-hidden="true" />
    </Button>
</template>
```

- **Always a named import.** `import * as icons` defeats tree-shaking and pulls the whole set;
  named imports ship only what you use (four icons cost under 1 kB gzipped in one header).
- **One icon package per app.** With shadcn-vue's `iconLibrary: "lucide"` the CLI resolves to
  `@lucide/vue`, not `lucide-vue-next` (recorded 2026-09; check your CLI version). An architecture
  test can enforce it.
- **Inside a shadcn component, don't size the icon.** `Button`, `Badge` and friends size their
  icons in CSS. Outside them, size with `size-*` (or `:size`) matched to the text.
- **`aria-hidden="true"` on every decorative icon.** The accessible name goes on the control.
- **Colour comes from the parent's `text-*`.** Never set `color` or `stroke` on the icon.
- **Directional icons flip in RTL** (see `rtl-and-bidi.md`).
- **When Lucide lacks something** (flags for a language switcher is the known case), add
  `unplugin-icons` with an Iconify set rather than committing a one-off SVG. Don't install a second
  general-purpose icon set: two sets in one interface look like a bug.

## Motion

| Need | Use |
|---|---|
| an element appearing on load | one small CSS keyframe utility (a rise: opacity + `translateY`) |
| one element swapping for another | Vue's `<Transition>` |
| a list gaining, losing or reordering children | `<TransitionGroup>` with a **stable key**, or auto-animate |

Two guards are non-negotiable:

1. **Every animation is off under `prefers-reduced-motion: reduce`.**
2. **Every animation is off in `@media print`.** If the app prints or exports PDF, an animation
   that survives into print is a bug.

```css
@media (prefers-reduced-motion: reduce), print {
    .rise { animation: none; }
}
```

- **Hand-written `translateX` or `left` mirrors wrongly under RTL.** Prefer direction-agnostic
  transforms (opacity, `translateY`, scale), or gate on `[dir]`.
- Admin screens need little motion: overlays from the registry already animate. Don't add motion
  to tables or forms for its own sake.

## Adding an animation library

Don't, without a concrete need the table above cannot meet. Bundle size matters most for people on
mobile data. An evaluation recorded in 2026-09 (re-check before relying on it):

| Package | Verdict |
|---|---|
| `@formkit/auto-animate` | Fine for list add/remove/reorder, and nothing else. About 3 kB gzipped, no dependencies, handles reduced motion itself, FLIP-based so direction-agnostic. Don't install it speculatively |
| `motion-v` | The real upgrade if spring physics or layout animation is ever needed. Large (~550 KB unpacked) |
| `@vueuse/motion` | Rejected: unmaintained, depends on deprecated `popmotion`/`framesync` |
| `gsap` | Rejected: not MIT (a licence with terms), ~6 MB unpacked |
| `animejs` | Rejected for this use: peer-depends on `three`, ~2 MB unpacked |
