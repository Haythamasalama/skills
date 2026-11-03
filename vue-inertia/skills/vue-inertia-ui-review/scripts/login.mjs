#!/usr/bin/env node
// Signs in through the app's own login form and saves the browser state (cookies and localStorage)
// for shoot.mjs and for your own probe scripts.
//
//   UI_REVIEW_PASSWORD=password node login.mjs --base http://127.0.0.1:8000 --email test@example.com
//
// Options:
//   --out FILE            where to save the state (default: state.json). Keep it out of the repo.
//   --login-path PATH     the login page (default: /login)
//   --executable PATH     a preinstalled Chromium (or set CHROMIUM_PATH)
//
// The password comes from UI_REVIEW_PASSWORD so it stays out of shell history. Use a seeded local
// test user only. Exits 2 on bad usage, 1 when the sign-in fails.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const usage = 'usage: UI_REVIEW_PASSWORD=… node login.mjs --base <url> --email <email> [--out state.json] [--login-path /login]';

const opts = {
  base: '',
  email: '',
  out: 'state.json',
  loginPath: '/login',
  executable: process.env.CHROMIUM_PATH ?? '',
  help: false
};
const flags = new Set(['help']);

function fail (message) {
  console.error(message);
  process.exit(2);
}

function parseArgs (argv) {
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const key = arg.replace(/^--/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());

    if (!arg.startsWith('--') || !(key in opts)) {
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

const password = process.env.UI_REVIEW_PASSWORD ?? '';

if (!opts.base || !opts.email || !password) {
  fail(usage);
}

const playwright = loadPlaywright();
const browser = await playwright.chromium.launch(opts.executable ? { executablePath: opts.executable } : {})
  .catch(error => fail(`could not start Chromium: ${error.message.split('\n')[0]}\nPass a preinstalled one with --executable (or CHROMIUM_PATH) rather than downloading browsers`));
const context = await browser.newContext();
const page = await context.newPage();
const onLogin = () => new URL(page.url()).pathname.startsWith(opts.loginPath);
let exitCode = 0;

try {
  await page.goto(new URL(opts.loginPath, opts.base).href, { waitUntil: 'networkidle' });

  if (!onLogin()) {
    throw new Error(`${opts.loginPath} redirected to ${new URL(page.url()).pathname}: already signed in, or the wrong --login-path`);
  }

  const botCheck = await page.locator('.cf-turnstile, .g-recaptcha, .h-captcha, iframe[src*="challenges"], iframe[src*="recaptcha"], iframe[src*="hcaptcha"]').count();

  if (botCheck) {
    throw new Error('the login form shows a bot check. Turn it off for the local app (leave its keys empty in .env); never try to solve it');
  }

  // Inertia forms often bind with v-model and leave out `name`, so fall back to type, autocomplete and id.
  await page.locator('input[name="email"], input[type="email"], input[autocomplete="username"], input#email').first().fill(opts.email);
  await page.locator('input[name="password"], input[type="password"], input[autocomplete="current-password"], input#password').first().fill(password);
  await page.locator('form button[type="submit"], form [type="submit"]').first().click();
  await page.waitForURL(url => !url.pathname.startsWith(opts.loginPath), { timeout: 15000 }).catch(() => {});

  if (onLogin()) {
    const message = await page.locator('[role="alert"], [aria-invalid="true"] ~ *, [data-slot="field-error"]').first().textContent({ timeout: 1000 }).catch(() => '');
    throw new Error(`still on the login page${message ? ` ("${message.trim()}")` : ''}: check the seeded user exists and the password`);
  }

  await context.storageState({ path: opts.out });
  console.log(`signed in, landed on ${new URL(page.url()).pathname}, saved ${opts.out}`);
} catch (error) {
  console.error(error.message);
  exitCode = 1;
} finally {
  await browser.close();
}

process.exit(exitCode);
