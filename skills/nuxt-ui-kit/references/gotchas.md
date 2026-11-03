# Gotchas

**Read when:** something renders blank, unstyled or mirrored wrong, a build or prerender fails, a value "is not
defined", or a layout breaks on a phone.
**Owns:** symptom → fix pairs only. The rule behind each fix lives in the linked file.

## TL;DR

- Find the symptom, apply the fix, then read the linked section for why.
- Most Nuxt UI 4 surprises are one of four things: `@theme` vs `@theme static`, the icon scan, Nitro
  auto-imports, a missing `dir` or locale.

## Theme

| Symptom | Fix |
|---|---|
| A custom palette set as `primary` does nothing; buttons look unstyled | move it into `@theme static` ([theme.md](theme.md#the-palette-sage)) |
| A CSS variable read from JS or inline SVG is empty | same: `@theme static` or `:root` |
| A token looks right in light, wrong in dark | give it a `.dark` value too ([theme.md](theme.md#the-look-value-by-value)) |
| A white strip under a grey page on overscroll or a short page | `html, body { background-color: var(--ui-bg-muted) }` ([../assets/main.css](../assets/main.css)) |
| Cards have a shadow | `card.slots.root: 'shadow-none'` ([../assets/app.config.ts](../assets/app.config.ts)) |
| A `class` on a component is ignored | it targets the root; use `:ui="{ <slot>: '…' }"` ([theme.md](theme.md#component-defaults-appconfigts)) |
| The second app has the wrong primary colour | its own `app/app.config.ts` is missing ([setup.md](setup.md#two-apps-on-one-theme)) |
| The theme looks half switched after toggling dark in devtools | switch with the app's toggle ([theme.md](theme.md#dark-mode)) |

## Icons

| Symptom | Fix |
|---|---|
| Icons are empty boxes on the static build, fine in dev | scan `**/*.{vue,ts}` ([static-seo.md](static-seo.md#icons-without-a-server)) |
| An icon built from a string is missing | write the full name, or list it in `clientBundle.icons` |
| Icons fail offline or behind a firewall | install `@iconify-json/lucide`; `serverBundle: 'local'` or a client bundle ([setup.md](setup.md#nuxtconfigts)) |
| Arrows point the wrong way in Arabic | add the icon to the flip list ([i18n-rtl.md](i18n-rtl.md#icons-that-point-somewhere)) |

## Fonts

| Symptom | Fix |
|---|---|
| Arabic in the system font, Latin in the brand font | `subsets: ['arabic', 'latin']` ([theme.md](theme.md#fonts)) |
| Bold looks smeared or thin | add that weight to `fonts.families[].weights` |
| The second app uses system fonts | copy the `fonts` block into its `nuxt.config.ts` |
| Arabic letters look broken apart | remove `tracking-*` / `uppercase` from Arabic text ([i18n-rtl.md](i18n-rtl.md#arabic-type)) |

## Nitro and shared code

| Symptom | Fix |
|---|---|
| "x is not defined" in `nuxt generate`, dev works | import the util explicitly (`import { x } from '~/utils/x'`) |
| A server route cannot find a helper from `app/utils` | relative import, or move it to `shared/` ([blueprint.md](blueprint.md#folder-tree)) |
| "X is not defined" in a server route after a refactor | Nitro does not see `X` inside `(X as readonly string[])`; write `X.some(v => v === input)` |
| `t()` stops working inside one function | a local variable named `t` shadows it; rename it ([blueprint.md](blueprint.md#naming)) |
| `shared/` imports data and the server build breaks | import dictionaries and data as types only; hand data in from a plugin ([i18n-rtl.md](i18n-rtl.md#dictionaries-shared-by-page-and-server)) |
| A new `server/plugins/` folder is ignored | restart the dev server |
| `process.umask()` throws in dev | not available in Nitro's dev workers; set modes with `chmodSync` |

## Rendering and hosting

| Symptom | Fix |
|---|---|
| Logo, favicon or images 404 on GitHub Pages | build with `NUXT_APP_BASE_URL` and use `asset()` ([static-seo.md](static-seo.md#paths-under-a-base-url)) |
| `/sitemap.xml` missing from the output | add it to `nitro.prerender.routes` ([static-seo.md](static-seo.md#prerender)) |
| Two pages show each other's data | give each `useAsyncData` a unique key |
| A hydration warning about a date | format with a fixed `timeZone` ([i18n-rtl.md](i18n-rtl.md#numbers-dates-and-money)) |
| A date shows one day early | parse `YYYY-MM-DD` as `${iso}T00:00:00`, not as UTC |
| An ISR page caches an outage | return 503 on failure ([setup.md](setup.md#spa-prerender-or-hybrid)) |
| The browser shows an old page after a rebuild | hard reload, or add a query string |
| `localStorage` throws in a private window or embed | wrap every read and write in `try`/`catch` with a default |
| Toasts, tooltips or `useOverlay` do nothing | wrap the app in `<UApp>` |
| The form flashes empty while a modal closes | reset it when the modal opens ([components.md](components.md#modals-and-slideovers)) |

## Layout and RTL

| Symptom | Fix |
|---|---|
| `UTabs` makes the page wider than the phone | `overflow-x-auto` wrapper, `mx-auto w-max` on the tabs ([components.md](components.md#tabs)) |
| A table or long ID overflows its card | `min-w-0` on the flex child, `truncate` or `break-all` on the text |
| The layout is mirrored wrong in Arabic | replace `ml-*`, `left-*`, `text-left` with logical classes ([i18n-rtl.md](i18n-rtl.md#layout-once-both-directions)) |
| Phone numbers, versions or paths scramble in Arabic | `<bdi dir="ltr">` ([i18n-rtl.md](i18n-rtl.md#mixed-direction-text)) |
| A user's message shows with the wrong alignment | `dir="auto"` on its element |
| A placeholder sits on the wrong edge of an input | remove `dir="ltr"`; use `autoDir()` ([i18n-rtl.md](i18n-rtl.md#inputs)) |
| Submenus open the wrong way or arrow keys are reversed in Arabic | pass the locale to `<UApp>`; `<html dir>` alone is not enough ([i18n-rtl.md](i18n-rtl.md#two-settings-both-needed)) |
| The first paint is LTR, then flips | default `lang`/`dir` in `nuxt.config.ts` `app.head.htmlAttrs` |
| Server messages stay in the old language after a switch | refetch on `watch(locale, …)` |

## Tooling

| Symptom | Fix |
|---|---|
| False template type errors in a git worktree inside the checkout | it resolves the parent's `node_modules`; check in a clean copy or run `nuxt prepare` there |
| `nuxt typecheck` passes locally, fails in CI | run `nuxt prepare` first; keep `"postinstall": "nuxt prepare"` |
| `bun install` fails in Docker before the sources are copied | `--ignore-scripts`; the build runs `nuxt prepare` ([setup.md](setup.md#docker-nuxt-part)) |
