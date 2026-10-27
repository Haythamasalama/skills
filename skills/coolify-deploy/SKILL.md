---
name: coolify-deploy
description: Use when containerising a web app (a Vite or Vue SPA, a Nuxt or Node app built static or SSR) and shipping it to Coolify — writing the Dockerfile and nginx config, verifying the Docker build and the running container locally, setting the Coolify build pack, port, health check and environment variables, publishing content by redeploying, and debugging a failed or broken deployment (blank page after deploy, 404 on deep links, wrong redirects, "No available server", a build that fails at npm ci or at the type check). Triggers include deploy, publish, release, push it live, «انشر الموقع», «النشر على Coolify», «صفحة بيضاء بعد النشر», «دوكر».
---

# Shipping a web app to Coolify

From a green local build to a container Coolify runs, and back again when something breaks. The
rules come from shipping a static Vue site through nginx on Coolify; the Node/SSR parts follow the
same checks. Coolify facts were checked against its docs on 2026-10-28.

## TL;DR

- Decide the runtime shape first: **static** (nginx serves files) or **SSR** (a Node server).
- The build runs the type check first, so a bad content file fails the image build instead of
  shipping a broken page. Fix a failing build locally before pushing.
- Verify the **container**, not only `npm run preview`: health route, a deep link, any retired-URL
  redirect, and `Cache-Control` on `index.html`. `scripts/smoke.sh` does all four.
- `index.html` is never cached; hashed assets are cached for a year. Get this wrong and returning
  visitors see a blank page after every deploy.
- A history-mode SPA needs the server fallback (`try_files $uri $uri/ /index.html`), or every deep
  link 404s while the home page works.
- In Coolify, the port is the container's port (80 for nginx, 3000 for a Node server), and the
  health check runs **inside** the container: the image needs `curl` or `wget`.
- When the content lives in the bundle, publishing content is a redeploy. Push to the deployment
  branch.
- If Docker can't run where you are, say so plainly. Don't report a deploy as verified.

## Pick the shape

| App | Build | Output | Runtime | Port | Health route |
|---|---|---|---|---|---|
| Vite SPA (Vue, React) | `npm run build` | `dist/` | nginx | 80 | nginx `location = /healthz` |
| Nuxt, prerendered | `nuxt generate` | `.output/public` (`dist` links to it) | nginx | 80 | nginx `location = /healthz` |
| Nuxt / Nitro, server | `nuxt build` | `.output/` (self-contained) | `node .output/server/index.mjs` | 3000 | a `server/routes/healthz.ts` route |

Dockerfiles, `nginx.conf`, `.dockerignore` and compose files for each:
[references/dockerfiles.md](references/dockerfiles.md).

A static app has no runtime environment variables and no secrets: everything is baked at build
time. Adding a backend (accounts, progress across devices, an admin for content) changes all of
this: a second service, a database, secrets, migrations. Raise it as a decision before bolting a
fetch onto the client.

## Before shipping anything

```bash
npm run build      # with the type check first, e.g. vue-tsc --build && vite build
```

If the change was visual or touched content, check it in a real browser too (`ui-review`). A green
build says nothing about whether the page looks right.

## Verify the container

```bash
docker compose up --build -d          # maps 8080:80 for local use only
WAIT=30 bash <skill>/scripts/smoke.sh http://localhost:8080 \
  /healthz=200 \
  /some/deep/link=200 \
  /retired-url=301:/new-url \
  'header /index.html cache-control no-cache' \
  'header /assets/<a-hashed-file>.js cache-control immutable'
docker compose down
```

These break only in the container, never in `npm run preview`: the history fallback, the redirects
and the cache headers live in the web server config.

**When Docker can't run here** (the registry is blocked by a proxy, no daemon): a `docker build`
that fails resolving the base image is the environment, not the Dockerfile. Say so, and verify what
you can instead. The step most likely to break the image is a lockfile out of sync:

```bash
tmp=$(mktemp -d) && cp package.json package-lock.json "$tmp" && (cd "$tmp" && npm ci --ignore-scripts)
```

## Shipping

Push to the branch the Coolify app deploys from; Coolify rebuilds. With no CMS and no content API,
content changes ship the same way.

Coolify settings for a new application (already set on an existing one):

| Setting | Static (nginx) | SSR (Node) |
|---|---|---|
| Build pack | `Dockerfile` | `Dockerfile` (or Nixpacks with `node .output/server/index.mjs` as start command) |
| Port the app listens on | `80` | `3000` |
| Health check | from the Dockerfile `HEALTHCHECK`, or HTTP `/healthz` | same |
| Environment variables | none | runtime config only; build-time values must be available to the build |
| Domain | attach, enable TLS | same |

Coolify's build packs (checked 2026-10-28): Nixpacks, Railpack (beta), Static, Dockerfile, Docker
Compose. A Dockerfile in the repo is the most predictable: CI and a local `docker build` run the
same thing.

### Health checks in Coolify (checked 2026-10-28)

- Dashboard HTTP checks run **inside** the container with `curl` or `wget`. The final image must
  contain one; installing it on the server doesn't help. Alpine images have `wget` through busybox;
  slim Debian images have neither.
- For a Dockerfile app, a `HEALTHCHECK` in the image **takes precedence** over the dashboard check.
  To use Coolify's check instead, remove the instruction and redeploy.
- The generated HTTP check uses only the exit status of curl or wget; the "expected code" and
  "expected text" fields are not compared.
- With Coolify's proxy (Traefik), an unhealthy container is removed from routing. If every container
  is unhealthy, visitors get a 404 or "No available server".
- On a rolling update Coolify waits for the new container to pass before removing the old one, and
  removes a replacement that fails.
- A start period gives a slow app time before failures count.

## Debugging a broken deploy

| Symptom | Likely cause | Fix |
|---|---|---|
| blank page after a deploy | the browser cached `index.html`, which points at the previous build's hashed files | `Cache-Control: no-cache, must-revalidate` on `location = /index.html` |
| home works, deep links 404 | the SPA history fallback is gone | `try_files $uri $uri/ /index.html;` in `location /` |
| redirect sends people to `:80` | nginx made the `Location` absolute with its own listen port | `absolute_redirect off;` |
| "No available server" or 404 on every path | health check failing (no curl/wget, wrong port, wrong path) or the app listens on `127.0.0.1` | check the container's health, the port setting, and bind to `0.0.0.0` |
| image build fails at `npm ci` | lockfile out of sync with `package.json`, or not committed | `npm install`, commit the lockfile |
| image build fails after a content edit | the type check caught a malformed content file | run the type check locally and fix it |
| image build fails resolving `docker/dockerfile:1` | a `# syntax=` line was added back | remove it: an extra registry pull for no gain |
| images missing on one page | wrong path in the content file | compare paths with `public/` |
| fonts not loading | a Content-Security-Policy blocks the font host | allow its stylesheet and font hosts |
| security headers missing on some paths | an `add_header` inside a `location` drops every `add_header` inherited from `server` | repeat them in that location, or use an include |

More detail, nginx pitfalls and a CI job that runs these checks before Coolify does:
[references/debugging.md](references/debugging.md).

## Things not to change

- `try_files $uri $uri/ /index.html` in `nginx.conf`. Every deep link depends on it.
- `no-cache` on `index.html`. Without it, deploys don't reach returning visitors.
- No `# syntax=` line in the Dockerfile.
- A TypeScript pin the type checker needs. In 2026-09, `vue-tsc` could not run against
  TypeScript 7.x, so `typescript` stayed on `^5.9`; bumping it broke the type check, the build and
  the image. Re-check before lifting the pin.
- Redirects for URLs people were given: keep them in **both** the client router and the server
  config, and let CI assert them.
