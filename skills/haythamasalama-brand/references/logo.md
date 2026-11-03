# Signature, favicon and app icon

**Read when:** you place the signature, draw it on screen, set a favicon or app icon, or put other logos near it.
**Owns:** the signature files and their rules (colour, size, clear space, misuse), the drawing animation and its
stroke data, the favicon and app icon, and how other logos and avatars sit beside the signature.

The logo is Haytham's handwritten signature: personal, a little imperfect on purpose, written once and used
everywhere. Checked 2026-11-03 against the site and its brand kit. All files are in [`../assets/`](../assets/).

## TL;DR

- White on dark, black on light, one colour in every interface, hover and focus included.
- The gradient file is for artwork (covers, thumbnails, posters, title slides), never for a header or a control.
- 56 px minimum; below 120 px use a `-small` file; keep a quarter of its width empty on every side.
- Never retype, redraw, stretch, recolour, rotate, or add glows or shadows.
- On a page, the header signature draws itself from the stroke data; reduced motion shows it finished.

## Files

| File | Use |
|---|---|
| `haythamasalama-signature-white.svg` | on dark, 120 px wide and up (stroke `#EDEDEF`, width 2) |
| `haythamasalama-signature-white-small.svg` | on dark, under 120 px (stroke width 3.2) |
| `haythamasalama-signature-black.svg` | on light, 120 px and up (stroke `#0B0B0C`) |
| `haythamasalama-signature-black-small.svg` | on light, under 120 px |
| `haythamasalama-signature-gradient.svg` | artwork only |
| `haythamasalama-signature-gradient-small.svg` | artwork only, under 120 px |
| `haythamasalama-signature-strokes.json` | the 12 strokes in writing order, with length, duration and delay for the animation |
| `haythamasalama-favicon.svg` | browser tab icon, 32 px and up |
| `haythamasalama-favicon-16.svg` | 16 px tab icon: the big "H" stroke only |
| `haythamasalama-app-icon.svg` | home screens and video-platform avatars, 192 px source |
| `favicon.ico` | 16 and 32 px fallback for old browsers |
| `apple-touch-icon.png` | 180 px home-screen icon for iOS |

- Every signature file uses `viewBox="-2 -2 156 79"`, about 1.97 : 1. Keep that ratio: 220 × 112, 120 × 61, 80 × 41,
  56 × 28. In code: `height = round(width × 79 / 156)`.
- Strokes are `stroke-linecap="round"`, `stroke-linejoin="round"`, `stroke-miterlimit="2.6131"`, no fill.
- The gradient file runs Iris 500 → `#6C8CF9` → Azure 500 along the diagonal (`x1=0 y1=0 x2=152 y2=75`).
- The public kit at `haythamasalama.me/brand-kit/` has the same SVGs under the shorter `haytham-` prefix, plus a
  256 px portrait.

## Colour

- **White on dark, black on light.** That is the whole rule for any interface.
- It keeps that one colour on hover and focus. The site's header link does not change the signature on hover.
- The gradient version is a picture, not a control: use it where the signature is artwork.
- Never another colour, never a tint of the background, never below 90% opacity.

## Size and clear space

- **Minimum:** 56 px wide on screen, 18 mm in print. The site header uses 72 px on phones and 80 px from 768 px.
- **Clear space:** a quarter of the signature's width on every side, empty of text, edges and other marks.
- **Background:** a calm, solid area: Ink, `raised` `#0F0F11`, `surface` or Paper. On a photo, only where the
  photo is flat and dark (or light) behind it.

## Don't

- Stretch or squash it.
- Recolour it, or fill it with a pattern or a photo.
- Add glows, drop shadows, outlines or 3D effects.
- Place it on a busy background (stripes, patterns, a detailed photo).
- Retype the name in a script font as a stand-in.
- Redraw, trace or "clean up" the strokes.
- Rotate it or set it on a curve.

## As an image

One file per theme:

```html
<img src="/haythamasalama-signature-white.svg" alt="Haytham's handwritten signature" width="220" height="112" class="sig-dark">
<img src="/haythamasalama-signature-black.svg" alt="Haytham's handwritten signature" width="220" height="112" class="sig-light">
```

```css
.sig-light { display: none; }
.light .sig-dark { display: none; }
.light .sig-light { display: block; }
```

With Tailwind and the `light` variant: `class="light:hidden"` on the white file, `class="hidden light:block"` on the
black one.

- `alt="Haytham's handwritten signature"` when it stands alone; `alt=""` when the name is written next to it.
- `fetchpriority="high"` when it is the hero image.

## Drawn on screen

The site's header renders the signature inline from `haythamasalama-signature-strokes.json` and lets it draw
itself, stroke by stroke, in the order the hand wrote it. It draws again on every page change (the component is
keyed by the route). The Vue component is in [components.md](components.md); the CSS is in the tokens file.

- Inline, each path takes `stroke: var(--fg)` from `.signature path`, so it follows the theme and stays one colour.
- Use stroke width 3.2 at header sizes (72–80 px), 2 from 120 px up.
- Each path starts with `stroke-dasharray` and `stroke-dashoffset` set to its `length`, then animates the offset
  to 0 with its own `duration` and `delay`. The curve is `cubic-bezier(0.55, 0, 0.35, 1)`, fill mode `forwards`.
  The whole signature takes about 2.9 s.
- The path order inside the SVG files is not the writing order; always take the order from the JSON.
- Under `prefers-reduced-motion: reduce` the strokes appear finished, with no animation.
- The link around it carries the name: `aria-label="Haytham A. Salama, home"`, and the SVG is `aria-hidden`.

Without a framework:

```html
<svg class="signature" width="80" height="41" viewBox="-2 -2 156 79" fill="none" stroke-width="3.2"
     stroke-miterlimit="2.6131" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"></svg>
<script type="module">
  const { strokes } = await fetch('/haythamasalama-signature-strokes.json').then(r => r.json());
  const svg = document.querySelector('svg.signature');
  for (const s of strokes) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', s.d);
    Object.assign(path.style, {
      strokeDasharray: s.length, strokeDashoffset: s.length,
      animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s`,
    });
    svg.append(path);
  }
</script>
```

## Favicon and app icon

- The same signature, white, on an Ink tile (`#0B0B0C`) with an inner border in `#26262B`.
- Favicon: 64 px canvas, radius 14 (about 22%), 1.5 px border. App icon: 192 px canvas, radius 44 (about 23%),
  2 px border.
- Below 32 px only the big "H" stroke survives, so the 16 px favicon keeps just that stroke.
- No colour at any size.

```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#0B0B0C">
```

Copy `haythamasalama-favicon.svg` to `public/favicon.svg`, and `favicon.ico` and `apple-touch-icon.png` as they
are. For a web app manifest, export PNGs from `haythamasalama-app-icon.svg` at 192 and 512 px.

## Other marks near the signature

- Companies, tools and technologies appear in one colour (`mark`) on a `surface` tile with an `edge` border, in
  both themes and on hover. Tile radius is a quarter of its size; the glyph is 18–22 px.
- Photos of logos (GitHub avatars) use `.avatar-mono`: greyscale with a 1 px `edge` ring, so a dark logo keeps its
  edge on a dark page.
- No full-colour logos beside the signature, and no framework icon chips on project cards.
