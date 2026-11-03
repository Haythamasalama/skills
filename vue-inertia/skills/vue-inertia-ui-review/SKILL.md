---
name: vue-inertia-ui-review
description: Use when a web app's UI must be verified visually in a real browser, after any change to a component, stylesheet, route, theme, translation or content, and whenever someone asks whether something looks right, works on mobile, works in dark mode, reads right in Arabic/RTL, or prints or exports to PDF correctly. Covers screenshotting every page in light and dark and in both languages, exercising interactive parts, checking routing and deep links, print and PDF output, what to look for, and how to report. Triggers include "does this look right", "check it in the browser", "screenshot the pages", «راجع الواجهة», «شكلها صح؟», «الوضع الليلي», «اتجاه RTL».
---

# Visual verification

A green build proves the code compiles. It proves nothing about whether the page looks right,
whether English inside Arabic renders left to right, whether dark mode is styled, or whether the
PDF export holds what it should. Those need a real browser and someone reading the screenshots.

## TL;DR

- Build, serve the built app (a preview server, not only the dev server), then shoot every page
  at desktop and mobile width, in light and dark, in each language.
- **Read every screenshot.** Taking them is not checking them.
- Treat any `pageerror` or unexpected console error as real. Note the expected ones (a font host
  the sandbox blocks) once, and ignore only those.
- Exercise the interactive parts by hand: they break most and show least in a diff.
- Check deep links, redirects for retired URLs, and the 404 page.
- If the app prints or exports PDF, render it: no chrome, complete print-only content, light
  palette, nothing split across pages, no overlays.
- Report with the images. Say what you checked and what still looks off, not only what passed.

## Pick the browser

Use whatever real browser the environment provides: a browser MCP, a browser CLI, or a Playwright
script. `scripts/shoot.mjs` is a ready script for the screenshot matrix:

```bash
npm run build
(nohup npx vite preview --host 127.0.0.1 --port 4173 > /tmp/preview.log 2>&1 &) ; sleep 5
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4173/

npm i -D playwright-core --no-save        # if the project has no Playwright
node <skill>/scripts/shoot.mjs --base http://127.0.0.1:4173 --out /tmp/shots \
  --langs en,ar --lang-via prefix --viewports desktop=1280x900,mobile=390x844 \
  / /about /pricing /some/deep/link
```

It writes one PNG per path × viewport × theme × language plus `summary.json`, and flags HTTP
errors, page and console errors, failed requests, horizontal overflow, an empty body, and a wrong
`lang`/`dir` on `<html>`. Run `node shoot.mjs` with no arguments for the options (language via URL
prefix, query, localStorage or cookie; a theme stored in localStorage; `--print` for PDF).

Environment gotchas that cost time:

- **A preinstalled Chromium:** if one exists, pass `--executable` (or `CHROMIUM_PATH`) and don't run
  `playwright install`, which downloads browsers.
- **`playwright-core` installed with `--no-save` is CommonJS.** From an ES module in a scratch
  folder, import it by absolute path or through `createRequire`, as the script does.
- **Never `pkill` the preview server from inside a tool's shell call.** It can kill the shell too
  (exit 144). Start it with `nohup` and leave it running.
- **Write scripts and screenshots to a scratch folder, not the repo.**
- **Serve over HTTP.** Many browser tools block `file://`, and an app often won't mount there.

## Pages, light and dark

Shoot each page at 1280×900 and 390×844, plus 1920×1080 if the app is shown on a TV or a big
screen. Emulate `prefers-color-scheme: dark` for the dark pass. If the app defaults to the system
preference, dark mode is what many visitors see first: an unstyled surface there is a bug.

Look for:

- **Empty grey boxes:** a broken image path, or an image component missing its fallback.
- **Scrambled mixed-direction text:** `there are / there is` printed as `there is / there are`, or
  punctuation on the wrong end. The run is missing its `lang` + `dir` isolation.
- **Mirrored-wrong spacing in RTL:** a `left-`/`right-`/`ml-`/`pr-` utility that should be
  `start`/`end`.
- **Arrows and chevrons pointing the wrong way in RTL**, and poppers or drawers opening on the
  wrong side.
- **Horizontal scroll** at mobile width.
- **Unreadable contrast** in either theme; text, borders or icons that vanish in dark.
- **Leftover English** in the Arabic pass, including `placeholder`, `aria-label`, `title` and
  `alt`, which a screenshot doesn't show. The `arabic-copy` skill has a sweep script for this.

## Interactive parts

Walk every widget until each state has been seen: open, closed, selected, correct, wrong,
disabled, empty, loading, error. Confirm right answers or valid input go green, wrong ones red,
and the feedback text matches the choice. Patterns and snippets:
[references/checks.md](references/checks.md#interactive-parts).

- **Hold a DOM handle** when a control changes its own label. A text-based locator re-resolves
  once the label changes and clicks the wrong thing.
- Disabled-but-graded options must stay readable (full opacity) when they carry the result.
- A button that must stay disabled until a condition holds: check both sides of the condition.

## Routing

- Deep links and refreshes on nested routes return 200. With history-mode routing, the web server
  fallback is what makes that work.
- Retired URLs that people were given redirect where they should, with a real 301 from the server.
- An unknown path lands on the 404 view, not a blank page.

## Print and PDF

If the app prints or exports PDF, that is a real output target. Render it:

- open any dropdown or dialog first, then emulate print: **overlays rendered through a portal on
  `<body>` sit outside any `.no-print` ancestor** and survive into print unless hidden explicitly;
- no header, footer, nav or buttons survive;
- print-only content (a teacher's copy, an answer key, a flat version of a step player) is there
  and complete;
- the light palette is used even when the site was in dark mode;
- cards and tables are not split across page breaks;
- no animation is left mid-state.

Snippets: [references/checks.md](references/checks.md#print-and-pdf).

## Reporting

- Send the screenshots and the PDF to the user. They judge a design faster from an image than from
  a description.
- Say plainly what you checked (pages, widths, themes, languages, states) and anything that still
  looks off.
- Separate real errors from expected environment noise, and name the noise once.
- Say what you could not check (no browser, blocked network, no seed data) instead of implying it
  passed.
