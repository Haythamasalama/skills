#!/usr/bin/env node
// Screenshot pages in a real browser: every path × viewport × theme × language,
// with page errors, console errors, failed requests and horizontal overflow
// reported per shot. Writes PNGs and summary.json to --out.
//
//   node shoot.mjs --base http://127.0.0.1:4173 / /about /pricing
//   node shoot.mjs --base http://127.0.0.1:4173 --langs en,ar --lang-via prefix / /about
//   node shoot.mjs --base … --langs en,ar --lang-via storage:locale --theme-storage theme /
//   node shoot.mjs --base … --print /invoice/1    # also a print-media screenshot and a PDF
//
// Options (all optional except --base):
//   --out DIR               output folder (default: shots). Keep it out of the repo.
//   --themes light,dark     colour schemes to emulate
//   --viewports desktop=1280x900,mobile=390x844[,tv=1920x1080]
//   --langs en,ar           languages to shoot; omit for one pass
//   --lang-via MODE         prefix (/ar/about) · query:<param> · storage:<key> · cookie:<name>
//   --theme-storage KEY     also write the theme to localStorage[KEY], for apps that ignore
//                           prefers-color-scheme once a choice is saved
//   --ignore REGEX          console/request errors to ignore (e.g. a font host the sandbox blocks)
//   --wait MS               extra settle time after load (default 300)
//   --executable PATH       a preinstalled Chromium (or set CHROMIUM_PATH)
//   --print                 also emulate print: a screenshot and an A4 PDF per path
//
// Needs `playwright` or `playwright-core` resolvable from the current directory:
//   npm i -D playwright-core --no-save
// Exits 1 when any shot has an error, a 4xx/5xx status, overflow, or an empty body.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const opts = {
  base: '',
  out: 'shots',
  themes: 'light,dark',
  viewports: 'desktop=1280x900,mobile=390x844',
  langs: '',
  langVia: 'prefix',
  themeStorage: '',
  ignore: '',
  wait: '300',
  executable: process.env.CHROMIUM_PATH ?? '',
  print: false
};
const paths = [];
const argv = process.argv.slice(2);

for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];

  if (!arg.startsWith('--')) {
    paths.push(arg);
    continue;
  }

  const key = arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());

  if (!(key in opts)) {
    console.error(`unknown option ${arg}`);
    process.exit(2);
  }

  if (key === 'print') {
    opts.print = true;
    continue;
  }

  opts[key] = argv[++i] ?? '';
}

if (!opts.base || paths.length === 0) {
  console.error('usage: node shoot.mjs --base <url> [options] <path> [<path> …]');
  process.exit(2);
}

const require = createRequire(join(process.cwd(), 'noop.js'));
let playwright;

for (const name of ['playwright', 'playwright-core']) {
  try {
    playwright = require(name);
    break;
  } catch {
    // try the next one
  }
}

if (!playwright) {
  console.error('playwright not found from this directory. Run: npm i -D playwright-core --no-save');
  process.exit(2);
}

const list = value => value.split(',').map(item => item.trim()).filter(Boolean);
const themes = list(opts.themes);
const langs = opts.langs ? list(opts.langs) : [''];
const viewports = list(opts.viewports).map(entry => {
  const [name, size] = entry.split('=');
  const [width, height] = size.split('x').map(Number);

  return { name, width, height };
});
const ignore = opts.ignore ? new RegExp(opts.ignore) : null;
const [langMode, langKey] = opts.langVia.split(':');
const out = resolve(opts.out);

mkdirSync(out, { recursive: true });

function urlFor (path, lang) {
  const url = new URL(path, opts.base);

  if (lang && langMode === 'prefix') {
    url.pathname = `/${lang}${url.pathname === '/' ? '' : url.pathname}`;
  }

  if (lang && langMode === 'query') {
    url.searchParams.set(langKey || 'lang', lang);
  }

  return url.href;
}

const slug = path => (path === '/' ? 'home' : path.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '-'));

const browser = await playwright.chromium.launch(opts.executable ? { executablePath: opts.executable } : {});
const results = [];

for (const theme of themes) {
  for (const viewport of viewports) {
    for (const lang of langs) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        colorScheme: theme
      });
      const storage = [];

      if (opts.themeStorage) {
        storage.push([opts.themeStorage, theme]);
      }

      if (lang && langMode === 'storage') {
        storage.push([langKey || 'locale', lang]);
      }

      if (storage.length) {
        await context.addInitScript(entries => {
          for (const [key, value] of entries) {
            localStorage.setItem(key, value);
          }
        }, storage);
      }

      if (lang && langMode === 'cookie') {
        await context.addCookies([{ name: langKey || 'locale', value: lang, url: opts.base }]);
      }

      for (const path of paths) {
        const page = await context.newPage();
        const errors = [];
        const keep = text => !(ignore && ignore.test(text));

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
          errors.push(`goto: ${error.message}`);
        }

        await page.evaluate(() => (document.fonts ? document.fonts.ready.then(() => true) : true)).catch(() => {});
        await page.waitForTimeout(Number(opts.wait));

        const facts = await page.evaluate(() => ({
          landed: location.pathname + location.search + location.hash,
          lang: document.documentElement.lang,
          dir: document.documentElement.dir || getComputedStyle(document.documentElement).direction,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          textLength: document.body ? document.body.innerText.length : 0
        })).catch(() => ({ landed: null, lang: null, dir: null, overflow: null, textLength: 0 }));

        const name = `${slug(path)}-${viewport.name}-${theme}${lang ? `-${lang}` : ''}`;
        const file = join(out, `${name}.png`);
        await page.screenshot({ path: file, fullPage: true }).catch(error => errors.push(`screenshot: ${error.message}`));

        const shot = { url, status, ...facts, theme, viewport: viewport.name, lang: lang || facts.lang, file, errors };

        if (opts.print && viewport === viewports[0]) {
          await page.emulateMedia({ media: 'print' });
          shot.printFile = join(out, `${name}-print.png`);
          shot.pdfFile = join(out, `${name}.pdf`);
          await page.screenshot({ path: shot.printFile, fullPage: true }).catch(error => errors.push(`print screenshot: ${error.message}`));
          await page.pdf({ path: shot.pdfFile, format: 'A4', printBackground: true }).catch(error => errors.push(`pdf: ${error.message}`));
        }

        const rtl = ['ar', 'he', 'fa', 'ur'].includes(lang);

        shot.problems = [
          ...(status && status >= 400 ? [`HTTP ${status}`] : []),
          ...(lang && facts.lang && !facts.lang.startsWith(lang) ? [`html lang="${facts.lang}"`] : []),
          ...(lang && facts.dir && (facts.dir === 'rtl') !== rtl ? [`dir=${facts.dir}`] : []),
          ...(facts.overflow > 0 ? [`overflow ${facts.overflow}px`] : []),
          ...(!facts.textLength ? ['nothing rendered'] : []),
          ...(errors.length ? [`${errors.length} error(s)`] : [])
        ];

        results.push(shot);
        await page.close();
      }

      await context.close();
    }
  }
}

await browser.close();
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
