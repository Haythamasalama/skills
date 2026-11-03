# Coolify settings

**Read when:** creating the app in Coolify, changing its port, variables, domain or health check,
or publishing a change.
**Owns:** build packs, the settings for a new app, ports, build-time and runtime variables, health
check behaviour, and redeploys.

## TL;DR

- Build pack: **Dockerfile**. Port: the one the container listens on (80 nginx, 3000 Node).
- Each variable is either build time, runtime, or both. Secrets are runtime only.
- One health check is in charge: an image `HEALTHCHECK` wins over the dashboard check.
- An unhealthy container gets no traffic, so a broken check looks like a broken site.
- Publishing is a push to the deployment branch; Coolify rebuilds and redeploys.

## Build packs (checked 2026-11-03)

Coolify offers Nixpacks, Railpack (beta), Static, Dockerfile and Docker Compose.

| Build pack | Use it when |
|---|---|
| **Dockerfile** | default for this skill: the image is defined in the repo and runs the same locally, in CI and in Coolify |
| Static | the repo already holds finished files and you accept Coolify's web server settings instead of your `nginx.conf` |
| Nixpacks | you want auto-detection. Coolify's Nuxt guide uses it with the start command `node .output/server/index.mjs` for a server build, or site type Static with output directory `dist` for `nuxt generate` |
| Docker Compose | more than one service (an app plus its own database or worker) |
| Railpack | not for production while marked beta |

Why Dockerfile: the history fallback, redirects and cache headers live in your `nginx.conf`, and the
smoke test in CI checks the same image Coolify runs.

## Settings for a new app

| Setting (Coolify name) | Static (nginx) | Server (Node) |
|---|---|---|
| Build pack | Dockerfile | Dockerfile |
| Base Directory | `/` (the folder used as build context) | same |
| Dockerfile Location | `/Dockerfile` (relative to Base Directory) | same |
| Ports Exposes | `80` | `3000` |
| Variables | build-time only (`VITE_*`) | runtime config and secrets; build-time values the build reads |
| Healthcheck | from the image `HEALTHCHECK` | same |
| Domains | your domain, `https://` so Coolify issues the certificate | same |
| Deployment branch | the branch you push to publish | same |

**Ports Exposes** is the internal port the process listens on; Coolify fills it from the first
`EXPOSE` in the Dockerfile, or `80` (checked 2026-11-03). Leave port mappings empty: the proxy
reaches the container on its internal network, and a mapping only opens the port on the server.

If the domain shows nothing after a successful build: Ports Exposes must match the listening port,
the app must listen on `0.0.0.0`, then read the runtime logs and the health status.

## Variables (checked 2026-11-03)

Each variable has two settings: **Build time** ("Available during build") and **Runtime**
("Available in the container"). Both are on by default.

| Variable kind | Build time | Runtime | Example |
|---|---|---|---|
| Public value baked into the bundle | on | off | `VITE_API_URL`, `NUXT_PUBLIC_*` read while prerendering |
| Server config read at start-up | off | on | `NUXT_PUBLIC_*` and `NUXT_*` for a Nuxt server |
| Secret | off | on | API keys, database passwords |

- A Dockerfile build sees a build-time variable only if the Dockerfile declares `ARG NAME` before
  the step that reads it.
- Build arguments can show up in image metadata. For a secret the build itself needs, set
  **Build secrets** to "Docker BuildKit secrets".
- Coolify sets `PORT` (the first exposed port) and `HOST` (`0.0.0.0`) when you don't, plus
  `COOLIFY_FQDN`, `COOLIFY_URL`, `COOLIFY_BRANCH` and `SOURCE_COMMIT`.
- `SOURCE_COMMIT` is kept out of the build by default so the build cache is reused. To stamp the
  commit into the bundle, set **Advanced > Build > Source commit availability** to
  "Available during build".
- Changing a build-time variable needs a redeploy; a static app has no runtime to read it.

## Health checks (checked 2026-11-03)

- Checks run **inside** the container. Dashboard HTTP checks call `curl` or `wget` there, so the
  final image must contain one; installing it on the server does not count. Alpine images have
  `wget` through busybox; slim Debian images have neither.
- For a Dockerfile app, an image `HEALTHCHECK` **takes precedence**: Coolify skips the dashboard
  check. To use the dashboard check, remove the instruction and redeploy.
- The dashboard HTTP check uses only the exit status of `curl`/`wget`. The "Expected code" and
  "Expected response text" fields are shown but not compared.
- With the Traefik proxy, an unhealthy container is taken out of routing. When every container is
  unhealthy, visitors get a 404 or "No available server".
- On a redeploy, Coolify waits for the new container to pass before removing the old one, and can
  remove a new container that fails and keep the old one running.
- **Start period**: failures in this window don't count. Make it longer than the app's start-up.
- Docker Compose build pack: the dashboard health check page doesn't apply. A service's
  `healthcheck` in the compose file overrides the image `HEALTHCHECK`; leave it out to inherit it.

## Publishing

- Push to the deployment branch. Coolify pulls, builds the image, starts it, and swaps it in when
  it is healthy.
- Content stored in the repo (Markdown, JSON, images in `public/`) ships the same way. There is no
  separate publish step, so a content change goes through the same build and CI as code.
- After every deploy, run `scripts/smoke.sh` against the live domain.
- To roll back, revert the commit and push, rather than editing the running container. Why: the
  next deploy rebuilds the image from the repo and loses any edit made inside the container.
