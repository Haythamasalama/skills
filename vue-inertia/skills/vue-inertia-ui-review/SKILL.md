---
name: vue-inertia-ui-review
description: Use when the UI of a Laravel + Inertia + Vue app must be verified in a real browser, after any change to a page, component, stylesheet, route, theme, translation or form, and whenever someone asks whether something looks right, works on mobile, works in dark mode, reads right in Arabic/RTL, or prints to PDF correctly. Covers serving the app, signing in as a seeded test user, switching language (session, cookie, URL prefix) and theme (localStorage, cookie), screenshotting every page in light and dark and in each language, checking that navigation stays inside Inertia, forms, validation errors, flash toasts, confirm dialogs, permissions, interactive widgets, print output, and how to report. Triggers include "does this look right", "check it in the browser", "screenshot the pages", "test dark mode", «راجع الواجهة», «شكلها صح؟», «الوضع الليلي», «اتجاه RTL», «جرّبها في المتصفح».
---

# Visual review for Laravel + Inertia + Vue

**Read when:** a front-end change is about to be called done, or someone asks how a screen looks.
**Owns:** serving and signing in, switching language and theme, the screenshot matrix, what to look
for, the report, and the two scripts that do the repetitive part.

## TL;DR

- A green build and a passing type check prove the code compiles, not that the page looks right,
  that dark mode is styled, or that a form shows its errors. Those need a browser and a reader.
- Build the assets, serve the app, sign in as a seeded **local** test user, then shoot every page at
  desktop and mobile width, in light and dark, in each language.
- **Read every screenshot.** Taking them is not checking them.
- Find out how the app stores its language and theme before shooting; set them the same way the app
  does, or the run shoots one language twice and calls it two.
- Treat any `pageerror` or unexpected console error as real. Name expected noise once, ignore only that.
- Click through the interactive parts: forms empty and valid, dialogs, filters, tabs, menus.
- Navigation between pages stays inside Inertia: no full page load after the first.
- Report with the images. Say what you checked and what still looks off, not only what passed.

## Serve and sign in

```bash
npm run build                        # Laravel serves the built assets from public/build
php artisan migrate:fresh --seed     # local database only: a known test user and sample rows
php artisan serve --host 127.0.0.1 --port 8000      # in a terminal or background task of its own
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/login

npm i -D playwright-core --no-save   # if the project has no Playwright
UI_REVIEW_PASSWORD=password node <skill>/scripts/login.mjs \
  --base http://127.0.0.1:8000 --email test@example.com --out .ui-review/state.json
```

- **The test user.** Read `database/seeders/` for it. Starter kits seed `test@example.com` through
  the user factory, whose default password is `password`. A staff panel on its own guard often seeds
  its own model (`AdminSeeder`, `StaffSeeder`) with its own login path: pass `--login-path`.
  Never use a real account.
- **A bot check on the login form** (Turnstile, reCAPTCHA, hCaptcha) must be off locally, usually by
  leaving its keys empty in `.env`. `login.mjs` stops when it sees one. Never try to solve it.
- **Already serving?** If the app runs on a local domain (Herd, Valet, Sail), use that URL as
  `--base` instead of starting `artisan serve`.
- `composer run dev` also works (Vite in dev mode). Shoot the built assets at least once before
  calling it done: a missing import or a CSS order problem can show only in the build.
- Never run `migrate:fresh` against anything but a local database.

## Language and theme

Set both the way the app itself reads them. How to find out, and which option matches each case:
[references/language-and-theme.md](references/language-and-theme.md). The short version:

| The app keeps the language in… | Use |
|---|---|
| the session, switched by a GET route | `--lang-via visit:/locale/{lang}` (the app's route) |
| a URL prefix (`/ar/pricing`) | `--lang-via prefix` |
| a query parameter | `--lang-via query:lang` |
| a cookie the server reads unencrypted | `--lang-via cookie:<name>` |
| localStorage | `--lang-via storage:<key>` |

Theme: the script emulates `prefers-color-scheme`. When the app saves a choice, also pass
`--theme-storage <key>` and, if the server reads a cookie to render the `dark` class, `--theme-cookie <name>`.

## The screenshot matrix

```bash
php artisan route:list --method=GET --except-vendor   # the pages worth shooting

node <skill>/scripts/shoot.mjs --base http://127.0.0.1:8000 --out .ui-review/shots \
  --storage-state .ui-review/state.json --theme-storage appearance \
  --langs en,ar --lang-via visit:/locale/{lang} \
  /dashboard /invoices /invoices/1 /invoices/1/edit /settings/profile
```

It writes one PNG per path × theme × viewport × language plus `summary.json`, and flags an HTTP
error, a redirect to the login page, page and console errors, failed requests, horizontal overflow,
an empty body, a wrong `lang`/`dir` on `<html>`, and a `dark` class that does not match the theme. `--help` lists every option.

- Shoot the largest realistic data set at least once: an empty list hides overflow and wrapping.
- Shoot a page with long values (a long name, a long email, a big amount) in both languages.
- Add `.ui-review/` (or whatever scratch folder you pick) to `.git/info/exclude`, so state files and
  screenshots never reach a commit.

## Probing a page yourself

For anything the matrix cannot see (a dialog, a menu, a form submit), write a short script next to
the state file. Every snippet in `references/` assumes this `page`:

```js
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/');   // resolve the project's node_modules
const { chromium } = require('playwright-core');      // CommonJS when installed --no-save

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const context = await browser.newContext({ storageState: '.ui-review/state.json', colorScheme: 'dark' });
const page = await context.newPage();
page.on('pageerror', (e) => console.log('pageerror:', e.message));
page.on('console', (m) => m.type() === 'error' && console.log('console:', m.text()));
await page.goto('http://127.0.0.1:8000/invoices', { waitUntil: 'networkidle' });
```

Environment gotchas:

- A preinstalled Chromium or Chrome: pass `--executable` (or `CHROMIUM_PATH`); don't download
  browsers with `playwright install` unless the user agrees.
- Never `pkill` the server from inside a tool's shell call; it can kill the shell. Leave it running.
- A session the app expires or a sign-out on another tab makes every shot land on the login page;
  the script flags `signed out`. Sign in again.

## What to look for

Read each image for these, then open the reference that owns the area.

- **Layout:** horizontal scroll at mobile width; a table that should scroll inside its card; text
  cut off or overlapping; a sticky bar covering content.
- **Theme:** unreadable contrast in either theme; borders, icons or chart lines that vanish in dark;
  a white flash or a white card in dark (a literal colour instead of a theme token).
- **Images:** empty grey boxes from a broken path, or an avatar missing its fallback.
- **Direction and text:** anything on the wrong side in RTL, scrambled mixed-direction values,
  leftover English, raw translation keys. See
  [references/rtl-and-text.md](references/rtl-and-text.md).
- **Inertia behaviour:** full page loads, forms, validation, toasts, dialogs, permissions, error
  pages. See [references/inertia-checks.md](references/inertia-checks.md).
- **Widgets:** every state of a control, not only its first one. See
  [references/interactive.md](references/interactive.md).
- **Print:** if the app prints or exports PDF, see [references/print.md](references/print.md).

## Expected noise

In a sandbox, third-party font or analytics hosts are often blocked. Their failed requests and
`ERR_CONNECTION_RESET` console errors are environment noise: name them once in the report and
ignore only those (`shoot.mjs --ignore 'fonts\.googleapis|fonts\.gstatic'`). Fallback fonts in the
screenshots come from the same cause. Every other error is real.

## Reporting

- Send the screenshots to the user. They judge a screen faster from an image than from a description.
- Say plainly what you checked (pages, widths, themes, languages, states) and what still looks off.
- Separate real errors from expected environment noise, and name the noise once.
- Say what you could not check (no browser, no seed data, a page behind a permission you lacked)
  instead of implying it passed.

## Where each topic lives

| Topic | File |
|---|---|
| Sign in through the login form and save the browser state | [scripts/login.mjs](scripts/login.mjs) |
| Screenshot paths × themes × widths × languages, flag errors and overflow | [scripts/shoot.mjs](scripts/shoot.mjs) |
| Where the app keeps language and theme, and which option sets them | [references/language-and-theme.md](references/language-and-theme.md) |
| Navigation, routing, forms, validation, toasts, dialogs, permissions, error pages | [references/inertia-checks.md](references/inertia-checks.md) |
| RTL layout, mixed-direction values, leftover English, raw keys | [references/rtl-and-text.md](references/rtl-and-text.md) |
| Controls with several states: toggles, choices, gated buttons, steppers, menus | [references/interactive.md](references/interactive.md) |
| Print styles and PDF output | [references/print.md](references/print.md) |
