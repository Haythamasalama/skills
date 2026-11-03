---
name: liquid-glass-web
description: Use when a website or landing page should look like a native Mac or iOS app — Apple-style Liquid Glass for the web (translucent layers with a light rim over soft colour, glassmorphism done right), one token set per light and dark theme, a calm accent colour, drawn macOS windows instead of screenshots, a hero scene, native-feeling motion, and app icons with glass layers in the macOS 26 style. Also when light and dark mode look mixed or washed out, or when glass looks grey or flat. Triggers include "Liquid Glass website", "glassmorphism", "make the site feel like a Mac app", "dark mode looks mixed", «زجاج آبل للموقع», «ستايل ليكويد جلاس», «الموقع يبين باهت».
---

# Liquid Glass on the web

**Read when:** styling a marketing site or web app so it feels native to Apple platforms, or fixing glass and theme problems on one.
**Owns:** the web glass tokens and recipe, the light and dark theme rules, drawn app windows, hero layout, app icon layers and motion.

Lessons from building app marketing sites with Liquid Glass. Apply them to any site that should feel native to Apple platforms.

## TL;DR

- The product is the most colourful thing on the page; everything around it is neutral glass with one accent.
- Each theme is one complete token set. Light values in `:root`, dark in `[data-theme="dark"]` and the media query;
  never write rules as "not dark". **Why:** "not dark" also matches a dark system theme with no toggle set.
- Glass needs colour behind it. **Why:** on plain white it reads grey; stacked on glass it reads muddy.
- Light glass is mostly white (≈74%) with a white top rim and darker secondary text; pale grey pages look faded.
- White text needs a darker accent fill (≥4.5:1); keep the bright accent for marks and focus.

## Principles

1. **Content first.** The product (screenshots, the drawn app window) is the most colourful thing on the page. Everything around it is neutral glass.
2. **One accent.** One brand colour, used sparingly: selection, focus, the main mark. No second accent, no rainbow gradients.
3. **Light is light, dark is dark.** Each theme is one complete token set. Nothing white inside dark mode, nothing black inside light mode, except the one deliberate inverse (the main download button).
4. **Glass needs something behind it.** Put soft drifting colour blobs, a wallpaper or a picture behind glass. Glass on plain white looks grey; glass on glass on glass looks muddy.
5. **Bright, not grey.** Light mode reads clean when the glass is mostly white (≈74% white) with a crisp white top rim and darker secondary text (≈#565A63). Pale grey backdrops make the whole page "faded and tiring".

## Tokens (start from these, tune the accent)

```css
:root {
  --bg: #FFFFFF; --surface: #F6F8FA; --card: #FFFFFF; --ink: #0A0A0B; --ink2: #2E3036; --muted: #565A63;
  --line: #E4E7EC; --accent: #2C8CF4; --accent-ink: #1A63D6; --accent-fill: #1A63D6;
  --glass: rgba(255,255,255,.74); --glass-strong: rgba(255,255,255,.86);
  --glass-line: rgba(15,35,70,.08); --rim: #FFFFFF; --frame: linear-gradient(135deg,#F7F9FB,#E6EBF1);
}
:root[data-theme="dark"] { /* and the same block inside @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } } */
  --bg: #0A0A0B; --surface: #121214; --card: #151517; --ink: #F5F5F7; --ink2: #D1D2D6; --muted: #9A9CA4;
  --line: #232327; --accent: #4FA6FF; --accent-ink: #8CC4FF;
  --glass: rgba(28,30,36,.5); --glass-strong: rgba(34,36,42,.68);
  --glass-line: rgba(255,255,255,.08); --rim: rgba(255,255,255,.14); --frame: linear-gradient(135deg,#2A2D33,#17191D);
}
```

Glass surface recipe:

```css
.glass {
  background: var(--glass);
  backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--glass-line);
  box-shadow: inset 0 1px 0 var(--rim), 0 1px 2px rgba(15,35,70,.05), 0 10px 28px -14px rgba(15,35,70,.16);
}
```

Use it for the floating capsule nav, cards, chips, tool tiles, tabs, the footer card, tables and the table of contents. Buttons and chips are full pills; cards 24px; tiles 20px; big frames 28px.

## Pitfalls that cost real time

- **Theme rules must check the theme, never "not dark".** A rule like `:root:not([data-theme="dark"]) .x { light stuff }` also fires when the *system* is dark and no toggle is set, which mixes light pieces into dark mode. Put light values in `:root`, dark values in `[data-theme="dark"]` plus the media query block. Test three cases: light, dark via toggle, dark via system.
- **Audit colours with a script, not by eye.** Walk every visible element and flag light backgrounds (luminance > .5) in dark mode and dark backgrounds in light mode; skip the deliberate inverses and drawn product art. Ignore elements mid-transition (a 0.2s background transition gives false positives).
- **White text on a bright accent fails contrast.** `#2C8CF4` with white is 3.4:1. Keep a darker `--accent-fill` (≥4.5:1, e.g. `#1A63D6`) for anything with white text on it.
- **Blurred children ignore the parent's rounded clip.** An element with `backdrop-filter` inside an `overflow: hidden; border-radius` parent pokes out with square corners. Give the blurred child the same radius (e.g. a menu bar gets `border-radius: R R 0 0`) and `isolation: isolate` on the parent.
- **Don't fake real UI colours.** Inside a drawn Mac window use macOS colours (system blue `#0A84FF`, window greys); keep the brand accent for the page around it.

## Drawn app windows instead of screenshots

When real captures aren't available or look cluttered, draw the app in HTML: a macOS window (traffic lights, toolbar pill, canvas, inspector, bottom bar) holding an everyday page (a checkout, a settings screen), sized in `em` off a container query (`container-type: inline-size; font-size: ~1cqw`) so it scales like an image and stays sharp. Render it from the page's language and theme. Annotation marks: soft red (`#E5534B`), thin lines, small numbered badges beside — never on — what they mark, one short note, pixelation in one place at most. App Store product pages are different: read the current App Review Guidelines (developer.apple.com/app-store/review/guidelines/) before using a drawn screen there; real captures of the app in use are the safe default.

## Hero composition

Words first (icon, product name, one-line promise, buttons, small print), then the product scene: a vivid macOS-style wallpaper (draw your own; don't copy Apple's) with a translucent menu bar and the window on top, plus a night wallpaper for dark mode.

## App icons in the macOS 26 style

Keep the idea simple (one symbol), use 2–3 colours, and build it in layers: a tile with a top-left sheen and a light rim, a raised frosted foreground (white with a bright top edge and a soft coloured shadow), and at most one detailed element (e.g. a lens with rim, glass, coating tint, reflection and a highlight). Avoid the system blue if the brand needs its own identity; a richer sky-to-sapphire gradient reads as "blue" without looking stock. Check it at 64 px. For the shipping app, rebuild the same layers in Icon Composer so the system can render light, dark and tinted variants.

## Motion that feels native

Use Motion (`motion` package): text then product on load, sections rising 20–30px once in view, springs on press (scale .94 → 1), a circular view-transition reveal from the theme toggle, cross-document view transitions between languages. Give every animation explicit `y`/`scale` values — Motion interpolates a `"none"` transform keyframe to `scale(0)`. Respect `prefers-reduced-motion`, and add a timeout that finishes any animation still hiding on-screen content (background tabs pause the animation clock).
