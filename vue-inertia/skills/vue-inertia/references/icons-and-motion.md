# Icons and motion

**Read when:** adding an icon, an animation or a transition, or considering a new icon set or
animation library.
**Owns:** the icon package and how icons are imported, sized, coloured and named; when to animate,
with what, and the guards every animation needs.

## TL;DR

- One icon package: `@lucide/vue`, named imports with the `Icon` suffix (`PencilIcon`).
- Inside a shadcn component, never size the icon; outside, size with `size-*`.
- Colour comes from the parent's `text-*`; decorative icons get `aria-hidden="true"`.
- Working screens need little motion: overlays from the registry already animate.
- Every animation is off under `prefers-reduced-motion: reduce` and in print.
- No animation library without a need CSS and Vue's `<Transition>` cannot meet.

## Icons

```vue
<script setup lang="ts">
import { MoonIcon, SunIcon } from '@lucide/vue';
</script>

<template>
    <Button variant="ghost" size="icon" :aria-label="t('common.toggle_theme')">
        <SunIcon v-if="isDark" aria-hidden="true" />
        <MoonIcon v-else aria-hidden="true" />
    </Button>
</template>
```

- **`@lucide/vue`** is what shadcn-vue's CLI resolves `iconLibrary: "lucide"` to, not
  `lucide-vue-next` (checked 2026-11-03).
- **The `Icon` suffix** (`LinkIcon`, `TableIcon`) keeps an icon from clashing with a component of the
  same name (`Link`, `Table`) in one file.
- **Always a named import.** `import * as icons` pulls the whole set into the bundle.
- **One icon package per app.** Two sets in one interface look like a bug. When Lucide lacks a
  glyph, draw one component on Lucide's 24px grid with a 2px round stroke, or add `unplugin-icons`
  with one Iconify set; never paste one-off SVG paths into pages.
- **Inside `Button`, `Badge` and friends, don't size the icon.** They size it per variant. Outside
  them, `size-4` beside `text-sm`, `size-3.5` beside `text-xs`.
- **`aria-hidden="true"` on every decorative icon.** The accessible name goes on the control.
- **Colour comes from the parent's `text-*`.** Never set `color` or `stroke` on the icon.
- **One concept, one icon** across the app. Which icon goes with which action is in
  [actions-and-feedback.md](actions-and-feedback.md#icons-on-buttons).
- **Directional icons flip in RTL** ([rtl-and-bidi.md](rtl-and-bidi.md#icons-that-point)).
- **Emoji are content, never chrome.** `☀️` renders as a platform colour glyph that ignores
  `currentColor`, so a themed icon button cannot match its own text.

## Motion

| Need | Use |
|---|---|
| an overlay opening (dialog, menu, popover, sheet) | the registry's own animation; add nothing |
| an element appearing on load | one small CSS keyframe utility (opacity plus `translateY`) |
| one element swapping for another | Vue's `<Transition>` |
| a list gaining, losing or reordering items | `<TransitionGroup>` with a stable key |

- **Instant for what people open many times a day.** A menu or a picker opened from the keyboard
  dozens of times an hour gains nothing from a fade; the wait is the only thing it adds.
- **Fade with `animation-duration-*`, not `duration-*`,** on a registry overlay: `duration-*` also
  sets `transition-duration`, and with no property list every property transitions.
- **Direction-agnostic transforms** (opacity, `translateY`, scale). A hand-written `translateX` or
  `left` moves the wrong way in RTL unless it has an `rtl:` twin.
- Don't add motion to tables or forms for its own sake.

Two guards are not optional:

```css
@media (prefers-reduced-motion: reduce), print {
    .rise {
        animation: none;
    }
}
```

An animation that survives into print or a PDF export is a bug.

## Adding an animation library

Don't, without a concrete need the table above cannot meet. Bundle size matters most to people on
mobile data. An evaluation (recorded 2026-09; re-check before relying on it):

| Package | Verdict |
|---|---|
| `@formkit/auto-animate` | fine for list add, remove and reorder, nothing else; about 3 kB gzipped, no dependencies, handles reduced motion itself |
| `motion-v` | the upgrade if spring physics or layout animation is ever needed; large |
| `@vueuse/motion` | avoid: depends on unmaintained `popmotion` / `framesync` |
| `gsap` | avoid here: not MIT-licensed, large |
