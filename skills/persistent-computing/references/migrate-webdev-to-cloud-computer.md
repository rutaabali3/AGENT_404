# Migrating a WebDev Project to Cloud Computer

Read this when the user wants to move an existing WebDev project (`web-db-user` scaffold or similar) to a Cloud Computer.

## Before You Start

After migration, public traffic hits the Cloud Computer directly at `http(s)://<domain-or-ip>:<port>` (optionally fronted by Nginx on the same box). It never traverses `xxx.manus.space` again. This is true regardless of whether development continues in the WebDev sandbox or moves to the Cloud Computer; the gateway is a deployment-time concern, not a development-time one.

That single flow change implies one hard constraint and four independent decisions. Walk the user through both before doing migration work — they dictate everything that follows.

### The hard constraint: Manus OAuth must be replaced

The OAuth app's redirect URIs are locked to the project's `xxx.manus.space` domain, and Manus is not a redirect-URI-unrestricted OAuth provider like Google or GitHub. Once requests come straight to the Cloud Computer, the callback cannot hit a matching redirect URI. Two practical replacements:

- **Swap in a real OAuth/auth provider** (Auth.js, Authelia, Keycloak, or a SaaS like Auth0/Clerk/WorkOS, or generic Google/GitHub/Microsoft OAuth). The injection point is `protectedProcedure` in `server/_core/trpc.ts` — keep its shape, replace only what populates `ctx.user`.
- **Drop the user model entirely** for single-tenant apps; gate the site with a shared secret, basic auth, or an IP allowlist, and drop the `users` table.

### Four "keep or replace" decisions

Beyond OAuth, four things stay coupled to the WebDev project by default. Each is an independent choice, not a package deal.

| Component | "Keep" means | "Replace" means | Notes |
|---|---|---|---|
| **Database** (TiDB) | Cloud Computer connects to the same `DATABASE_URL` over public egress | Self-host MySQL/Postgres, re-run migrations, `mysqldump` the data over | TiDB is not a strict MySQL drop-in: auto-increment gaps, certain `INFORMATION_SCHEMA` columns, and online-DDL semantics differ. Preserve the `?ssl=…` part of the connection string when copying. |
| **Forge S3 bucket** | Use `/manus-storage/*` (already implemented in `server/_core/storageProxy.ts`) with existing storage keys | Migrate objects to S3/R2, swap `server/storage.ts` | Migrating objects out is a manual loop — list keys, presign each, stream to destination. No built-in export. |
| **Forge built-in APIs** (LLM, image gen, voice, notifications, Maps, Data API) | Continue calling them from Cloud Computer; calls meter back to the WebDev project's billing and monthly free quota | Swap the helpers in `server/_core/{llm,imageGeneration,voiceTranscription,notification}.ts` and `server/_core/map.ts` | Works from any public internet egress as long as `BUILT_IN_FORGE_API_KEY` is valid. |
| **WebDev project itself** | Keep alive on Manus side (valid payment method); the three rows above can keep working | Delete to fully untie | The DB, S3 bucket, Forge keys, checkpoints, and `manus.space` domain are all lifecycled with the project — deletion is irreversible and destroys them. Most users should keep it alive at least through a transition window. |

Confirm the user's choices on these four rows and the OAuth replacement before continuing. After this section every subsequent step assumes those decisions have been made.

## Step 1 — Move the Code

Two options: tar the project from the sandbox excluding build artifacts, or — if the user enabled GitHub export in WebDev — clone from the sandbox's `user_github` git remote (check with `git remote -v`). The Cloud Computer does not come pre-loaded with Node/pnpm; install what the project needs.

## Step 2 — Move Environment Variables

Dump the entire `process.env` from the sandbox to a `.env` file, remove the used ones, and move it to the cloud computer.

```bash
node --input-type=module -e "
const lines = Object.entries(process.env).map(
  ([k, v]) => \`\${k}=\${JSON.stringify(v ?? '')}\`
);
console.log(lines.join('\n'));
" > /tmp/{project-name}.env
```

Two points that are easy to miss:

- **Run the dump script from inside the project's WebDev working directory in the sandbox.** WebDev-managed env vars (Forge keys, OAuth config, database URL, user-added Secrets, etc.) are only injected into processes started from there. Running the script in `~` or `/tmp` will produce a near-empty dump and look like a successful migration until something breaks at runtime.
- **Avoid put all env vars in the Cloud Computer's global shell profile** (`~/.bashrc`, `/etc/environment`). The Cloud Computer commonly hosts multiple projects in parallel; project-scoped `.env` files or systemd `EnvironmentFile=` directives avoid collisions.

## Step 3 — Wire Up Data Plane Per Earlier Decisions

Apply whatever was decided in "Before You Start" for the database, S3, and Forge endpoints. Most projects should default to keeping all three on WebDev: it requires no code changes, public egress to TiDB and Forge is open, and the only ongoing requirement is that the WebDev project stays alive with a valid payment method.

For `/manus-storage/*` specifically: the scaffold's local implementation works on Cloud Computer with no code change, but **it has no per-user authorization** — on WebDev that gate came from the gateway. After migration, anyone who can reach the route and guess a key gets the file. If the storage needs to stay private, add an auth check (using whatever replaced OAuth) inside the route handler before issuing the redirect.

Before running anything destructive against the WebDev-managed TiDB, take a `mysqldump` backup — the database is lifecycled with the WebDev project, and there is no other recovery path.

## Step 4 — Domain and HTTPS

The Cloud Computer has no default domain or automatic HTTPS. Without a domain the site is reachable only at `http://<ip>:<port>`, and modern browsers will block OAuth callbacks served over plain HTTP, which makes the auth replacement in "Before You Start" untestable.

Three domain paths, depending on what the user has:

- **No domain yet.** Direct the user to **[Manus → Settings → Purchased Domains](https://manus.im/app#settings/data-controls/purchased-domains)** to buy one, then create an A record pointing at the Cloud Computer's public IP.
- **An existing Manus-purchased domain previously attached to the WebDev project.** Same page — re-point the A record at the Cloud Computer's IP. This is the only platform-specific path AI will not infer on its own.
- **A third-party domain** (GoDaddy, Cloudflare, Namecheap, etc.). Update the A record at the registrar.

Nginx + certbot on the Cloud Computer handles TLS termination; open ports 80 and 443 via `ufw` and record them in the project-level `AGENTS.md`.

If the user's existing site at `xxx.manus.space` is currently published, **it does not auto-unpublish after migration** — it will continue serving stale code until the user manually unpublishes it from the WebDev GUI. Ask whether they want it taken down.

## Step 5 — Re-create Scheduled Jobs

The WebDev project's built-in cron / Heartbeat jobs do not transfer. Re-implement them as `crontab` entries or systemd timers on the Cloud Computer. Anything more elaborate (retries, fan-out, delayed jobs) belongs in a real queue, but that is out of scope here.

## Step 6 — Verify and Document

The verification steps that matter are the ones that touch the platform-specific boundaries, not the ones AI would already think to run. Concretely:

- The replaced auth flow completes end-to-end — login, callback, and a protected query returns the expected user.
- A real call to each Forge-backed feature in use (LLM, image gen, S3 upload/download, notifications) succeeds, confirming `BUILT_IN_FORGE_API_KEY` was carried over correctly and meters to the right project.
- A real round-trip query against the database, not just a connection check.
- The service comes back automatically after `sudo reboot`.

For multi-service projects or cases where environment isolation matters, Docker Compose is also a viable deployment option on the Cloud Computer — but for a typical single-service Node.js app, systemd + Nginx is simpler and lighter.

Document the outcome in two places. The Cloud Computer's global `~/AGENTS.md` only needs a one-line pointer:

> Project `<name>` migrated from WebDev. See `~/<project>/AGENTS.md`.

The project-level `AGENTS.md` carries the operational detail: install/build/start commands, listening port and any `ufw` rules, the current auth source, where env vars are loaded from, and which WebDev-coupled components are still in use (database, S3, Forge endpoints). Never write secret values into it.
