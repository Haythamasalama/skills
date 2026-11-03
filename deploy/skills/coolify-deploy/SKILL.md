---
name: coolify-deploy
description: Use when containerising a web app (a Vite or Vue SPA, a Nuxt app built static or as a Node server) and shipping it to Coolify — copy-ready Dockerfiles, nginx config, .dockerignore and a local compose file, the Coolify build pack, port, environment variables and health check, a smoke test of the running container, publishing content by redeploying, a CI job that builds and tests the image, and debugging a failed or broken deployment (blank page after deploy, 404 on deep links, redirects to the wrong port, "No available server", a build that fails at npm ci or at the type check). Triggers include deploy, publish, release, push it live, Dockerfile, nginx, «انشر الموقع», «النشر على Coolify», «صفحة بيضاء بعد النشر», «دوكر».
---

# Shipping a web app to Coolify

**Read when:** an app needs a Dockerfile, a first deploy to Coolify, a redeploy, or a broken deploy fixed.
**Owns:** the runtime shape, the image, the web server config, the Coolify settings, the container
checks and the deploy symptoms.

## TL;DR

- Pick the runtime shape first: **static** (nginx serves built files) or **server** (Node runs the
  app). Everything else follows from the table below.
- Ship with a **Dockerfile** in the repo. Why: a local `docker build`, CI and Coolify then run the
  same thing.
- The build script runs the type check before the bundler. Why: a malformed file then fails the
  image build instead of shipping a broken page.
- Test the **container**, not `npm run preview`: health route, a deep link, a retired-URL redirect,
  and `Cache-Control` on `index.html`. Why: all four live in the server config, so only the
  container can break them. `scripts/smoke.sh` checks them.
- `index.html` is never cached; hashed assets are cached for a year. Why: a cached `index.html`
  points at asset names the new build deleted, and returning visitors get a blank page.
- A history-mode SPA needs `try_files $uri $uri/ /index.html`. Why: without it every deep link 404s
  while the home page works.
- The health check runs **inside** the container, so the final image needs `curl` or `wget`.
- The app listens on `0.0.0.0`, on the port set in Coolify. Why: Coolify's proxy can't reach
  `127.0.0.1` inside the container.
- No secrets in the image: `.env` stays out of the build context; secrets are runtime variables.
- If Docker can't run where you are, say so. Never report a deploy as verified without the smoke
  test.

## Pick the shape

| App | Build command | Output | Runtime | Port | Health route |
|---|---|---|---|---|---|
| Vite SPA (Vue, React) | `npm run build` | `dist/` | nginx | 80 | nginx `location = /healthz` |
| Nuxt, prerendered | `nuxt generate` | `.output/public/` | nginx | 80 | nginx `location = /healthz` |
| Nuxt or Nitro, server | `nuxt build` | `.output/` (self-contained) | `node .output/server/index.mjs` | 3000 | `server/routes/healthz.ts` |

Pick **static** when every page can be built ahead of time and the app talks to APIs from the
browser. Pick **server** when pages need per-request data on the server, secrets on the server, or
server routes. A static app has no runtime variables and no secrets: everything is baked in at
build time.

Adding a backend of its own (accounts, a database, an admin) is a different deploy: a second
service, a database, secrets and migrations. Raise it as a decision before adding it.

## Ship flow

1. **Add the files** for your shape from [references/dockerfiles.md](references/dockerfiles.md):
   `Dockerfile`, `nginx.conf` and `security-headers.conf` (static only), `.dockerignore`,
   `docker-compose.yml` for local runs, and the health route.
2. **Make the build script type-check first**, for example
   `"build": "vue-tsc --build && vite build"` or `"build": "nuxi typecheck && nuxt build"`.
3. **Build locally:** `npm ci && npm run build`. If the change is visual, open every changed page in
   a browser, light and dark, desktop and phone width. A green build says nothing about looks.
4. **Run and smoke-test the container:**

   ```bash
   docker compose up --build -d          # maps 8080 on your machine to the container port
   WAIT=30 sh <skill>/scripts/smoke.sh http://localhost:8080 \
     /healthz=200 \
     /docs/getting-started=200 \
     /old-pricing=301:/pricing \
     'header /index.html cache-control no-cache' \
     'header /docs/getting-started cache-control no-cache' \
     'header /assets/<a-hashed-file>.js cache-control immutable'
   docker compose down
   ```

   For a Nuxt build, hashed files are under `/_nuxt/`, not `/assets/`. For a server app, drop the
   `index.html` header checks unless the server sets them.
5. **Create the app in Coolify** with the settings in [references/coolify.md](references/coolify.md):
   Dockerfile build pack, port, variables, domain.
6. **Push to the deployment branch.** Coolify rebuilds and redeploys. Content that lives in the repo ships the same way: a content change is a redeploy.
7. **Smoke-test the live URL** with the same command and the real domain (no `WAIT`).
8. **Add the CI job** from [references/debugging.md](references/debugging.md) so a broken image
   fails the pull request instead of the deploy.

### When Docker can't run here

A `docker build` that fails resolving the base image (blocked registry, a proxy, no daemon) is the
environment, not the Dockerfile. Say so, and check what you can. The step most likely to break the
image is a lockfile out of sync:

```bash
tmp=$(mktemp -d) && cp package.json package-lock.json "$tmp" && (cd "$tmp" && npm ci --ignore-scripts)
```

## Where each topic lives

| Topic | File |
|---|---|
| Dockerfile per shape, `nginx.conf`, security headers, `.dockerignore`, local compose, health route | [references/dockerfiles.md](references/dockerfiles.md) |
| Build packs, the settings for a new app, ports, build and runtime variables, health check behaviour, redeploys | [references/coolify.md](references/coolify.md) |
| Reading a broken deploy, the symptom → fix table, nginx pitfalls, the CI job | [references/debugging.md](references/debugging.md) |
| Container and live-URL checks | `scripts/smoke.sh` (usage in its header) |

## Done when

- [ ] The image builds from a clean checkout with `docker build .`.
- [ ] The build script type-checks before it bundles.
- [ ] `.dockerignore` keeps `node_modules`, build output and `.env*` out of the context.
- [ ] `smoke.sh` passes against the container: health, a deep link, each retired URL,
      `no-cache` on `index.html` and on a deep link, `immutable` on a hashed file.
- [ ] Coolify: Dockerfile build pack, the port matches the app, domain attached with TLS,
      secrets set as runtime-only variables.
- [ ] One health check is in charge (the image's `HEALTHCHECK` or Coolify's), and it passes.
- [ ] `smoke.sh` passes against the live domain.
- [ ] CI builds the image and runs `smoke.sh` on every pull request.
- [ ] Retired URLs are redirected on the server **and** in the client router.
