# Gotchas

Things that broke a Nuxt 4 + Nuxt UI 4 + Tailwind 4 build or page before, with the cause and the fix.
Checked 2026-10-27. Each entry: **symptom** → cause → fix.

## Theme and Tailwind

- **A custom palette set as `primary` has no effect; buttons look unstyled.**
  → The palette is in `@theme`, and Tailwind 4 drops variables that no utility class uses.
  → Declare it in `@theme static`.
- **A CSS variable read from JavaScript or inline SVG is undefined.** → Same cause. → Define it in `@theme static`
  or in `:root`.
- **A token change looks right in light mode and wrong in dark.** → It was only set in `:root`.
  → Set every token in both `:root` and `.dark`.
- **A white strip shows under a grey page when scrolling past the end, or under a short page.**
  → The page colour is on a wrapper `div`, not on the document. → `html, body { background-color: var(--ui-bg-muted) }`.
- **Cards have a shadow you did not ask for.** → Nuxt UI's default card theme.
  → `ui: { card: { slots: { root: 'shadow-none' } } }` in `app.config.ts`.
- **A class passed to a component is ignored.** → It targets the root, but the style is on a slot.
  → Use the `:ui` prop with the slot name (`:ui="{ base: '...' }"`), or set it globally in `app.config.ts`.
- **The theme looks half switched after toggling dark mode in devtools.** → `@nuxtjs/color-mode` keeps its own state.
  → Switch with the app's toggle.

## Icons

- **Icons render as empty boxes on the static build but work in dev.**
  → With `icon.provider: 'none'` only scanned icons are bundled, and the default scan skips `.ts` files.
  → `icon: { provider: 'none', clientBundle: { scan: { globInclude: ['**/*.{vue,ts}'] } } }`.
- **An icon built from a string (`` `i-lucide-${name}` ``) is missing.** → The scanner cannot see dynamic names.
  → Write full names in data, or list them in `clientBundle.icons`.
- **Icons fail offline or behind a firewall.** → They are fetched from the Iconify API at runtime.
  → Install `@iconify-json/lucide` and set `icon.serverBundle: 'local'` (server apps) or bundle them as above.
- **Arrows point the wrong way in Arabic.** → Icons are not mirrored by default.
  → [Icons that point somewhere](i18n-rtl.md#icons-that-point-somewhere).

## Fonts

- **Arabic text shows in the system font while Latin text uses the brand font.**
  → `@nuxt/fonts` skips the Arabic subset by default. → [Fonts for Arabic](i18n-rtl.md#fonts-for-arabic).
- **Bold text looks smeared or too thin.** → That weight was not downloaded, so the browser fakes it.
  → List every weight in `fonts.families[].weights`.
- **The second app in the repo uses system fonts.** → The `fonts` block lives in `nuxt.config.ts`, not in CSS.
  → Copy it into the second app's config.

## Nitro, auto-imports and shared code

- **"x is not defined" during `nuxt generate`, but dev works.** → An auto-imported util is not resolved in the
  prerender pass. → Import it explicitly (`import { x } from '~/utils/x'`).
- **A server route cannot find a helper from `app/utils`.** → Server auto-imports cover `server/utils` and `shared/`
  only. → Import with a relative path, or move the helper to `shared/`.
- **A server route fails with "X is not defined" after a refactor.** → The value is only used as
  `(X as readonly string[])`; Nitro's auto-import does not see an identifier inside a type assertion.
  → Write it without the cast (`X.some(value => value === input)`) or import it.
- **A translation helper `t()` stops working inside one function.** → A local variable named `t` shadows it.
  → Never name a variable `t`; use `entry`, `item`, `template`.
- **Shared code imports data and the server build breaks.** → Nitro and Vite resolve relative runtime imports in
  `shared/` differently. → Import types only in shared code; pass data in from an app plugin and a server util.
- **A new folder like `server/plugins/` is ignored.** → Nitro picks up new top-level server folders on start.
  → Restart the dev server.
- **`process.umask()` throws in dev.** → Nitro's dev workers do not provide it. → Set file modes with `chmodSync`.

## Rendering, prerender and hosting

- **Images, the favicon or the logo 404 on GitHub Pages.** → The site is served under `/<repository-name>/` and raw
  `public/` paths lack it. → Build with `NUXT_APP_BASE_URL` and prefix raw paths with
  `useRuntimeConfig().app.baseURL`.
- **`/sitemap.xml` is missing from the generated site.** → Server routes only run at build time when listed.
  → Add them to `nitro.prerender.routes`.
- **Two pages show each other's data.** → Two `useAsyncData` calls share a key. → Give each call a unique key.
- **A hydration warning about a date.** → The server and the browser format in different time zones.
  → A fixed `timeZone`: [Numbers, dates and money](i18n-rtl.md#numbers-dates-and-money).
- **An ISR page caches an outage.** → The page returned 200 with an error state. → Return a 503 so the host keeps
  the last good copy.
- **The browser shows an old page after a rebuild.** → The page payload is cached. → Reload with a query string
  (`?v=2`) or a hard reload.
- **`localStorage` throws in a private window or an embedded view.** → Storage is blocked.
  → Wrap every read and write in `try`/`catch` and fall back to a default.

## Layout and RTL

- **`UTabs` pushes the page wider than the phone.** → The tab list does not wrap.
  → Wrap it: `<div class="overflow-x-auto"><UTabs class="mx-auto w-max" ... /></div>`.
- **A table or long ID overflows its card.** → A flex child without `min-w-0` refuses to shrink.
  → Add `min-w-0` on the flex child and `truncate` or `break-all` on the text.
- **The layout is mirrored wrong in Arabic.** → Physical classes (`ml-*`, `left-*`, `text-left`).
  → [Layout once, both directions](i18n-rtl.md#layout-once-both-directions).
- **Phone numbers, versions or paths scramble inside Arabic sentences, or a user's message shows with the wrong
  alignment.** → The bidi algorithm reorders neutral characters; typed text inherits the page direction.
  → [Mixed-direction text](i18n-rtl.md#mixed-direction-text).
- **In Arabic, submenus open toward the wrong side or arrow keys move the wrong way in tabs.** → `UApp` has no
  locale, so Reka UI assumes LTR. → [Two settings, both needed](i18n-rtl.md#two-settings-both-needed);
  setting `<html dir>` alone is not enough.

## Tooling

- **False template type errors in a git worktree.** → A worktree inside the main checkout resolves types from the
  parent's `node_modules`. → Check in a clean copy, or run `nuxt prepare` in the worktree after installing.
- **`nuxt typecheck` passes locally, fails in CI.** → `.nuxt` was stale locally. → `nuxt prepare` before typecheck;
  keep `"postinstall": "nuxt prepare"`.
