# Setup

A new Nuxt 4 + Nuxt UI 4 project, the config that worked, and how to run two apps on one theme.
Checked 2026-10-27 against Nuxt 4.6, Nuxt UI 4.12 and Tailwind CSS 4.3.

## Install

```bash
bun add nuxt @nuxt/ui tailwindcss @iconify-json/lucide
bun add -d typescript vue-tsc @types/node
```

npm or pnpm work the same way. Nuxt UI pulls in `@nuxt/icon`, `@nuxt/fonts` and `@nuxtjs/color-mode`; do not add
them to `modules` again.

```json
{
  "type": "module",
  "engines": { "node": "^22.21.0 || ^24.11.0 || >=26.0.0" },
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "typecheck": "nuxt typecheck",
    "postinstall": "nuxt prepare"
  }
}
```

Pin Node in `.nvmrc` and read it in CI with `actions/setup-node`'s `node-version-file`.

## Folder layout (Nuxt 4)

```
app/
  app.vue  app.config.ts
  assets/css/main.css
  components/  composables/  pages/  plugins/  utils/  layouts/
server/
  api/        # /api/* handlers, one file per route and method: accounts.get.ts, accounts.post.ts
  routes/     # files served at the root: sitemap.xml.ts, robots.txt.ts
  middleware/ # runs in name order: 1.guard.ts, 2.auth.ts
  utils/      # auto-imported in server code only
shared/
  types/  utils/  # used by both app/ and server/
public/           # copied as is
```

- Everything in `app/components`, `app/composables` and `app/utils` is auto-imported in the app.
- `server/utils` is auto-imported in server code. Server code does **not** see `app/utils`.
- A new top-level folder under `server/` (for example `server/plugins/`) needs a dev server restart.

## nuxt.config.ts

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

  css: ['~/assets/css/main.css'],

  // Leave out for a public site. Set false for a local tool or a screen behind a login.
  ssr: false,

  app: {
    head: {
      htmlAttrs: { lang: 'ar', dir: 'rtl' },   // the default language, so the first paint is right
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      meta: [{ name: 'theme-color', content: '#317455' }],
    },
  },

  fonts: {
    families: [
      // Without 'arabic' in subsets, Arabic letters fall back to the system font.
      { name: 'IBM Plex Sans Arabic', provider: 'google', weights: [400, 500, 600, 700], subsets: ['arabic', 'latin'] },
      { name: 'IBM Plex Mono', provider: 'google', weights: [400, 500, 700], subsets: ['latin'] },
    ],
  },

  icon: {
    serverBundle: 'local',   // an app with a server; see static-seo.md for static hosting
  },

  runtimeConfig: {
    public: { version: '0.0.0', siteUrl: '' },
  },

  devtools: { enabled: false },

  compatibilityDate: '2026-10-01',
})
```

- Read the version from `package.json` with `readFileSync(new URL('./package.json', import.meta.url))` and put it
  in `runtimeConfig.public.version` to show it in the footer or settings.
- `devServer: { host: 'localhost', port: 3210 }` keeps a local tool off the network in dev.
- Public values go in `runtimeConfig.public`. Secrets stay in `runtimeConfig` (server only) and come from env vars
  named `NUXT_<KEY>`.

## app/assets/css/main.css

```css
@import "tailwindcss";
@import "@nuxt/ui";

@theme static {
  --font-sans: "IBM Plex Sans Arabic", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

  /* 11 shades of the brand palette; see theme.md */
  --color-brand-50: #f1f8f4;
  /* ... */
  --color-brand-950: #0f231b;
}

:root {
  --ui-primary: var(--ui-color-primary-600);
  --ui-radius: 0.375rem;
}

.dark {
  --ui-primary: var(--ui-color-primary-400);
}

html,
body {
  background-color: var(--ui-bg-muted);  /* only when the page background is bg-muted */
}
```

## app/app.config.ts

```ts
export default defineAppConfig({
  ui: {
    colors: { primary: 'brand', neutral: 'neutral' },
    card: { slots: { root: 'shadow-none' } },
  },
})
```

## app/app.vue

```vue
<script setup lang="ts">
import { ar, en } from '@nuxt/ui/locale'

const { lang, isRtl } = useLang()   // your own composable; see i18n-rtl.md

useHead({
  htmlAttrs: { lang, dir: () => (isRtl.value ? 'rtl' : 'ltr') },
})
</script>

<template>
  <UApp :locale="lang === 'ar' ? ar : en" :toaster="{ position: 'bottom-center' }">
    <NuxtPage />
  </UApp>
</template>
```

- A single-screen tool can skip `pages/` and switch components inside `app.vue` on a state value
  (`loading | setup | login | app`). Add `pages/` once there are URLs worth sharing.
- Boot errors: show a centred `UAlert color="error" variant="subtle"` instead of a blank page.

## SPA, prerender or server

| Choice | Use for | Config |
|---|---|---|
| SPA | local tools, admin screens behind a login, anything that only talks to its own API | `ssr: false` |
| Prerender everything | marketing sites, docs, a landing page | `nuxt generate`, `nitro.prerender.routes` |
| Hybrid | a site on a host that runs Nitro, with some pages from live data | `routeRules: { '/': { isr: 3600 }, '/blog/**': { prerender: true } }` |

With ISR, a page that depends on an outside API must still render when that API fails. Return a 503 so the host keeps
the last good copy instead of caching the failure.

## API calls from the page

- Wrap `$fetch` once in a composable (`useApi()` or inside a state composable) that adds headers, the current
  locale, and turns errors into a readable `Error`. Components call that, never `$fetch('/api/...')` directly.
- A custom header such as `X-Requested-With: <app-name>` that the server requires on `/api/*` blocks simple
  cross-site requests: another site cannot add it without a CORS preflight, and the server answers none.
- A 401 from the API signs the page out in one place.

## Two apps on one theme

A product dashboard at the repository root and its marketing site in `site/`, sharing the palette, fonts,
tokens, logo and screenshots.

```
package.json          # scripts for both apps
nuxt.config.ts        # the dashboard
app/assets/css/main.css
public/               # logo.svg, favicon.svg
docs/screenshots/
site/
  nuxt.config.ts
  app/assets/css/main.css
  app/  server/routes/
  tsconfig.json
```

`site/app/assets/css/main.css` imports the root theme, then adds only what the site needs:

```css
@import "../../../app/assets/css/main.css";

html {
  scroll-behavior: smooth;
  scroll-padding-top: 5rem;   /* room for a sticky header when jumping to #anchors */
}
```

`site/nuxt.config.ts` points at the root folders:

```ts
import { fileURLToPath } from 'node:url'

const fromRoot = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url))

export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  dir: { public: fromRoot('public') },
  nitro: {
    publicAssets: [{ dir: fromRoot('docs/screenshots'), baseURL: '/screenshots' }],
    prerender: { routes: ['/', '/ar/', '/sitemap.xml', '/robots.txt', '/llms.txt'] },
  },
  compatibilityDate: '2026-10-01',
})
```

- Copy `app/app.config.ts` into `site/app/app.config.ts`. It is not shared by the CSS import.
- Copy the `fonts` block too, or the site falls back to system fonts.
- Root scripts: `"site": "nuxt dev site --port 3214"`, `"site:generate": "nuxt generate site"`,
  `"site:typecheck": "nuxt typecheck site"`. One `node_modules` serves both.
- `site/tsconfig.json` references the generated `site/.nuxt/tsconfig.*.json` files the same way the root one does.
- A CI path filter for the site job includes `site/**`, `public/**`, the root `main.css` and `package.json`, so a
  theme change redeploys the site.

## Commands to verify

```bash
bun run typecheck && bun run build
bun run generate && npx serve .output/public   # for a static site
```

A git worktree nested inside the main checkout can resolve types from the parent's `node_modules` and report false
template errors. Check in a clean copy before chasing them.
