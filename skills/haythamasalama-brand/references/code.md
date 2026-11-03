# The brand in code

**Read when:** you set up a new site or app in his brand: Tailwind CSS 4, Nuxt, Nuxt UI, or a plain HTML page.
**Owns:** how the tokens file plugs into each stack, the Tailwind theme mapping, dark mode, long-form text styles,
the Nuxt UI mapping and the plain HTML starter.

His site runs Nuxt 4, Tailwind CSS 4 (4.3) and `@nuxtjs/color-mode`, dark by default (checked 2026-11-03). Every
value comes from [`../assets/haythamasalama-brand-tokens.css`](../assets/haythamasalama-brand-tokens.css); this file
only wires it in. Component templates are in [components.md](components.md).

## TL;DR

- Copy the tokens file into the project and import it right after Tailwind. It holds the values, the light and dark
  tokens, the base styles, the utilities and the animations.
- Map the tokens into Tailwind with one `@theme static inline` block, then write `bg-bg`, `text-fg`,
  `border-line`, `text-muted`; never raw hex in themed UI.
- Dark is the default; the light theme is `class="light"` on `<html>`.
- Hover stays neutral: `link-muted`, `hover:text-fg`, `hover:bg-surface`. Never `hover:text-primary`.

## What the tokens file gives you

| Kind | Names |
|---|---|
| Raw values | `--ink`, `--paper`, `--iris-50` … `--iris-950`, `--azure-50` … `--azure-950`, `--font-sans`, `--font-mono`, `--font-serif`, `--ease-out-soft` |
| Theme tokens | `--bg`, `--surface`, `--raised`, `--line`, `--edge`, `--chip`, `--fg`, `--soft`, `--muted`, `--faint`, `--mark`, `--underline`, `--accent`, `--accent-2`, `--gradient`, `--gradient-signature` |
| Base | page colours and font, link transitions, selection colour, `main p` at 70ch, the focus ring |
| Utilities | `.link`, `.link-underline`, `.link-muted`, `.eyebrow`, `.text-gradient`, `.border-gradient`, `.avatar-mono`, `.animate-rise`, `.animate-live` |
| Components | `.signature path` (drawing), `.go .arrow` (nudging arrow), `.menu-item` (mobile menu stagger) |

Its rules sit in the `base`, `components` and `utilities` cascade layers, so Tailwind utilities and page styles
override them in the expected order.

## Tailwind CSS 4

`app/assets/css/main.css` (Nuxt) or `src/style.css` (Vite), with the tokens file next to it:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@import "@fontsource-variable/geist";
@import "@fontsource-variable/geist-mono";
@import "@fontsource/instrument-serif/latin-400-italic.css";
@import "./haythamasalama-brand-tokens.css";

@custom-variant dark (&:where(.dark, .dark *));
@custom-variant light (&:where(.light, .light *));

@theme static inline {
  --color-ink: var(--ink);
  --color-paper: var(--paper);

  --color-iris-50: var(--iris-50);   --color-iris-100: var(--iris-100); --color-iris-200: var(--iris-200);
  --color-iris-300: var(--iris-300); --color-iris-400: var(--iris-400); --color-iris-500: var(--iris-500);
  --color-iris-600: var(--iris-600); --color-iris-700: var(--iris-700); --color-iris-800: var(--iris-800);
  --color-iris-900: var(--iris-900); --color-iris-950: var(--iris-950);

  --color-azure-50: var(--azure-50);   --color-azure-100: var(--azure-100); --color-azure-200: var(--azure-200);
  --color-azure-300: var(--azure-300); --color-azure-400: var(--azure-400); --color-azure-500: var(--azure-500);
  --color-azure-600: var(--azure-600); --color-azure-700: var(--azure-700); --color-azure-800: var(--azure-800);
  --color-azure-900: var(--azure-900); --color-azure-950: var(--azure-950);

  --color-bg: var(--bg);       --color-surface: var(--surface); --color-raised: var(--raised);
  --color-line: var(--line);   --color-edge: var(--edge);       --color-chip: var(--chip);
  --color-fg: var(--fg);       --color-soft: var(--soft);       --color-muted: var(--muted);
  --color-faint: var(--faint); --color-mark: var(--mark);
  --color-accent: var(--accent); --color-accent-2: var(--accent-2);

  --default-transition-duration: 200ms;
  --default-transition-timing-function: var(--ease-out-soft);
}
```

- `inline` makes `bg-bg` resolve to `var(--bg)`, so it flips with `.light`. `static` always emits the
  `--color-*` variables. **Why:** Nuxt UI and scripts read them at runtime, and Tailwind would otherwise emit only
  the ones a class uses.
- The fonts need no `@theme` entry: the tokens file's `--font-sans`, `--font-mono` and `--font-serif` override
  Tailwind's defaults, so `font-sans`, `font-mono` and `font-serif` already use Geist and Instrument Serif.
- Classes then read like the site: `bg-raised`, `border-line`, `text-soft`, `text-iris-400 light:text-iris-600`,
  `bg-linear-135 from-iris-500 to-azure-500`, `outline-iris-400`.

### Dark mode

Nuxt:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode'],
  css: ['~/assets/css/main.css'],
  colorMode: { preference: 'dark', fallback: 'dark', classSuffix: '', storageKey: 'theme' },
  app: { head: { meta: [{ name: 'theme-color', content: '#0B0B0C' }] } },
})
```

`classSuffix: ''` gives `.dark` and `.light` on `<html>`, which is what the tokens file and the variants expect.
Without Nuxt, write `<html class="dark">` and swap the class from a toggle, saving the choice under `theme`.
A dark-first site ignores `prefers-color-scheme` on purpose: dark is the brand, light is a choice.

### Long-form text

Articles use Tailwind Typography with this utility, as `class="prose prose-site max-w-none"`:

```css
@utility prose-site {
  --tw-prose-body: var(--soft);
  --tw-prose-headings: var(--fg);
  --tw-prose-lead: var(--soft);
  --tw-prose-links: var(--fg);
  --tw-prose-bold: var(--fg);
  --tw-prose-counters: var(--faint);
  --tw-prose-bullets: var(--chip);
  --tw-prose-hr: var(--line);
  --tw-prose-quotes: var(--soft);
  --tw-prose-quote-borders: var(--accent-2);
  --tw-prose-captions: var(--faint);
  --tw-prose-code: var(--fg);
  --tw-prose-pre-code: var(--fg);
  --tw-prose-pre-bg: var(--raised);
  --tw-prose-th-borders: var(--line);
  --tw-prose-td-borders: var(--line);

  & :where(h2, h3, h4) a { color: inherit; font-weight: inherit; text-decoration: none; }
  & :where(h2, h3, h4) a:hover { text-decoration: underline; text-decoration-color: var(--underline); }
  & :where(a):not(:where(h2, h3, h4) a) { text-decoration-color: var(--underline); text-decoration-thickness: 1px; }
  & :where(a):not(:where(h2, h3, h4) a):hover { text-decoration-color: var(--fg); }
}
```

Code blocks take the palette in [colors.md](colors.md#code-highlighting) as two Shiki themes
(`highlight.theme: { default: dark, light: light }` in Nuxt Content).

## Nuxt UI 4

His site does not use Nuxt UI, so this is a starting point, not a copy of the site: check contrast and selected
states on the first page built with it. Keep the Tailwind block above and add:

```css
@import "tailwindcss";
@import "@nuxt/ui";
/* fonts, tokens file, variants and @theme block as above */

:root,
.light,
.dark {
  --ui-primary: var(--accent-2);
  --ui-bg: var(--bg);
  --ui-bg-muted: var(--raised);
  --ui-bg-elevated: var(--surface);
  --ui-bg-accented: var(--chip);
  --ui-bg-inverted: var(--fg);
  --ui-border: var(--line);
  --ui-border-muted: var(--line);
  --ui-border-accented: var(--chip);
  --ui-border-inverted: var(--fg);
  --ui-text-highlighted: var(--fg);
  --ui-text: var(--soft);
  --ui-text-toned: var(--soft);
  --ui-text-muted: var(--muted);
  --ui-text-dimmed: var(--faint);
  --ui-text-inverted: var(--bg);
  --ui-radius: 0.5rem;
}
```

```ts
// app/app.config.ts
export default defineAppConfig({
  ui: {
    colors: { primary: 'iris', secondary: 'azure', neutral: 'zinc' },
    card: { slots: { root: 'shadow-none' } },
    button: { defaultVariants: { color: 'neutral' } },
    tabs: { defaultVariants: { color: 'neutral' } },
    navigationMenu: { defaultVariants: { color: 'neutral' } },
  },
})
```

- One block serves both themes because every `--ui-*` points at a token that already flips with `.light`.
- Neutral is the default colour. **Why:** the brand's main button is black on light and white on dark; `primary` is
  for a badge, a progress bar or one highlighted action, inside the 5% budget.
- Nuxt UI turns on `@nuxtjs/color-mode` itself; set `colorMode: { preference: 'dark', fallback: 'dark' }` in
  `nuxt.config.ts` as above.
- With `@nuxt/fonts` instead of Fontsource, list Geist (400, 500, 600), Geist Mono (400, 500) and Instrument Serif
  (400 italic) under `fonts.families`.

## Plain HTML

For a one-off page, a talk page or an image rendered from HTML. Copy the tokens file and the signature files
beside it.

```html
<!doctype html>
<html lang="en" class="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0B0B0C">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=swap">
  <link rel="stylesheet" href="haythamasalama-brand-tokens.css">
  <style>
    .page { max-width: 880px; margin: 0 auto; padding: 64px 24px; }
    h1 { margin: 16px 0 0; font-size: 44px; line-height: 1.08; font-weight: 600; letter-spacing: -0.03em; }
    .lead { font-size: 17px; line-height: 1.7; color: var(--soft); }
    .word { font-family: var(--font-serif); font-style: italic; font-size: 22px; padding-right: 2px; }
    .card { border: 1px solid var(--line); border-radius: 16px; padding: 22px; }
  </style>
</head>
<body>
  <main class="page">
    <p class="eyebrow">Talk · 2026</p>
    <h1>How I ship software</h1>
    <p class="lead">Haytham A. Salama, <span class="word text-gradient">software engineer</span>.</p>
    <img src="haythamasalama-signature-white.svg" alt="Haytham's handwritten signature" width="120" height="61">
  </main>
</body>
</html>
```

For the light theme, swap `class="dark"` for `class="light"` and the white signature for the black one.
