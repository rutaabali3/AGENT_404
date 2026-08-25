---
name: webdev-custom-dockerfile
description: Manus webdev fullstack (web-db-user) projects — the deploy contract for a custom root Dockerfile (build context, secrets injection, build budget, runtime limits, base-image choice, worked examples). Read BEFORE writing or editing a Dockerfile; needed only when production requires an extra system binary (ffmpeg, chromium, fonts...) or another language runtime (Python, Ruby, Java, Go...).
---

# Custom Dockerfile — Reference

Read this only when the default deploy image is not enough — i.e. you need an extra system binary (ffmpeg, chromium, fonts...) or another language runtime (Python, Java, Go, Rust...) available in production. For a plain Node app you do NOT need a Dockerfile: deployment auto-generates one.

Anti-pattern: a custom Dockerfile does NOT make deploys faster, more reliable, or "more reproducible" — the auto-generated image already does a corepack-pinned install with cached layers and a full in-image build. Decline Dockerfile-for-stability or Dockerfile-for-caching requests; write one only for extra binaries or runtimes.

## How deployment consumes your Dockerfile

- If a file named exactly `Dockerfile` exists at the project root, deployment builds with it instead of the auto-generated template. Only create one when you intend it to be used — never leave a half-finished `Dockerfile` at the root.
- The build context is your committed source only (equivalent to `git archive HEAD`): uncommitted files, `dist/`, `node_modules/`, and `.env*` are never in it. Run `webdev_save_checkpoint` after writing or editing the Dockerfile so it — and everything it `COPY`s — is committed.
- The platform overwrites `.dockerignore` with exactly: `node_modules`, `build`, `.git`, `.gitignore`, `Dockerfile`, `.dockerignore`, `.env`, `.env.*` (keeping `!.env.example`). Writing your own `.dockerignore` has no effect. Note `build/` is excluded — never place files the image needs inside a top-level `build/` directory. Every other committed file (`vendor/*.jar`, `scripts/`, `go.mod`, data files) IS in the context.
- Secrets injection mechanism: before building, the platform rewrites your Dockerfile, inserting an `ENV` block with ALL project secrets immediately after EVERY `FROM` line (every stage). Consequences: (a) `VITE_*` values are present during an in-image `vite build`; (b) that block sits above your first layer, so any secret change invalidates the ENTIRE layer cache — apt installs included; no layer ordering protects against this; (c) build logs may warn about secrets in ENV — expected, ignore.
- The image is built on Google Cloud Build (small machine, ~1-2 vCPU, linux/amd64, full outbound network — apt / crates.io / Go proxy / GitHub all reachable) with Docker BuildKit enabled and a HARD ~300-second timeout that includes pulling base images and pushing the finished image. Calibration: the template's own `pnpm install` + `pnpm run build` already consume roughly 1.5–2 minutes of that budget.
- Layer caching across deploys is best-effort inline cache: only FINAL-image layers are restored; intermediate stages of a multi-stage build rebuild from scratch on EVERY deploy, and `RUN --mount=type=cache` mounts start empty every build. Assume a cold builder each deploy — every stage must fit the budget every time.
- There is no docker in the sandbox, so you cannot test-build locally. If the deploy fails, the LAST ~6000 characters of the build log (secret values masked) are returned in the deploy result — read the tail, fix, redeploy.

## Runtime envelope

- 1 vCPU / 512 MiB, fixed — a Dockerfile cannot raise them. Requests time out at 180s; instances scale to zero (cold starts). The platform sets `PORT` at runtime.
- CPU is only guaranteed while a request is in flight: child processes must finish before the response returns; detached background work (in-container cron, queue workers, `setInterval` jobs) is throttled to near-zero and silently freezes — use the platform's scheduled-tasks facility instead of an in-container worker.
- The container filesystem (including `/tmp` and `/dev/shm`) is in-memory: every byte written counts against the 512 MiB. Stream or size-cap uploaded media before feeding it to binaries like ffmpeg; serialize memory-heavy per-request work (one shared headless browser; cap JVM heap with `-Xmx`).

## Rules for a deploy-compatible Dockerfile

1. Place it at the project root, named exactly `Dockerfile`.
2. **Your image owns the whole build — frontend included.** With a custom Dockerfile the platform does not build or host the frontend separately (its CDN `front_url` stays EMPTY — your Express server is the only thing serving the frontend). `dist/` is not in the build context, so the image must run the full `pnpm run build` (`vite build` → `dist/public`, then esbuild bundles the server → `dist/index.js`); in production the server serves `dist/public` itself. Never skip the vite build or rely on prebuilt output.
3. `CMD` must point at the built artifact: `CMD ["node", "dist/index.js"]`. Also set `ENV NODE_ENV=production`. `CMD` runs with cwd = your `WORKDIR` (`/app`): relative paths the server uses at runtime (`spawn("python3", ["scripts/clean.py"])`, `./dist/mytool`) resolve from there; static-file serving resolves relative to `dist/index.js` itself.
4. Install ALL dependencies for the build (`pnpm install` WITHOUT `--prod`) — vite/esbuild are devDependencies. Invoke pnpm through corepack so the version pinned in `package.json`'s `packageManager` is used: `RUN npm install -g corepack@latest && corepack pnpm install` (avoid bare `npm install -g pnpm`, which floats to the latest major). This template uses pnpm `patchedDependencies` (`patches/` directory): if you split `COPY` for layer caching, you MUST `COPY patches ./patches` BEFORE `pnpm install` or it fails with `ENOENT`. Simplest and safest: `COPY . .` before installing.
5. The server build uses `esbuild --packages=external` — dependencies are NOT bundled; the final image MUST keep `node_modules`. In multi-stage builds, copy into the final stage `node_modules`, `dist`, `package.json`, AND everything the server reads from disk at runtime (`scripts/`, `drizzle/`, `vendor/`, data files).
6. Make the server listen on `process.env.PORT` (never hardcode — this template already does it right). `EXPOSE` is optional (defaults to 3000); if you write `EXPOSE <port>`, its FIRST port becomes the container port and `PORT` is set to it at runtime.
7. NEVER write secrets in the Dockerfile: no `ENV DATABASE_URL=...`, no `COPY .env` (not in the context anyway). All secrets (DATABASE_URL, JWT_SECRET, VITE_*, STRIPE_*, ...) are injected automatically at BOTH build time and runtime — reference them as already present. (On dedicated / always-on hosting only `VITE_*` are visible at build time; other secrets are runtime-only there. If the user is not explicitly on dedicated hosting, assume the default envelope above.)

## Base image — put the harder-to-install runtime as the base

- Only extra system packages: base `node:22-slim` and `apt-get install` on top. `node:22-slim` is Debian 12 (bookworm) — check package availability against bookworm: `ffmpeg`, `chromium`, `fonts-noto-cjk` (needed for CJK text rendering), `python3` (= Python 3.11, no way to pin another minor) all exist; `openjdk-21-jdk` does NOT.
- A whole other language runtime (Java, Ruby...): invert — start `FROM` that runtime's official image and add Node via the NodeSource script (reliable one-liner; the reverse direction usually is not). `eclipse-temurin` default tags are Ubuntu LTS: apt + NodeSource work, but `curl` is not preinstalled — install it first. To merely RUN a jar, `eclipse-temurin:21-jre` suffices and is much smaller than `-jdk` (faster cold-start pulls).
- Python is the borderline case: `apt-get install python3` on `node:22-slim` is reliable — for Python stay on the node base.

```dockerfile
# Need Java at runtime → Java base + add Node
FROM eclipse-temurin:21-jre
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
RUN npm install -g corepack@latest && corepack pnpm install && corepack pnpm run build
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
```

## Headless browser (puppeteer / playwright) and postinstall-blocked packages

This template pins `pnpm@10`, which blocks dependency postinstall scripts by default (no `pnpm.onlyBuiltDependencies` configured): packages that download binaries in postinstall — puppeteer, playwright, and similar — silently get NO binary at install time, in the sandbox and in the image alike. Prefer the apt-provided binary plus an env override; alternatively allowlist the package under `pnpm.onlyBuiltDependencies` in package.json.

```dockerfile
FROM node:22-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium fonts-noto-cjk \
    && rm -rf /var/lib/apt/lists/*
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
WORKDIR /app
COPY . .
RUN npm install -g corepack@latest && corepack pnpm install && corepack pnpm run build
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
```

In app code, launch with `--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage`: the container runs as root (Chromium's sandbox is unusable) and `/dev/shm` is memory-backed. Reuse ONE browser instance across requests — each Chromium costs hundreds of MB of the 512 MiB budget.

## Compiled languages (Go, Rust) — multi-stage, copy the binary, watch libc

A compiled language does not need its toolchain in the final image — only the produced binary. Build it in a separate stage and copy just the binary into the `node:22-slim` runtime stage. Prefer a prebuilt binary (apt package or release tarball for linux/amd64) when one exists — remember intermediate stages recompile on EVERY deploy within the ~300s budget.

The other real footgun is **libc mismatch**: a binary built against musl (alpine) crashes on the glibc-based `node:22-slim` runtime, and vice versa. Either build in a debian/glibc image matching the runtime (`golang:1.24`, `rust:1-slim`), or produce a fully static binary (Go: `CGO_ENABLED=0`; Rust: the musl target).

```dockerfile
# Go: static binary, no Go toolchain in final image
FROM golang:1.24-alpine AS go-builder
WORKDIR /src
COPY go-tool/ ./
RUN CGO_ENABLED=0 go build -o mytool .

FROM node:22-slim AS node-builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN npm install -g corepack@latest && corepack pnpm install
COPY . .
RUN corepack pnpm run build

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=node-builder /app/dist ./dist
COPY --from=node-builder /app/node_modules ./node_modules
COPY --from=node-builder /app/package.json ./package.json
COPY --from=go-builder /src/mytool ./dist/mytool
CMD ["node", "dist/index.js"]
```

Go: pick a builder tag ≥ the `go` directive in go.mod. Rust: same shape with `FROM rust:1-slim AS rust-builder` + `cargo build --release --locked` (`--locked` needs Cargo.lock committed); the binary lands at `target/release/<name>` where `<name>` is `[package].name` from Cargo.toml verbatim — dashes are NOT converted; read Cargo.toml before writing the `COPY --from` line. A Rust tree beyond ~50 crates risks the recurring 300s budget — trim features or ship a prebuilt binary.

## Checklist before deploying

- [ ] `Dockerfile` at the project root; `webdev_save_checkpoint` run after the last edit
- [ ] The full `pnpm run build` runs inside the image (frontend AND server; no reliance on prebuilt `dist/`)
- [ ] `node_modules` present in the final image, plus every file the server reads at runtime (scripts/, drizzle/, vendor/...)
- [ ] Server listens on `process.env.PORT`; `ENV NODE_ENV=production` set
- [ ] No secret literals anywhere; nothing `COPY`s `.env`
- [ ] Every stage rebuilds within the ~300s budget on a cold builder (no from-scratch compilation of big dependency trees)
