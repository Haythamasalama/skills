# Debugging deploys, and catching them in CI first

**Read when:** a build or deploy fails, the live site misbehaves, or the repo has no CI job for the
image yet.
**Owns:** the order to read a broken deploy, the symptom → fix table, nginx pitfalls, and the CI
job.

## TL;DR

- Read in order: did the image build, is the container healthy, then routing and caching.
- Every symptom has one row in the table below.
- Most deploy-only failures are nginx config: inherited headers, regex order, absolute redirects.
- CI builds the real image with `docker build`, runs it and runs `scripts/smoke.sh`, so a broken
  image fails the pull request.

## Read the symptom in order

1. **Did the image build?** Coolify's deployment log. A failure at `npm ci` is the lockfile; at the
   build step, usually the type check; while pulling an image, the registry or a `# syntax=` line.
2. **Is the container healthy?** Run the check by hand inside it:
   `docker exec <container> wget -qO- http://127.0.0.1/healthz` (add `:3000` for a server app).
   Then compare Ports Exposes with the port the app listens on, and confirm it binds `0.0.0.0`.
3. **Does the home page work but nothing else?** The history fallback.
4. **Is the page blank only for some visitors?** A cached `index.html`. Check `Cache-Control` on
   `/index.html` and on a deep link.
5. **Do redirects go to the wrong port or host?** Absolute redirects (see the pitfalls).
6. **Is one page missing images?** The paths in the content, not the deploy. Compare them with
   `public/`; a placeholder or fallback image can hide a wrong path.

## Symptom table

| Symptom | Cause | Fix |
|---|---|---|
| blank page after a deploy | cached `index.html` points at hashed files the new build removed | `Cache-Control: no-cache, must-revalidate` on `location = /index.html` |
| home works, deep links 404 | the SPA history fallback is missing | `try_files $uri $uri/ /index.html;` in `location /` |
| retired URL lands on the app's 404 view | the redirect exists only in the client router, or only on the server | keep it in both; assert it in the smoke test |
| redirect goes to `http://host:80/…` | nginx built an absolute `Location` with its own listen port | `absolute_redirect off;` |
| "No available server", or 404 on every path | container unhealthy: no curl/wget in the image, wrong port or path, app on `127.0.0.1` | fix the check, Ports Exposes, bind `0.0.0.0` |
| deploy "succeeds", old version still served | the new container failed its health check and was removed; the old one stayed | read the new container's logs and health |
| domain shows nothing after a green build | Ports Exposes doesn't match the listening port | set it to 80 (nginx) or 3000 (Node) |
| build fails at `npm ci` | lockfile out of sync with `package.json`, or not committed | `npm install`, commit the lockfile |
| build fails after a content or code edit | the type check caught it | run `npm run build` locally and fix the reported file |
| build fails after a TypeScript bump | the type checker (`vue-tsc`, `nuxi typecheck`) doesn't support the new TypeScript major yet | pin `typescript` to the last supported major until its changelog says otherwise |
| build fails resolving `docker/dockerfile:1` | a `# syntax=` line was added | delete it |
| a `VITE_*` value is empty in production | the variable isn't build-time, or the Dockerfile has no `ARG` for it | mark it build time, add `ARG NAME` before the build step, redeploy |
| a secret is visible in the bundle or image | it was a build-time `VITE_*`/`NUXT_PUBLIC_*` value or a copied `.env` | move it to a runtime-only server variable, rotate it, check `.dockerignore` |
| security headers missing on some paths | a `location` with its own `add_header` drops the inherited ones | include the headers snippet in that location |
| fonts or scripts from another host blocked | a Content-Security-Policy without those hosts | add the stylesheet and file hosts |
| a hashed `.js` file returns HTML | an asset folder falls back to the app | `try_files $uri =404;` in the asset location |

## nginx pitfalls

- **`add_header` inheritance:** a `location` with any `add_header` of its own inherits none from
  `server`. Shared headers go in a snippet that every such location includes.
- **`#` starts a comment** in nginx config, and a browser never sends the URL fragment. A redirect
  target can't carry `#section`; let the client router scroll after it loads.
- **Regex locations are checked before prefix locations.** Anchor every regex (`^…$`) and use exact
  `=` matches for redirects, so a redirect never shadows a real folder (`= /pricing` against
  `/pricing/`).
- **`try_files … =404`** on asset folders, so a missing hashed file is a real 404 and not the app's
  HTML, which the browser would then try to run as JavaScript.
- **`absolute_redirect off`** whenever nginx sits behind a proxy or a port mapping: nginx otherwise
  writes its own listen port (80) into `Location`, not the port the visitor used. A relative
  `Location` is resolved by the browser against the URL it actually requested.

## CI job: build the image and smoke-test it

Plain `docker build` builds what Coolify builds, with no third-party build actions to keep pinned.
Copy `scripts/smoke.sh` from this skill to `scripts/smoke.sh` in the app repo.

```yaml
# .github/workflows/image.yml
name: image
on:
  pull_request:
  push:
    branches: [main]

jobs:
  container:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - run: docker build -t app .
      - run: docker run -d --name app -p 8080:80 app
      - run: |
          WAIT=30 sh scripts/smoke.sh http://localhost:8080 \
            /healthz=200 \
            /docs/getting-started=200 \
            /old-pricing=301:/pricing \
            'header /index.html cache-control no-cache' \
            'header /docs/getting-started cache-control no-cache'
      - if: failure()
        run: docker logs app
```

`actions/checkout` v7 is the current major (checked 2026-11-03). For a server app, run with
`-p 8080:3000`. `docker build` runs `npm ci` and `npm run build`, so a stale lockfile and type
errors fail here too; no separate Node job is needed.

| Assertion | Guards against |
|---|---|
| `/healthz` is 200 | a broken image, or a container that never starts |
| a deep link is 200 | a lost history fallback |
| a retired URL is 301 to its target | links people were given breaking |
| `index.html` and a deep link send `no-cache` | returning visitors stuck on the previous build |
