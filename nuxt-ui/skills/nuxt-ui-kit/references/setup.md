# Setup

**Read when:** you start a project, edit `nuxt.config.ts`, choose SPA or prerender, wire the page to its API,
run a second app on the same theme, or build a Docker image.
**Owns:** install and versions, scripts, `nuxt.config.ts` choices, rendering mode, the API call path (page
helper, server wrapper, guard), two apps sharing one theme, CI and the Docker build.

## TL;DR

- Install `nuxt @nuxt/ui tailwindcss @iconify-json/lucide`; keep `"postinstall": "nuxt prepare"`.
- `modules: ['@nuxt/ui']` and `css: ['~/assets/css/main.css']`. Nuxt UI registers `@nuxt/icon`, `@nuxt/fonts`
  and `@nuxtjs/color-mode` itself; don't list them again.
- `ssr: false` for a tool behind a login; prerender (`nuxt generate`) for a public site.
- Wrap the app in `<UApp>`: toasts, tooltips and `useOverlay()` need it.
- The page calls `/api` only through `useApi()`; every route runs inside `apiHandler()`.

## Install

Versions, checked 2026-11-03 on npm: `nuxt` 4.6.4, `@nuxt/ui` 4.12.0, `tailwindcss` 4.3.4,
`@iconify-json/lucide` 1.2.151, `vue-tsc` 3.3.14. Nuxt UI 4 needs Nuxt 4. Read the project's `package.json`
before trusting these.

```bash
bun add nuxt @nuxt/ui tailwindcss @iconify-json/lucide
bun add -d typescript vue-tsc @types/node
```

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
    "test": "bun test tests",
    "postinstall": "nuxt prepare"
  }
}
```

Pin Node in `.nvmrc` (`24`) and read it in CI with `actions/setup-node`'s `node-version-file`.
`@iconify-json/lucide` keeps icons local, so nothing is fetched from the Iconify API at runtime.

## nuxt.config.ts

Start from [`../assets/nuxt.config.ts`](../assets/nuxt.config.ts). What each choice is for:

- `ssr: false`: see the table below.
- `devServer.host: '127.0.0.1'` keeps a local tool off the network in dev.
- `app.head.htmlAttrs` holds the default `lang` and `dir` so the first paint is right before `app.vue` runs.
- `theme-color` is the primary 600 shade (mobile browser chrome).
- `fonts`: [theme.md](theme.md#fonts). `icon.serverBundle: 'local'` serves icons from the app's server; a
  static site uses a client bundle instead ([static-seo.md](static-seo.md#icons-without-a-server)).
- `runtimeConfig.public.version` read from `package.json`, shown in `AppFooter`. Secrets go in `runtimeConfig`
  (server only) and come from `NUXT_<KEY>` env vars.
- `routeRules` headers stop other sites from framing the app and stop MIME sniffing.
- `devtools: false` keeps the floating devtools button out of screenshots.

## SPA, prerender or hybrid

| Mode | For | Config |
|---|---|---|
| SPA | a tool or admin screen behind a login, talking only to its own API | `ssr: false` |
| Prerender | a marketing site, docs, a landing page | `nuxt generate`, `nitro.prerender.routes` |
| Hybrid | a site on a Nitro host with some live pages | `routeRules: { '/': { isr: 3600 }, '/docs/**': { prerender: true } }` |

- SPA keeps the API guard simple: every `/api` request comes from the browser with the app's own header.
- With ISR, a page that depends on an outside API returns 503 when it fails, so the host keeps the last good copy.
- A single-screen tool can skip `pages/` and switch components in `app.vue` on `useSession().status`
  (`loading` spinner, `setup`, `login`, `ready`). Add pages once there are URLs worth sharing.

## API calls

**Page side**: one helper, no `$fetch('/api/…')` in components.

```ts
// app/composables/useApi.ts
export function useApi() {
  return async <T>(path: string, options: { method?: 'GET' | 'POST' | 'DELETE', body?: unknown, query?: Record<string, unknown> } = {}): Promise<T> => {
    try {
      return await $fetch<T>(path, {
        method: options.method ?? 'GET',
        body: options.body as Record<string, unknown>,
        query: options.query,
        headers: { 'X-Requested-With': 'my-app', 'X-Locale': locale.value },
      })
    }
    catch (error) {
      const failure = error as { statusCode?: number, data?: { data?: { error?: { message?: string } } } }
      if (failure.statusCode === 401) useSession().signedOut()
      throw new Error(failure.data?.data?.error?.message
        || (failure.statusCode ? t('errors.serverStatus', { status: failure.statusCode }) : t('errors.serverUnreachable')))
    }
  }
}
```

**Server side**: errors carry a translated message; unexpected exceptions become a readable 500.

```ts
// server/utils/handler.ts
import type { EventHandler, EventHandlerRequest, H3Event } from 'h3'

export const apiError = (statusCode: number, message: string) => createError({ statusCode, data: { error: { message } } })

// Nitro answers an unexpected exception with a bare "500 Server Error"; this shows what failed and logs the stack.
export function apiHandler<T>(handler: (event: H3Event) => T | Promise<T>): EventHandler<EventHandlerRequest, Promise<T>> {
  return defineEventHandler(event => withLocale(event, async () => {
    try {
      return await handler(event)
    }
    catch (error) {
      if (isError(error)) throw error
      console.error(`[api] ${event.method} ${event.path}`, error)
      throw apiError(500, t('server.unexpected', { message: (error as Error)?.message ?? String(error) }))
    }
  }))
}
```

```ts
// server/api/invoices.post.ts
export default apiHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  const problems = invoiceProblems(body)          // shared/utils/rules.ts, also run in the form
  if (problems.length) throw apiError(422, problems.join('\n'))
  return { data: await saveInvoice(body) }        // only what the page needs
})
```

```ts
// server/middleware/1.guard.ts
// Another site cannot add this header without a CORS preflight, and this server answers none.
export default defineEventHandler((event) => {
  if (event.path.startsWith('/api/') && getHeader(event, 'x-requested-with') !== 'my-app') {
    withLocale(event, () => { throw apiError(403, t('server.missingHeader')) })
  }
})
```

- Validation is 422 with one problem per line; the form shows them in a `UAlert`.
- `2.auth.ts` comes after the guard and lists the few open routes (`/api/app`, `/api/auth/login`).
- A 401 signs the page out in one place (`useApi`).
- An app reachable by DNS name also checks `Host` against an allow list: a rebound name is same-origin and could
  send the header.

## Two apps on one theme

A dashboard at the repo root and its marketing site in `site/`, sharing palette, fonts, logo and screenshots.

```
package.json             scripts for both apps, one node_modules
nuxt.config.ts           the dashboard
app/assets/css/main.css  the theme
public/                  logo.svg, favicon.svg
docs/screenshots/        images both READMEs and the site use
site/
  nuxt.config.ts  tsconfig.json
  app/assets/css/main.css  app/app.config.ts  app/  server/routes/
```

```css
/* site/app/assets/css/main.css: four levels up reaches the repo root */
@import "../../../../app/assets/css/main.css";

html {
  scroll-padding-top: 5rem;   /* room for the sticky header when jumping to #anchors */
}

@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
```

```ts
// site/nuxt.config.ts (the parts that differ)
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const fromRoot = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url))
const { version } = JSON.parse(readFileSync(fromRoot('package.json'), 'utf8'))

export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  dir: { public: fromRoot('public') },
  nitro: {
    publicAssets: [{ dir: fromRoot('docs/screenshots'), baseURL: '/screenshots' }],
    prerender: { routes: ['/', '/ar/', '/sitemap.xml', '/robots.txt', '/llms.txt'] },
  },
  runtimeConfig: { public: { version, siteUrl: 'https://example.com' } },
})
```

- The CSS import does not carry `app.config.ts` or the `fonts` block: copy both into `site/`, or the site loses
  its primary colour and falls back to system fonts.
- Root scripts: `"site": "nuxt dev site --port 3001"`, `"site:generate": "nuxt generate site"`,
  `"site:typecheck": "nuxt typecheck site"`.
- `site/tsconfig.json` references `./.nuxt/tsconfig.app.json`, `.server.json`, `.shared.json`, `.node.json`.
- The site's CI path filter includes `site/**`, `public/**`, `docs/screenshots/**`, the root `main.css` and
  `package.json`, so a theme change redeploys the site.
- The dashboard's `.dockerignore` excludes `site` and `docs`.

## CI

One job: `bun install --frozen-lockfile`, `typecheck`, `test`, `build`, then `site:typecheck` and
`site:generate`. `nuxt prepare` (via `postinstall`) before typecheck, or a stale `.nuxt` passes locally and
fails in CI.

## Docker (Nuxt part)

```dockerfile
FROM oven/bun:1 AS bun

FROM node:24-slim AS build
WORKDIR /app
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts
COPY . .
RUN bun run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production NITRO_HOST=0.0.0.0 NITRO_PORT=3000
COPY --from=build --chown=node:node /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

- `--ignore-scripts` on install: `nuxt prepare` needs the sources, which are copied later; the build runs it.
- `.output/` is self-contained; the runtime image needs no `node_modules`.
- `NITRO_HOST=0.0.0.0` inside the container; publish the port on `127.0.0.1` in compose for a local tool.

## Verify

```bash
bun run typecheck && bun run build
bun run generate && npx serve .output/public   # a static site
```
