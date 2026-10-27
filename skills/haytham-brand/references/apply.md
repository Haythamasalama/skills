# Applying the brand

The brand in code: Tailwind CSS 4, Nuxt UI 4, plain HTML and CSS, and fixed layouts for social cards,
thumbnails and slides. Checked 2026-10-27. Colour values are explained in [colors.md](colors.md).

## Tailwind CSS 4

This is the theme of his own site (Nuxt 4 + Tailwind 4 + `@nuxtjs/color-mode`, dark by default).

```css
@import "tailwindcss";

/* Self-hosted fonts (npm: @fontsource-variable/geist, @fontsource-variable/geist-mono, @fontsource/instrument-serif) */
@import "@fontsource-variable/geist";
@import "@fontsource-variable/geist-mono";
@import "@fontsource/instrument-serif/latin-400-italic.css";

@custom-variant dark (&:where(.dark, .dark *));
@custom-variant light (&:where(.light, .light *));

@theme {
  --font-sans: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono Variable", ui-monospace, monospace;
  --font-serif: "Instrument Serif", Georgia, serif;

  --color-ink: #0b0b0c;
  --color-paper: #ffffff;

  --color-iris-50: #f5f6fe;  --color-iris-100: #e9ebfe; --color-iris-200: #d4d7fe; --color-iris-300: #babefe;
  --color-iris-400: #9d9ffe; --color-iris-500: #7f7cf2; --color-iris-600: #6762d3; --color-iris-700: #534daf;
  --color-iris-800: #3f3b87; --color-iris-900: #2c2a62; --color-iris-950: #1d1b45;

  --color-azure-50: #f2f7fe;  --color-azure-100: #e2eeff; --color-azure-200: #c5ddfe; --color-azure-300: #9ec7fe;
  --color-azure-400: #70adff; --color-azure-500: #4f9bff; --color-azure-600: #2873d1; --color-azure-700: #195cae;
  --color-azure-800: #134686; --color-azure-900: #0d3261; --color-azure-950: #052144;

  --default-transition-duration: 200ms;
  --default-transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
}

/* Semantic tokens: use these classes in pages (bg-bg, text-fg, border-line, text-muted, ...) */
@theme inline {
  --color-bg: var(--bg);         --color-surface: var(--surface); --color-raised: var(--raised);
  --color-line: var(--line);     --color-edge: var(--edge);       --color-chip: var(--chip);
  --color-fg: var(--fg);         --color-soft: var(--soft);       --color-muted: var(--muted);
  --color-faint: var(--faint);   --color-mark: var(--mark);
  --color-accent: var(--accent); --color-accent-2: var(--accent-2);
}

:root,
.dark {
  --bg: #0b0b0c; --surface: #131316; --raised: #0f0f11; --line: #1f1f23; --edge: #232328; --chip: #2a2a30;
  --fg: #ededef; --soft: #c4c4cc; --muted: #a1a1aa; --faint: #85858f; --mark: #d4d4d8; --underline: #3f3f46;
  --accent: var(--color-azure-500);
  --accent-2: var(--color-iris-500);
  --gradient: linear-gradient(90deg, var(--color-iris-500), var(--color-azure-500));
  color-scheme: dark;
}

.light {
  --bg: #ffffff; --surface: #f4f4f5; --raised: #fafafa; --line: #e4e4e7; --edge: #e4e4e7; --chip: #d4d4d8;
  --fg: #0b0b0c; --soft: #3f3f46; --muted: #52525b; --faint: #6b6b74; --mark: #27272a; --underline: #d4d4d8;
  --accent: var(--color-azure-600);
  --accent-2: var(--color-iris-600);
  --gradient: linear-gradient(90deg, var(--color-iris-600), var(--color-azure-600));
  color-scheme: light;
}

@layer base {
  html { background-color: var(--bg); color: var(--fg); -webkit-font-smoothing: antialiased; }
  body { @apply bg-bg font-sans text-fg; }
  ::selection { background: rgb(127 124 242 / 0.35); }
  :where(main p) { max-width: 70ch; }
  :where(a, button, summary):focus-visible { outline: 2px solid var(--accent-2); outline-offset: 2px; border-radius: 4px; }
}

@utility link { color: var(--fg); &:hover { text-decoration: underline; text-decoration-color: var(--underline); text-decoration-thickness: 1px; text-underline-offset: 4px; } }
@utility link-muted { color: var(--muted); &:hover { color: var(--fg); } }
@utility text-gradient { color: transparent; background-image: var(--gradient); background-clip: text; }
@utility border-gradient { border: 1px solid transparent; background: linear-gradient(var(--bg), var(--bg)) padding-box, var(--gradient) border-box; }
@utility eyebrow { font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--faint); }
@utility avatar-mono { filter: grayscale(1); }
```

- Dark by default: `colorMode: { preference: 'dark', fallback: 'dark', classSuffix: '', storageKey: 'theme' }` with
  `@nuxtjs/color-mode`, or `<html class="dark">` in plain sites.
- Tailwind 4 only emits `@theme` variables that a utility uses. A variable read from JavaScript or SVG goes outside
  `@theme` (in `:root`).
- Pages use the semantic classes (`bg-bg`, `bg-raised`, `border-line`, `text-fg`, `text-soft`, `text-muted`,
  `text-faint`), not raw hex. Raw hex is only for specimen tiles that must look the same in both themes.

### Building blocks

```html
<!-- eyebrow + badge -->
<p class="flex items-center gap-3 eyebrow">
  <span>Brand guidelines</span>
  <span class="rounded-md border-gradient px-[7px] py-0.5 tracking-[0.1em]"><span class="text-gradient">v1.0</span></span>
</p>

<!-- headline with a quiet second line -->
<h1 class="mt-4 text-[44px] leading-[1.08] font-semibold tracking-[-0.03em]">
  Signed by hand.<br><span class="text-faint">Built with care.</span>
</h1>

<!-- the one gradient word of the page -->
<p class="text-[17px] leading-[1.7] text-soft">
  Haytham A. Salama, <span class="text-gradient pr-0.5 font-serif text-[22px] italic">software engineer</span>.
</p>

<!-- card -->
<li class="flex flex-col gap-2.5 rounded-2xl border border-line p-[22px]">
  <span class="font-mono text-xs text-iris-400 light:text-iris-600">01</span>
  <h3 class="text-[17px] font-semibold tracking-[-0.01em]">Ink first</h3>
  <p class="text-sm leading-[1.6] text-muted">Black, white and generous space carry everything.</p>
</li>

<!-- live dot -->
<span class="inline-flex items-center gap-2 text-[13px] text-fg">
  <span class="size-2 rounded-full bg-linear-135 from-iris-500 to-azure-500 animate-live" aria-hidden="true"></span>
  Live now
</span>
```

`animate-live` is a 2.2 s `box-shadow` pulse from `rgb(127 124 242 / 0.6)` to transparent, 9 px wide. Turn it
off under `prefers-reduced-motion`.

## Nuxt UI 4

His site does not use Nuxt UI, so this mapping is a suggested starting point; check contrast and selected states on
the first page built with it.

```css
/* app/assets/css/main.css */
@import "tailwindcss";
@import "@nuxt/ui";

@theme static {
  --font-sans: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;
  --font-serif: "Instrument Serif", Georgia, serif;
  /* --color-iris-50 ... --color-iris-950 and --color-azure-50 ... --color-azure-950 as above */
}

:root {
  --ui-primary: var(--ui-color-primary-600);
  --ui-bg: #ffffff;  --ui-bg-muted: #fafafa;  --ui-bg-elevated: #f4f4f5;  --ui-bg-accented: #e4e4e7;
  --ui-border: #e4e4e7;  --ui-border-accented: #d4d4d8;
  --ui-text-highlighted: #0b0b0c;  --ui-text: #3f3f46;  --ui-text-toned: #3f3f46;
  --ui-text-muted: #52525b;  --ui-text-dimmed: #6b6b74;
  --ui-radius: 0.5rem;
}

.dark {
  --ui-primary: var(--ui-color-primary-400);
  --ui-bg: #0b0b0c;  --ui-bg-muted: #0f0f11;  --ui-bg-elevated: #131316;  --ui-bg-accented: #2a2a30;
  --ui-border: #1f1f23;  --ui-border-accented: #2a2a30;
  --ui-text-highlighted: #ededef;  --ui-text: #c4c4cc;  --ui-text-toned: #c4c4cc;
  --ui-text-muted: #a1a1aa;  --ui-text-dimmed: #85858f;
}
```

```ts
// app/app.config.ts
export default defineAppConfig({
  ui: {
    colors: { primary: 'iris', secondary: 'azure', neutral: 'zinc' },
    card: { slots: { root: 'shadow-none' } },
    // Ink first: neutral is the default; primary is for the rare highlight.
    button: { defaultVariants: { color: 'neutral' } },
    tabs: { defaultVariants: { color: 'neutral' } },
    navigationMenu: { defaultVariants: { color: 'neutral' } },
  },
})
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  colorMode: { preference: 'dark', fallback: 'dark' },
  fonts: {
    families: [
      { name: 'Geist', provider: 'google', weights: [400, 500, 600] },
      { name: 'Geist Mono', provider: 'google', weights: [400, 500] },
      { name: 'Instrument Serif', provider: 'google', weights: [400], styles: ['italic'] },
    ],
  },
})
```

- Primary at Iris 600 on light and Iris 400 on dark matches the brand focus ring.
- A solid neutral button is black on light and white on dark: that is the brand's main button.
- Use `color="primary"` only for a badge, a progress bar or one highlighted action, inside the 5% budget.
- Hover states stay neutral; don't add `hover:text-primary`.

## Plain HTML and CSS

For a one-off page, an email-safe banner or a slide rendered to an image.

```html
<!doctype html>
<html lang="en" class="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=swap">
  <link rel="stylesheet" href="haytham-brand-tokens.css">
  <style>
    body { margin: 0; background: var(--ink); color: var(--text); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
    main { max-width: 880px; margin: 0 auto; padding: 64px 24px; }
    h1 { font-size: 44px; line-height: 1.08; font-weight: 600; letter-spacing: -0.03em; margin: 16px 0 0; }
    p { max-width: 70ch; font-size: 15px; line-height: 1.7; color: var(--muted); }
    .eyebrow { font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--faint); }
    .word { font-family: var(--font-accent); font-style: italic; color: transparent; background: var(--gradient-signature); background-clip: text; -webkit-background-clip: text; }
    .card { border: 1px solid var(--line); border-radius: 16px; padding: 22px; }
    a { color: var(--text); text-underline-offset: 4px; text-decoration-color: #3F3F46; }
    :focus-visible { outline: 2px solid var(--iris-400); outline-offset: 2px; border-radius: 4px; }
  </style>
</head>
<body>
  <main>
    <p class="eyebrow">Talk · 2026</p>
    <h1>How I ship software <span class="word">with care</span></h1>
    <p>One paragraph, plain words, under 70 characters per line.</p>
    <img src="haytham-signature-white.svg" alt="Haytham's handwritten signature" width="120" height="61">
  </main>
</body>
</html>
```

- `assets/haytham-brand-tokens.css` names the fonts "Geist" and "Geist Mono", which match Google Fonts. With
  Fontsource variable packages the names are "Geist Variable" and "Geist Mono Variable".
- An Arabic page: `<html lang="ar" dir="rtl">`, logical properties (`margin-inline-start`, `padding-inline`), and an
  Arabic face beside Geist (Geist has no Arabic letters), for example IBM Plex Sans Arabic. Keep the name, handle and
  domain in Latin letters.

## Social card (1200 × 630)

All sizes are shares of the card width, so the layout scales.

- Background Ink `#0B0B0C`, 1 px `#1F1F23` border if shown on a page, 14 px radius in previews.
- A 2 px signature-gradient hairline across the top edge.
- Padding 7%.
- Top start: the round portrait at 14% of the width.
- Top end: the white signature at 30% of the width, 6% from the top, 5% from the side, 90% opacity.
- Bottom start, stacked with about 1% gaps:
  - the name, Geist 600, 5.67% of the width, line height 1.05, tracking `-0.02em`, `#EDEDEF`;
  - the title, 2.67%, `#A1A1AA`: "Senior software engineer · SaaS, AI, FinTech & Logistics";
  - the domain, Geist Mono, 2.33%, `#85858F`: `haythamasalama.me`.
- No other colour.

## Video thumbnail (16:9)

- Ink background, 6% padding, black and white only; colour only on the badge.
- Top row: a badge (Geist Mono, tracking `0.1em`, gradient 1 px border, a small gradient dot, text such as LIVE or
  NEW) at the start, and an episode label (`EP. 01`, Geist Mono, `#85858F`) at the end.
- Middle: the title, Geist 600, about 7.4% of the width, line height 1.05, tracking `-0.03em`, at most 80% wide.
- Bottom row: a small round portrait and "with Haytham" in `#A1A1AA` at the start; the white small signature at
  the end, about 12% of the width.

## Slides and covers

- Ink slides, white text, the same type scale as the site: titles Geist 600 with negative tracking, body 15–17 px
  equivalent at 1.6–1.7 line height, labels in Geist Mono uppercase.
- Title slide: name, title, one gradient word or the gradient signature, nothing else.
- One idea per slide. Diagrams follow the palette in [colors.md](colors.md#diagrams).
- Code on slides uses the brand code palette, on `#0F0F11`.
- Last slide: the white signature, the handle `@haythamasalama` and the domain, in Geist Mono.
- Covers and posters may use the gradient signature file; interfaces never do.
