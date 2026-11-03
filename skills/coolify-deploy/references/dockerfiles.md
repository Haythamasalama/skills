# Dockerfiles and server config

**Read when:** adding a Dockerfile, `nginx.conf`, `.dockerignore` or a local compose file to an app.
**Owns:** the copy-ready files for each runtime shape, and the health route.

## TL;DR

- Two stages: build with Node, then copy only the output into a small runtime image.
- Copy `package.json` and the lockfile before the source, so the `npm ci` layer is reused when only
  code changes.
- No `# syntax=` line. Why: it makes every build pull an extra frontend image from the registry for
  no gain with these files, and a blocked registry then fails the build.
- `npm ci` needs a committed lockfile in sync with `package.json`.
- Every image ships a `HEALTHCHECK` that calls `/healthz` with `wget`, which Alpine images carry
  through busybox. How Coolify treats it: [coolify.md](coolify.md).

## Base images (checked 2026-11-03)

| Image | Tag used here | Why |
|---|---|---|
| Node | `node:26-alpine` | 26 is the Active LTS (since 2026-10-28, end of life 2029-04-30). 24 is Maintenance LTS until 2028-04-30 if a dependency is not ready for 26. |
| nginx | `nginx:1.30-alpine` | 1.30 is the stable branch. `1.31` / `mainline-alpine` is mainline; stable is the one for production. |

Pin the minor line (`1.30-alpine`), not `latest` or `alpine`, so a rebuild can't jump a major
version. Move to the next LTS or stable line on purpose, with a rebuild and a smoke test.

## Static SPA (Vite) served by nginx

### Dockerfile

```dockerfile
FROM node:26-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Values the bundle reads at build time (import.meta.env.VITE_*) must be declared here,
# or the Coolify variable never reaches the build. Remove if the app has none.
ARG VITE_API_URL
RUN npm run build

FROM nginx:1.30-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

A `VITE_*` value is public: it ends up in the JavaScript every visitor downloads. Never put a secret
in one.

### security-headers.conf

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

A separate file, included in `server` and again in every `location` that sets its own header. Why:
see `add_header` inheritance in [debugging.md](debugging.md#nginx-pitfalls).

If the app loads fonts or scripts from another host and you add a `Content-Security-Policy` here,
list those hosts in it (for a hosted font service: the stylesheet host and the font-file host).

### nginx.conf

```nginx
server {
    listen       80;
    listen       [::]:80;
    server_name  _;

    root  /usr/share/nginx/html;
    index index.html;

    # Relative Location headers: correct behind Coolify's proxy and any port mapping.
    absolute_redirect off;

    include /etc/nginx/snippets/security-headers.conf;

    location = /healthz {
        access_log off;
        default_type text/plain;
        return 200 'ok';
    }

    # Retired URLs people were given. Keep in step with the client router.
    # Exact `=` matches and anchored regexes only; targets carry no #fragment.
    location = /old-pricing {
        return 301 /pricing;
    }

    location ~ "^/guide/([^/]+)/?$" {
        return 301 /docs/$1;
    }

    # Hashed build files never change.
    location /assets/ {
        include /etc/nginx/snippets/security-headers.conf;
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # Files in public/ that keep their name when replaced.
    location /images/ {
        include /etc/nginx/snippets/security-headers.conf;
        add_header Cache-Control "public, max-age=604800";
        try_files $uri =404;
    }

    # The entry point is revalidated on every visit, or deploys don't reach returning visitors.
    location = /index.html {
        include /etc/nginx/snippets/security-headers.conf;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # History-mode routing: unknown paths fall back to the app.
    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip              on;
    gzip_vary         on;
    gzip_min_length   1024;
    gzip_comp_level   6;
    gzip_types        text/plain text/css application/javascript application/json
                      image/svg+xml application/manifest+json;
}
```

Deep links reach `/index.html` through the last `try_files` argument, an internal redirect, so they
match `location = /index.html` and get `no-cache` too. The smoke test checks it on a deep link.

## Nuxt, prerendered (`nuxt generate`) served by nginx

```dockerfile
FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx nuxi generate

FROM nginx:1.30-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/.output/public /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

Use the SPA `nginx.conf` with three changes:

- Prerendered routes are files at `route/index.html`, so `try_files $uri $uri/ …` finds them.
- Routes that were not prerendered fall back to the page Nuxt writes for that (`200.html` or
  `404.html`, depending on the version). List `.output/public` after a build and point the last
  `try_files` argument at the file that exists, for example `try_files $uri $uri/ /200.html;`, and
  give that file the `no-cache` location instead of `/index.html`.
- Hashed files live under `/_nuxt/`, not `/assets/`. Rename that location.

Values the pages read at build time (`NUXT_PUBLIC_*` used while prerendering) need an `ARG` line
before `RUN npx nuxi generate`, as in the SPA Dockerfile.

## Nuxt or Nitro server (`nuxt build`) on Node

```dockerfile
FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:26-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
COPY --from=build /app/.output ./.output
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1
CMD ["node", ".output/server/index.mjs"]
```

```ts
// server/routes/healthz.ts
export default defineEventHandler(() => 'ok');
```

- `.output` carries its own traced dependencies, so the runtime stage needs no `npm ci`.
- `HOST=0.0.0.0` is what makes the server reachable from Coolify's proxy.
- `USER node` runs the server without root; the base image ships that user.
- The longer start period covers server start-up before failures count.

## .dockerignore

```
node_modules
dist
.output
.nuxt
.git
.github
.vscode
.idea
.DS_Store
*.md
.env
.env.*
npm-debug.log*
Dockerfile
.dockerignore
docker-compose.yml
```

Keep `.env` files out. Why: a file copied into a build layer stays in the image, even if a later
step deletes it. `node_modules` out keeps host binaries from replacing the ones `npm ci` installed.

## docker-compose.yml for local runs

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '8080:80'          # local only; Coolify puts its own proxy in front
```

For a server app, map `8080:3000`. The health check comes from the image, so it is not repeated
here. This file is for your machine; Coolify deploys the Dockerfile.
