---
name: vue-inertia-ui-review
description: Use when the UI of a Laravel + Inertia + Vue app must be verified in a real browser, after any change to a page, component, stylesheet, route, theme, translation or form, and whenever someone asks whether something looks right, works on mobile, works in dark mode, reads right in Arabic/RTL, or prints to PDF correctly. Covers serving the app, signing in as a seeded test user, screenshotting every page in light and dark and in each language, checking that navigation stays inside Inertia, forms, validation errors, flash toasts and confirm dialogs, print output, and how to report. Triggers include "does this look right", "check it in the browser", "screenshot the pages", «راجع الواجهة», «شكلها صح؟», «الوضع الليلي», «اتجاه RTL».
---

# Visual review for Vue + Inertia

**Read when:** a front-end change is about to be called done, or someone asks how a screen looks.
**Owns:** serving and signing in, the screenshot matrix, what to look for, Inertia-specific checks
(navigation, forms, toasts), print, and the report.

A green build and a passing type check prove the code compiles. They prove nothing about whether
the page looks right, whether a Latin value inside Arabic renders left to right, whether dark mode
is styled, or whether a form shows its errors. Those need a real browser and someone reading the
screenshots.

## TL;DR

- Build the assets, serve the app, sign in as a seeded test user, then shoot every page at desktop
  and mobile width, in light and dark, in each language.
- **Read every screenshot.** Taking them is not checking them.
- Treat any `pageerror` or unexpected console error as real. Name expected noise (a blocked font
  host) once, and ignore only that.
- Click through the interactive parts: forms empty and valid, dialogs, filters, tabs, menus.
- Navigation between pages stays inside Inertia: no full page load after the first.
- Report with the images. Say what you checked and what still looks off, not only what passed.

## Serve and sign in

```bash
npm run build                        # Laravel serves the built assets from public/build
php artisan migrate:fresh --seed     # local database only: a known test user and sample rows
(nohup php artisan serve --host 127.0.0.1 --port 8000 > /tmp/serve.log 2>&1 &) ; sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/login

npm i -D playwright-core --no-save   # if the project has no Playwright
UI_REVIEW_PASSWORD=password node <skill>/scripts/login.mjs \
  --base http://127.0.0.1:8000 --email test@example.com --out /tmp/state.json
```

- Use the test user the project's seeders create, never a real account. Starter kits seed
  `test@example.com`; read `database/seeders/DatabaseSeeder.php` for the password.
- `composer run dev` also works (it starts Vite in dev mode). Shoot the built assets at least once
  before calling it done: a missing import or a CSS order problem can show only in the build.
- Never run `migrate:fresh` against anything but a local database.

## The screenshot matrix

```bash
php artisan route:list --method=GET --except-vendor   # the pages worth shooting

node <skill>/scripts/shoot.mjs --base http://127.0.0.1:8000 --out /tmp/shots \
  --storage-state /tmp/state.json --viewports desktop=1280x900,mobile=390x844 \
  /dashboard /customers /customers/1 /customers/1/edit /settings/profile
```

It writes one PNG per path × viewport × theme × language plus `summary.json`, and flags HTTP
errors, page and console errors, failed requests, horizontal overflow, an empty body, and a wrong
`lang`/`dir` on `<html>`. Run it with no arguments for all options.

**Two languages.** Laravel keeps the locale in the session or in an encrypted cookie, so a plain
cookie set from outside is ignored. Switch the language the way a user does (the menu, or the app's
locale route) after signing in, save one state file per language, and run the matrix once per state.
If the app reads the language from a query or the URL prefix, `--langs en,ar --lang-via query:lang`
or `--lang-via prefix` does it in one run.

**Theme.** The script emulates `prefers-color-scheme`. If the app saves a choice in localStorage
(starter kits use `appearance`), add `--theme-storage appearance` so the saved choice does not win.

Environment gotchas:

- A preinstalled Chromium: pass `--executable` (or `CHROMIUM_PATH`); don't run `playwright install`.
- `playwright-core` installed with `--no-save` is CommonJS; the scripts load it through `createRequire`.
- Never `pkill` the server from inside a tool's shell call; it can kill the shell. Leave it running.
- Write scripts, state files and screenshots to a scratch folder, never the repo.

## What to look for

- **Empty grey boxes:** a broken image path, or an avatar missing its fallback.
- **Scrambled mixed-direction text:** a URL, phone or key inside Arabic printed in the wrong order.
  The value is missing `dir="ltr"`.
- **Mirrored-wrong spacing in RTL:** a `left-`/`right-`/`ml-`/`pr-` class that should be `start`/`end`.
- **Arrows and chevrons pointing the wrong way in RTL**, and dropdowns or drawers opening on the
  wrong side (a missing `ConfigProvider :dir` in the layout).
- **Horizontal scroll** at mobile width; a table that should scroll inside its card.
- **Unreadable contrast** in either theme; borders or icons that vanish in dark.
- **Leftover English** in the Arabic pass, including `placeholder`, `aria-label`, `title` and `alt`,
  which a screenshot doesn't show:

  ```js
  await page.evaluate(() => [...document.querySelectorAll('[placeholder],[aria-label],[title],[alt]')]
    .flatMap(el => ['placeholder', 'aria-label', 'title', 'alt'].map(a => el.getAttribute(a)))
    .filter(v => v && /[A-Za-z]{3,}/.test(v) && !/[؀-ۿ]/.test(v)));
  ```

- **Raw translation keys** (`customers.fields.name`) where a sentence should be.

## Inertia-specific checks

- **Navigation stays inside Inertia.** Clicking a link must not reload the document; a full load
  means a hand-written `<a href>` instead of `<Link>`.
- **`<html lang dir>` changes when the language changes**, without a reload.
- **Forms:** submit empty, then valid. Errors render under their fields; an error on a hidden tab
  lights the tab; a valid submit redirects and shows one toast. A GET shows none.
- **Confirm dialogs** name the record and use a destructive button; Escape closes them.
- **The page title** (`<Head :title>`) is set on every page, including detail pages.
- **Permissions:** sign in as a user without a permission once; the action is absent, not disabled.

Snippets for each: [references/checks.md](references/checks.md).

## Print and PDF

If the app prints or exports PDF, render it (`shoot.mjs --print`): no nav or buttons survive, open
overlays are hidden, the light palette is used even from dark mode, and cards and tables are not
split across pages. Details: [references/checks.md](references/checks.md#print-and-pdf).

## Reporting

- Send the screenshots to the user. They judge a screen faster from an image than from a description.
- Say plainly what you checked (pages, widths, themes, languages, states) and what still looks off.
- Separate real errors from expected environment noise, and name the noise once.
- Say what you could not check (no browser, no seed data, a page behind a permission you lacked)
  instead of implying it passed.
