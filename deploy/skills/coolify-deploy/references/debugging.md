# Debugging deploys, and catching it in CI first

## Read the symptom in order

1. **Did the image build?** Coolify's deployment log. A failure at `npm ci` is the lockfile; a
   failure at the build step is usually the type check; a failure pulling an image is the registry
   or a `# syntax=` line.
2. **Is the container healthy?** An unhealthy container is removed from the proxy's routing, so
   the site answers 404 or "No available server" even though the app runs. Check the health check
   command works inside the image (`docker exec <id> wget -qO- http://127.0.0.1/healthz`), the port
   setting matches the port the app listens on, and the app binds to `0.0.0.0`.
3. **Does the home page work but nothing else?** The history fallback is missing.
4. **Does the page load blank only for some people?** A cached `index.html` pointing at asset
   names from the previous build. Look at `Cache-Control` on `index.html` and on a deep link.
5. **Are redirects going to the wrong port or host?** `absolute_redirect off` in nginx, or a
   framework building absolute URLs from its own listen port.
6. **Is one page missing images?** Content paths, not the deploy. Images that degrade to a
   fallback (an emoji, a placeholder) hide this, so compare the paths against `public/`.

## Symptom table

| Symptom | Cause | Fix |
|---|---|---|
| blank page after a deploy | cached `index.html` → old hashed asset names that no longer exist | `no-cache, must-revalidate` on `index.html` |
| deep links 404, home fine | the SPA history fallback is missing | `try_files $uri $uri/ /index.html;` |
| retired URL lands on the 404 view | the redirect exists only in the client router, or only on the server | keep it in both, assert it in CI |
| redirect goes to `http://host:80/…` | nginx made `Location` absolute with its listen port | `absolute_redirect off;` |
| "No available server" or 404 everywhere | container unhealthy: no curl/wget, wrong port or path, app on `127.0.0.1` | fix the check, the port, bind `0.0.0.0` |
| deploy succeeds, old version still served | a failing new container on a rolling update was removed; the old one stayed | read the new container's health and logs |
| build fails at `npm ci` | lockfile out of sync or not committed | `npm install`, commit the lockfile |
| build fails after a content edit | the type check caught malformed content | run the type check locally |
| build fails resolving `docker/dockerfile:1` | a `# syntax=` directive came back | delete it |
| build fails after a dependency bump | a toolchain pin was lifted (TypeScript beyond what the type checker supports) | restore the pin, read the changelog |
| security headers missing on cached paths | a location with its own `add_header` drops the inherited ones | include the headers snippet in that location |
| fonts not loading | a CSP without the font hosts | allow the stylesheet and font hosts |
| low-resolution image on one page | the high-resolution file is missing, so a fallback was used | add the file at the documented path |

## nginx pitfalls

- **`add_header` inheritance:** a `location` with any `add_header` of its own inherits none from
  `server`. Put shared headers in a snippet and include it wherever a location adds a header.
- **`#` starts a comment** in nginx config, and a URL fragment is never sent to the server. A
  redirect target can't carry `#section`; let the client router scroll after it boots.
- **Regex locations win over prefix locations.** Anchor every regex (`^…$`), and use exact `=`
  matches for redirects that sit next to a real folder of the same name.
- **`try_files … =404`** on asset folders, so a missing hashed file is a real 404 and not the app's
  HTML (which the browser would then try to run as JavaScript).
- **`absolute_redirect off`** whenever nginx sits behind a proxy or a port mapping.

## A CI job that runs these checks before Coolify does

Build the real image with plain `docker build` (what Coolify runs, and no third-party actions to
keep pinned), start it, and assert the things that only break in the container.

```yaml
# .github/workflows/ci.yml
name: ci
on:
  pull_request:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5          # pin the current major
      - uses: actions/setup-node@v5        # pin the current major
        with:
          node-version: 22
          cache: npm
      - run: npm ci                        # also catches a lockfile out of sync
      - run: npm run typecheck             # separate step: a bad content file is reported as such
      - run: npm run build-only

  container:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - run: docker build -t app .
      - run: docker run -d --name app -p 8080:80 app
      - run: |
          WAIT=30 bash scripts/smoke.sh http://localhost:8080 \
            /healthz=200 \
            /some/deep/link=200 \
            /retired-url=301:/new-url \
            'header /index.html cache-control no-cache'
      - if: failure()
        run: docker logs app
```

| Assertion | Guards against |
|---|---|
| `/healthz` is 200 | a broken image, or a container that never comes up |
| a deep link is 200 | a lost history fallback: home fine, every other link 404 |
| a retired URL is 301 to its target | links people were given breaking |
| `index.html` sends `no-cache` | returning visitors stuck on old asset names after a deploy |

Copy `scripts/smoke.sh` from this skill into the repo for the CI step.
