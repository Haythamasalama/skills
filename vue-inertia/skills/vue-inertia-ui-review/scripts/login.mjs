#!/usr/bin/env node
// Signs in to a Laravel app through its login form and saves the session cookies for shoot.mjs.
//
//   UI_REVIEW_PASSWORD=password node login.mjs --base http://127.0.0.1:8000 --email test@example.com --out /tmp/state.json
//
// Options: --login-path (default /login), --executable PATH (or CHROMIUM_PATH).
// Use a seeded local test user only. The password comes from the environment so it stays out of
// shell history and of the saved command.
import { createRequire } from 'node:module';
import { join } from 'node:path';

const opts = { base: '', email: '', out: 'state.json', loginPath: '/login', executable: process.env.CHROMIUM_PATH ?? '' };
const argv = process.argv.slice(2);

for (let i = 0; i < argv.length; i++) {
  const key = argv[i].replace(/^--/, '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());

  if (!(key in opts)) {
    console.error(`unknown option ${argv[i]}`);
    process.exit(2);
  }

  opts[key] = argv[++i] ?? '';
}

const password = process.env.UI_REVIEW_PASSWORD ?? '';

if (!opts.base || !opts.email || !password) {
  console.error('usage: UI_REVIEW_PASSWORD=… node login.mjs --base <url> --email <email> [--out state.json]');
  process.exit(2);
}

const require = createRequire(join(process.cwd(), 'noop.js'));
let playwright;

for (const name of ['playwright', 'playwright-core']) {
  try {
    playwright = require(name);
    break;
  } catch {}
}

if (!playwright) {
  console.error('playwright-core not found: npm i -D playwright-core --no-save');
  process.exit(2);
}

const browser = await playwright.chromium.launch(opts.executable ? { executablePath: opts.executable } : {});
const context = await browser.newContext();
const page = await context.newPage();

await page.goto(new URL(opts.loginPath, opts.base).href, { waitUntil: 'networkidle' });
await page.locator('input[name="email"], input[type="email"]').first().fill(opts.email);
await page.locator('input[name="password"], input[type="password"]').first().fill(password);
await page.locator('form button[type="submit"]').first().click();
await page.waitForURL(url => !url.pathname.startsWith(opts.loginPath), { timeout: 15000 }).catch(() => {});

if (new URL(page.url()).pathname.startsWith(opts.loginPath)) {
  console.error('still on the login page: check the user exists (php artisan db:seed) and the password');
  await browser.close();
  process.exit(1);
}

await context.storageState({ path: opts.out });
console.log(`signed in, landed on ${new URL(page.url()).pathname}, saved ${opts.out}`);
await browser.close();
