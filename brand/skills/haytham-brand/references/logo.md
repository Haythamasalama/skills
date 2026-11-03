# Signature, favicon and app icon

The logo is Haytham's handwritten signature: personal, a little imperfect on purpose. Written once, used everywhere.
Checked 2026-10-27 against the brand kit. All files are in [`../assets/`](../assets/).

## Files

| File | Use |
|---|---|
| `haytham-signature-white.svg` | on dark backgrounds, 120 px wide and up |
| `haytham-signature-white-small.svg` | on dark, under 120 px (heavier stroke, 3.2 instead of 2) |
| `haytham-signature-black.svg` | on light backgrounds, 120 px and up |
| `haytham-signature-black-small.svg` | on light, under 120 px |
| `haytham-signature-gradient.svg` | artwork only: covers, thumbnails, posters, title slides |
| `haytham-signature-gradient-small.svg` | the same, under 120 px |
| `haytham-favicon.svg` | browser tab icon, 32 px and up |
| `haytham-favicon-16.svg` | 16 px tab icon: the big "H" stroke only |
| `haytham-app-icon.svg` | home screens, avatars on video platforms, 192 px source |
| `favicon.ico` | 16 and 32 px fallback for old browsers |
| `apple-touch-icon.png` | 180 px home-screen icon for iOS |
| `haytham-brand-tokens.css` | every hex, gradient and font name as CSS variables |

- All signature files share `viewBox="-2 -2 156 79"`, an aspect ratio of about 1.97 : 1. Set width and height in
  that ratio (for example 220 × 112, 120 × 61, 56 × 28).
- The strokes are `stroke-linecap="round"` and `stroke-linejoin="round"`, no fill.
- The public brand kit lives at `haythamasalama.me/brand-kit/` with the same file names, plus a 256 px portrait.

## Colour of the signature

- **White on dark, black on light.** That is the whole rule for any interface.
- It keeps that one colour on hover and focus too.
- The gradient file (Iris 500 → Azure 500) is for artwork, where the signature is a picture, not a control.
  On a site header, a nav or a button it stays one colour.
- Never any other colour, never a tint of the background, never semi-transparent below about 90% opacity.

## Size and space

- **Minimum:** 56 px wide on screen, 18 mm in print. Below 120 px use a `-small` file.
- **Clear space:** a quarter of the signature's width on every side, empty of text, edges and other marks.
- **Background:** a calm, solid area: Ink, `raised` `#0F0F11`, `surface`, or Paper. On a photo, only where the photo
  is flat and dark (or light) behind it.
- In a social card the signature sits at the top end corner, about 30% of the card width, at 90% opacity.

## Don't

- Stretch or squash it.
- Recolour it, or fill it with a pattern or a photo.
- Add glows, drop shadows, outlines or 3D effects.
- Place it on a busy background (stripes, patterns, a detailed photo).
- Retype the name in a script font as a stand-in.
- Redraw, trace or "clean up" the strokes.
- Rotate it or set it on a curve.

## Using it in a page

Two images, one per theme:

```html
<img src="/haytham-signature-white.svg" alt="Haytham's handwritten signature" width="220" height="112" class="sig-dark">
<img src="/haytham-signature-black.svg" alt="Haytham's handwritten signature" width="220" height="112" class="sig-light">
```

```css
.sig-light { display: none; }
.light .sig-dark { display: none; }
.light .sig-light { display: block; }
```

With Tailwind and a `.light` class variant: `class="light:hidden"` and `class="hidden light:block"`.
With Nuxt UI's `.dark` class: `class="hidden dark:block"` on the white file and `class="dark:hidden"` on the black one.

Inline, following the text colour (still one colour, so still on brand): paste the `<path>` elements from the
white file into an inline `<svg viewBox="-2 -2 156 79">` and set `stroke="currentColor"` on each path, then give
the element `color: var(--fg)`.

- `alt="Haytham's handwritten signature"` when it stands alone. `alt=""` when the name is written next to it.
- `fetchpriority="high"` when it is the hero image.

## The drawing animation

On a hero or home screen the signature can draw itself, stroke by stroke.

```css
.signature path {
  stroke: var(--fg);
  stroke-dasharray: var(--len);
  stroke-dashoffset: var(--len);
  animation: draw var(--dur, 0.6s) cubic-bezier(0.55, 0, 0.35, 1) var(--delay, 0s) forwards;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .signature path {
    animation: none;
    stroke-dashoffset: 0 !important;
  }
}
```

- Set `--len` per path from `path.getTotalLength()`, and stagger `--delay` so the strokes follow the order the hand
  wrote them (the order of the paths in the file).
- Draw it once per visit. Never loop it.

## Favicon and app icon

- The same signature, white, on an Ink tile (`#0B0B0C`) with a 1.5 px `#26262B` inner border.
- 64 px canvas, corner radius 14 (about 22%). The app icon is a 192 px canvas with radius 44 (about 23%).
- Below 32 px only the big "H" stroke survives, so the 16 px favicon keeps just that stroke.
- The app icon is the same mark, larger, with no colour at all.

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#0B0B0C">
```

Copy `haytham-favicon.svg` to `public/favicon.svg`. For a web app manifest, export PNGs from
`haytham-app-icon.svg` at 192 and 512 px.

## Other marks next to the signature

- Company logos, tools and technologies appear in one soft colour (`mark`) on a `surface` tile with an `edge`
  border, in both themes and on hover.
- GitHub avatars and photos of logos are shown in greyscale (`filter: grayscale(1)`).
- No full-colour logos beside the signature, and no framework icon chips on project cards.
