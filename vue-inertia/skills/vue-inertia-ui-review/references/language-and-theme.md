# Language and theme

**Read when:** shooting more than one language or both themes, or a run shows the same language or
theme in every image.
**Owns:** finding where the app keeps its language and theme, picking the matching `shoot.mjs`
option, and the traps of each storage.

## TL;DR

- Read the code first: the middleware that calls `setLocale`, and the composable that writes the theme.
- A language kept in the **session** or set by the **server** can only be changed by a request:
  `--lang-via visit:<the app's switch route>`.
- A cookie you set from outside reaches the app only when it is **excepted from encryption**.
  Otherwise Laravel drops it and the app quietly falls back to its default language.
- A saved theme beats `prefers-color-scheme`. When the app saves one, pass `--theme-storage`, and
  `--theme-cookie` when the server reads it.
- Confirm the result in `summary.json` (`lang`, `dir`, `darkClass`) and in the images, not by trust.

## Finding where the language lives

```bash
grep -rn "setLocale" app/ src/ 2>/dev/null                      # the middleware that applies it
grep -rn "locale" routes/ src/*/Routes 2>/dev/null | grep -i "get\|prefix"   # the switch route or prefix
grep -n "encryptCookies" bootstrap/app.php                       # cookies that stay unencrypted
```

Read the middleware. It reads the locale from one of these, and that decides the option:

| It reads… | Typical code | `shoot.mjs` option |
|---|---|---|
| the session | `$request->session()->get('locale')` | `visit:/locale/{lang}` |
| a cookie set by the server (encrypted) | `$request->cookie('locale')` | `visit:` the route that sets it |
| a cookie excepted from encryption | `encryptCookies(except: ['locale'])` | `cookie:locale` |
| the URL | a route group with prefix `{locale}` or `ar` | `prefix` |
| a query parameter | `$request->query('lang')` | `query:lang` |
| a column on the user | `$request->user()->locale` | one run per language, see below |
| nothing on the server (client-only i18n) | `localStorage.getItem('locale')` | `storage:locale` |

An app can mix them: a public site on a URL prefix and a signed-in panel that is one language only,
or kept in the session. Shoot each part with its own option.

### Session

The switch route usually looks like `GET /locale/{locale}` → `session(['locale' => …])` →
`back()`. It sits behind the login, so sign in first.

- `visit:` opens the route at the start of each pass (theme × viewport × language), then shoots.
  It must repeat it: every pass that uses one state file shares **one session**, so the last switch
  wins for all of them.
- For the same reason, never run two `shoot.mjs` runs with the same state file at once, and expect
  the session to stay in the last language after a run.
- Saving one state file per language does not work for a session locale: both files hold the same
  session cookie. Sign in twice if you need two independent sessions.
- A route with no `{lang}` that flips between two languages is fine: `visit:/lang-toggle` opens it
  until `<html lang>` matches, at most twice.

### Cookies and encryption

Laravel encrypts every cookie it sets and decrypts every cookie it receives. A plain value set by a
test script fails to decrypt and is dropped, so the app falls back to its default language and the
run shoots it twice. `cookie:<name>` works only when:

- the name is listed in `encryptCookies(except: [...])` in `bootstrap/app.php` (Laravel 11 and later),
  or in the `$except` array of `App\Http\Middleware\EncryptCookies` (older apps); or
- the app reads `$_COOKIE` directly, which bypasses the middleware.

Otherwise use `visit:` with the route that sets the cookie.

### A column on the user

The language belongs to the account, so every context and every session shares it. Change it
between runs with the app's own settings screen, or locally with tinker, then shoot again:

```bash
php artisan tinker --execute "App\Models\User::where('email', 'test@example.com')->update(['locale' => 'ar'])"
```

### Checking it worked

`shoot.mjs` flags a `<html lang>` that does not start with the requested language, a `dir` that is
not `rtl` for `ar`, `he`, `fa`, `ur`, and a switch route that left the wrong language. If every shot
of a pass is flagged, the option is wrong, not the pages.

## Finding where the theme lives

```bash
grep -rn "localStorage\|document.cookie" resources/js --include='*.ts' --include='*.vue' | grep -iv test
grep -rn "dark" resources/views/*.blade.php                     # the inline script or class on <html>
```

Three shapes are common (checked 2026-11-03):

| Shape | What decides the first paint | Options |
|---|---|---|
| System only | `prefers-color-scheme` | none: the emulation is enough |
| Saved in localStorage | an inline script in the root Blade view reads the key before the bundle | `--theme-storage <key>` |
| localStorage and a cookie | the server reads the cookie and renders `class="dark"`; the bundle reads localStorage | `--theme-storage <key> --theme-cookie <name>` |

- Laravel's Vue starter kit uses `appearance` for both the key and the cookie, with the values
  `light`, `dark` and `system`, and excepts the cookie from encryption (checked 2026-11-03).
- An app may **default to one theme** instead of `system`. Then emulation alone shoots the default
  twice. When the app has a key, always pass it.
- `shoot.mjs` writes the theme name it is shooting (`light` or `dark`) as the value. If the app uses
  other values, set them in a probe script instead.
- The `dark` class on `<html>` must be right on the first paint, not only after the bundle runs. A
  flash of the light theme on a dark reload means the inline script or the cookie is missing.
- `darkClass` in `summary.json` records the class. A light shot with the class is always wrong; a
  dark shot without it is flagged only when you passed a theme key, because an app may style dark
  mode from the media query alone.

## Switching inside a probe script

When a check needs the switch itself (the menu, the toggle), do it the way a user does:

```js
await page.getByRole('button', { name: /language|اللغة/i }).click();
await page.getByRole('menuitem', { name: 'العربية' }).click();
await page.waitForLoadState('networkidle');
console.log(await page.evaluate(() => [document.documentElement.lang, document.documentElement.dir]));
```

A language switch is usually a full page load, because translations and direction change with it.
A theme switch is not: check that the `dark` class and the saved key both change, then reload and
check that the choice survived.
