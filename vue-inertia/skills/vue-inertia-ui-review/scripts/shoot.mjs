#!/usr/bin/env node
// Screenshots pages in a real browser: every path × theme × viewport × language, with HTTP status,
// page and console errors, failed requests, overflow, <html lang dir>, the dark class and sign-out
// flagged per shot.
// Writes PNGs and summary.json to --out.
//
//   node shoot.mjs --base http://127.0.0.1:8000 --storage-state state.json /dashboard /invoices
//   node shoot.mjs --base … --storage-state state.json --langs en,ar --lang-via visit:/locale/{lang} /dashboard
//   node shoot.mjs --base … --langs en,ar --lang-via prefix / /pricing
//   node shoot.mjs --base … --theme-storage appearance --theme-cookie appearance /dashboard
//   node shoot.mjs --base … --print /invoices/1
//
// Options (all optional except --base):
//   --out DIR               output folder (default: shots). Keep it out of the repo.
//   --storage-state FILE    state saved by login.mjs, for pages behind a login
//   --themes light,dark     colour schemes to shoot
//   --theme-storage KEY     also write the theme to localStorage[KEY]
//   --theme-cookie NAME     also set the theme as cookie NAME (it must be excepted from encryption)
//   --viewports desktop=1280x900,mobile=390x844
//   --langs en,ar           languages to shoot; omit for one pass in whatever the app picks
//   --lang-via MODE         how to pick the language, required with --langs:
//                             visit:<path>    open <path> first in each pass; {lang} is replaced.
//                                             A path with no {lang} is a toggle: opened until <html lang> matches.
//                             prefix          /ar/invoices
//                             query:<param>   /invoices?<param>=ar
//                             cookie:<name>   a cookie excepted from encryption
//                             storage:<key>   localStorage[<key>]
//   --login-path PATH       landing here from another path flags "signed out" (default: /login)
//   --ignore REGEX          console and request errors to ignore (e.g. a font host the sandbox blocks)
//   --wait MS               extra settle time after load (default: 300)
//   --executable PATH       a preinstalled Chromium (or set CHROMIUM_PATH)
//   --print                 also a print-media screenshot and an A4 PDF per path, first viewport only
//
// Exits 2 on bad usage, 1 when any shot has a problem.
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const usage = 'usage: node shoot.mjs --base <url> [options] <path> [<path> …]   (--help for options)';

const opts = {
  base: '',
  out: 'shots',
  storageState: '',
  themes: 'light,dark',
  themeStorage: '',
  themeCookie: '',
  viewports: 'desktop=1280x900,mobile=390x844',
  langs: '',
  langVia: '',
  loginPath: '/login',
  ignore: '',
  wait: '300',
  executable: process.env.CHROMIUM_PATH ?? '',
  print: false,
  help: false
};
const flags = new Set(['print', 'help']);
const paths = [];

function fail (message) {
  console.error(message);
  process.exit(2);
}

function parseArgs (argv) {
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (!arg.startsWith('--')) {
      paths.push(arg);
      continue;
    }

    const key = arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    if (!(key in opts)) {
      fail(`unknown option ${arg}\n${usage}`);
    }

    if (flags.has(key)) {
      opts[key] = true;
      continue;
    }

    if (argv[i + 1] === undefined) {
      fail(`${arg} needs a value\n${usage}`);
    }

    opts[key] = argv[++i];
  }
}

function loadPlaywright () {
  // Resolved from the project, not from this file, because the skill folder has no node_modules.
  const require = createRequire(join(process.cwd(), 'noop.js'));

  for (const name of ['playwright', 'playwright-core']) {
    try {
      return require(name);
    } catch {}
  }

  fail('playwright not found from this directory. Run: npm i -D playwright-core --no-save');
}

parseArgs(process.argv.slice(2));

if (opts.help) {
  console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\nimport ')[0].split('\n').slice(1).map(line => line.replace(/^\/\/ ?/, '')).join('\n'));
  process.exit(0);
}

if (!opts.base || paths.length === 0) {
  fail(usage);
}

const list = value => value.split(',').map(item => item.trim()).filter(Boolean);
const themes = list(opts.themes);
const langs = opts.langs ? list(opts.langs) : [''];
const separator = opts.langVia.indexOf(':');
const langMode = separator === -1 ? opts.langVia : opts.langVia.slice(0, separator);
const langKey = separator === -1 ? '' : opts.langVia.slice(separator + 1);

if (opts.langs && !['visit', 'prefix', 'query', 'cookie', 'storage'].includes(langMode)) {
  fail('--langs needs --lang-via visit:<path> | prefix | query:<param> | cookie:<name> | storage:<key>');
}

if (['visit', 'query', 'cookie', 'storage'].includes(langMode) && !langKey) {
  fail(`--lang-via ${langMode} needs a value after the colon, e.g. ${langMode}:locale`);
}

const viewports = list(opts.viewports).map(entry => {
  const [name, size = ''] = entry.split('=');
  const [width, height] = size.split('x').map(Number);

  if (!width || !height) {
    fail(`bad viewport "${entry}", expected name=WIDTHxHEIGHT`);
  }

  return { name, width, height };
});
const ignore = opts.ignore ? new RegExp(opts.ignore) : null;
const keep = text => !(ignore && ignore.test(text));
const out = resolve(opts.out);
const rtlLangs = ['ar', 'he', 'fa', 'ur'];

mkdirSync(out, { recursive: true });

function urlFor (path, lang) {
  const url = new URL(path, opts.base);

  if (lang && langMode === 'prefix') {
    url.pathname = `/${lang}${url.pathname === '/' ? '' : url.pathname}`;
  }

  if (lang && langMode === 'query') {
    url.searchParams.set(langKey, lang);
  }

  return url.href;
}

const firstLine = error => error.message.split('\n')[0];
const slug = path => (path === '/' ? 'home' : path.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-'));

// The locale switch writes the session or a server-set cookie, which only a real request can do.
// It is repeated in every pass because the session is shared by every pass that uses one state file.
async function switchLanguage (context, lang) {
  const page = await context.newPage();
  const target = new URL(langKey.replaceAll('{lang}', lang), opts.base).href;
  let current = '';

  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      await page.goto(target, { waitUntil: 'networkidle', timeout: 30000 });
      current = await page.evaluate(() => document.documentElement.lang);

      if (current.startsWith(lang) || langKey.includes('{lang}')) {
        break;
      }
    }
  } catch (error) {
    current = `failed: ${firstLine(error)}`;
  }

  await page.close();

  return current;
}

async function prepareContext (theme, viewport, lang) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    colorScheme: theme,
    ...(opts.storageState ? { storageState: opts.storageState } : {})
  });
  const storage = [];
  const cookies = [];

  if (opts.themeStorage) {
    storage.push([opts.themeStorage, theme]);
  }

  if (opts.themeCookie) {
    cookies.push({ name: opts.themeCookie, value: theme, url: opts.base });
  }

  if (lang && langMode === 'storage') {
    storage.push([langKey, lang]);
  }

  if (lang && langMode === 'cookie') {
    cookies.push({ name: langKey, value: lang, url: opts.base });
  }

  if (storage.length) {
    await context.addInitScript(entries => {
      try {
        for (const [key, value] of entries) {
          localStorage.setItem(key, value);
        }
      } catch {}
    }, storage);
  }

  if (cookies.length) {
    await context.addCookies(cookies);
  }

  const switched = lang && langMode === 'visit' ? await switchLanguage(context, lang) : null;

  return { context, switched };
}

async function shoot (context, path, { theme, viewport, lang, switched }) {
  const page = await context.newPage();
  const errors = switched !== null && !switched.startsWith(lang) ? [`language switch left <html lang="${switched}">`] : [];

  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error' && keep(message.text())) {
      errors.push(`console: ${message.text()}`);
    }
  });
  page.on('requestfailed', request => {
    const text = `${request.url()} ${request.failure()?.errorText ?? ''}`;

    if (keep(text)) {
      errors.push(`requestfailed: ${text}`);
    }
  });

  const url = urlFor(path, lang);
  let status = null;

  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    status = response ? response.status() : null;
  } catch (error) {
    errors.push(`goto: ${firstLine(error)}`);
  }

  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(Number(opts.wait));

  const facts = await page.evaluate(() => ({
    landed: location.pathname + location.search + location.hash,
    lang: document.documentElement.lang,
    dir: document.documentElement.dir || getComputedStyle(document.documentElement).direction,
    darkClass: document.documentElement.classList.contains('dark'),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    textLength: document.body ? document.body.innerText.trim().length : 0
  })).catch(() => ({ landed: null, lang: null, dir: null, darkClass: null, overflow: null, textLength: 0 }));

  const name = `${slug(path)}-${viewport.name}-${theme}${lang ? `-${lang}` : ''}`;
  const shot = { url, status, ...facts, theme, viewport: viewport.name, lang: lang || facts.lang, file: join(out, `${name}.png`), errors };

  await page.screenshot({ path: shot.file, fullPage: true }).catch(error => errors.push(`screenshot: ${error.message}`));

  if (opts.print && viewport === viewports[0]) {
    shot.printFile = join(out, `${name}-print.png`);
    shot.pdfFile = join(out, `${name}.pdf`);
    await page.emulateMedia({ media: 'print' });
    await page.screenshot({ path: shot.printFile, fullPage: true }).catch(error => errors.push(`print screenshot: ${error.message}`));
    await page.pdf({ path: shot.pdfFile, format: 'A4', printBackground: true }).catch(error => errors.push(`pdf: ${error.message}`));
  }

  // Only a saved-choice app is known to use the class, so a missing one is flagged only then.
  const classBased = Boolean(opts.themeStorage || opts.themeCookie);
  const wrongTheme = (theme === 'light' && facts.darkClass) || (theme === 'dark' && classBased && facts.darkClass === false);
  const signedOut = facts.landed?.startsWith(opts.loginPath) && !path.startsWith(opts.loginPath);

  shot.problems = [
    ...(status && status >= 400 ? [`HTTP ${status}`] : []),
    ...(signedOut ? ['signed out'] : []),
    ...(wrongTheme ? [`theme ${theme} not applied`] : []),
    ...(lang && facts.lang && !facts.lang.startsWith(lang) ? [`html lang="${facts.lang}"`] : []),
    ...(lang && facts.dir && (facts.dir === 'rtl') !== rtlLangs.includes(lang) ? [`dir=${facts.dir}`] : []),
    ...(facts.overflow > 0 ? [`overflow ${facts.overflow}px`] : []),
    ...(!facts.textLength ? ['nothing rendered'] : []),
    ...(errors.length ? [`${errors.length} error(s)`] : [])
  ];

  await page.close();

  return shot;
}

const playwright = loadPlaywright();
const browser = await playwright.chromium.launch(opts.executable ? { executablePath: opts.executable } : {})
  .catch(error => fail(`could not start Chromium: ${error.message.split('\n')[0]}\nPass a preinstalled one with --executable (or CHROMIUM_PATH) rather than downloading browsers`));
const results = [];

try {
  for (const theme of themes) {
    for (const viewport of viewports) {
      for (const lang of langs) {
        const { context, switched } = await prepareContext(theme, viewport, lang);

        for (const path of paths) {
          results.push(await shoot(context, path, { theme, viewport, lang, switched }));
        }

        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}

writeFileSync(join(out, 'summary.json'), `${JSON.stringify(results, null, 2)}\n`);

for (const shot of results) {
  const flag = shot.problems.length ? `  << ${shot.problems.join(', ')}` : '';
  console.log(`${shot.status ?? '---'} ${shot.viewport.padEnd(8)} ${shot.theme.padEnd(5)} ${(shot.lang || '').padEnd(3)} ${shot.dir ?? ''} ${shot.url} -> ${shot.landed}${flag}`);

  for (const error of shot.errors) {
    console.log(`      ${error}`);
  }
}

console.log(`\n${results.length} shot(s) in ${out}. Now open and read every image.`);
process.exit(results.some(shot => shot.problems.length) ? 1 : 0);
