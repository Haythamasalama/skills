# Dockerfiles and server config

Templates for the three shapes in SKILL.md. Image tags are the ones in use in 2026-09/10
(`node:22-alpine`, `nginx:1.27-alpine`); move to the current LTS and stable tags when you start.

## Static SPA (Vite) served by nginx

### Dockerfile

```dockerfile
# ── 1. Build ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# manifests first, so the dependency layer is cached across content changes
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build            # type check first, then vite build: a bad file fails the image

# ── 2. Serve ─────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

- **No `# syntax=` line.** It makes every build pull an extra frontend image from the registry for
  no benefit here.
- **`npm ci` needs a committed lockfile in sync with `package.json`.**
- The `HEALTHCHECK` travels with the image and takes precedence over Coolify's dashboard check.

### security-headers.conf

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

It is a separate file because of an nginx rule: **`add_header` directives are inherited from the
`server` block only when the `location` defines none of its own.** A location that sets
`Cache-Control` silently drops the security headers unless it includes them again.

### nginx.conf

```nginx
server {
    listen       80;
    listen       [::]:80;
    server_name  _;

    root  /usr/share/nginx/html;
    index index.html;

    # Emit `Location: /foo`, not `Location: http://$host:80/foo`. nginx makes a redirect absolute
    # with its own listen port, which is 80 in the container and not the port the visitor used
    # behind Coolify's proxy or `docker run -p 8080:80`. A relative Location is resolved by the
    # client against the URL it actually used, through any number of proxies.
    absolute_redirect off;

    include /etc/nginx/snippets/security-headers.conf;

    # health check for Docker and Coolify
    location = /healthz {
        access_log off;
        default_type text/plain;
        return 200 'ok';
    }

    # Retired URLs that people were given: a real 301 keeps the link's search value and works
    # before any JS runs. Keep these in step with the client router.
    #   - `#` starts a comment here, and a fragment is never sent to the server, so targets
    #     carry no #fragment.
    #   - Regex locations are matched before prefix ones: anchor every pattern, and use exact
    #     `=` matches so a redirect never shadows a real folder (`= /lessons` vs `/lessons/`).
    location = /old-section {
        return 301 /;
    }

    location ~ "^/old-item/([^/]+)/?$" {
        return 301 /items/$1;
    }

    # hashed build assets never change: cache hard
    location /assets/ {
        include /etc/nginx/snippets/security-headers.conf;
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # files replaced by hand without new names: cache briefly
    location /images/ {
        include /etc/nginx/snippets/security-headers.conf;
        add_header Cache-Control "public, max-age=604800";
        try_files $uri =404;
    }

    # the entry point must always be revalidated, or new deploys don't reach returning visitors
    location = /index.html {
        include /etc/nginx/snippets/security-headers.conf;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # history-mode routing: every unknown path falls back to the app
    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip              on;
    gzip_vary         on;
    gzip_min_length   1024;
    gzip_comp_level   6;
    gzip_types        text/plain text/css application/javascript application/json
                      image/svg+xml application/manifest+json;

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

Deep links reach `/index.html` through the last `try_files` argument, which is an internal
redirect, so they match `location = /index.html` and get `no-cache` too. Confirm it on a deep link:
`smoke.sh … 'header /some/deep/link cache-control no-cache'`.

If the app loads fonts or scripts from another host, a Content-Security-Policy must allow them (for
Google Fonts: the stylesheet host and the font-file host).

## Nuxt, prerendered (`nuxt generate`) served by nginx

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx nuxi generate          # or the project's "generate" script

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/.output/public /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

Use the same `nginx.conf`, with two changes:

- prerendered routes are files at `route/index.html`, so `try_files $uri $uri/ …` finds them;
- the fallback for routes that were not prerendered is the SPA fallback page Nuxt writes (`200.html`
  or `404.html` in recent versions). List `.output/public` after a build and point the last
  `try_files` argument at the file that exists: `try_files $uri $uri/ /200.html;`.
- Nuxt's hashed assets live under `/_nuxt/`, not `/assets/`. Cache that folder hard instead.

## Nuxt or Nitro server (`nuxt build`) on Node

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build              # nuxt build → .output/ (server + public, dependencies traced in)

FROM node:22-alpine AS runtime
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

- **Bind to `0.0.0.0`.** A server that listens on `127.0.0.1` inside the container is unreachable
  from Coolify's proxy, and every request fails.
- `.output` is self-contained, so the runtime image needs no `npm ci`.
- Runtime config: Nuxt reads `NUXT_*` / `NUXT_PUBLIC_*` environment variables at runtime on the
  server. Values used at build time (prerendered pages, a static build) must be set for the build.
- Coolify's Nuxt guide (checked 2026-10-28) also supports Nixpacks with the start command
  `node .output/server/index.mjs`, or, for a static build, the Static site type with the output
  directory `dist`.

## .dockerignore

```
node_modules
dist
.output
.nuxt
.git
.gitignore
.github
*.md
!README.md
.env
.env.*
npm-debug.log*
.vscode
.idea
.DS_Store
Dockerfile
.dockerignore
docker-compose.yml
```

Keep `.env` files out: a secret copied into a build layer stays in the image.

## docker-compose.yml for local testing

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - '8080:80'          # local only: Coolify puts its own proxy in front
    healthcheck:
      test: ['CMD', 'wget', '-qO-', 'http://127.0.0.1/healthz']
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s
```

For a Node server, map `8080:3000` and point the check at port 3000. If you deploy with Coolify's
Docker Compose build pack instead, a service's `healthcheck` overrides the image's `HEALTHCHECK`,
and Compose apps don't use the dashboard health-check page.
