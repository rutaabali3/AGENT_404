# SSR Conversion Pitfalls (observed + fixed)

Each entry: symptom → root cause → fix. When an SSR render "works" but the page is empty, check the server logs — the PROD catch prints `[SSR] render failed, serving shell: <error>` and serves the SPA shell, so the site *looks* fine but crawlers get nothing. (The DEV handler logs a different prefix, `[SSR] dev render failed:`, and surfaces the error via `next(e)` — no shell fallback in dev. And note: an error thrown INSIDE a Suspense boundary is silently baked into that boundary's fallback with NO log at all — if the log is empty but a Suspense-wrapped section renders its fallback, suspect a swallowed render error, §13.)

## 1. `ReferenceError: window is not defined`
- **Symptom:** SSR falls back to shell; log points at `getLoginUrl` / `useAuth` / a component or dependency using `window`.
- **Two distinct causes — the fix differs. Check the stack trace first:**

**(a) APP code touching browser globals during render.** In the template:
  - `getLoginUrl()` (`client/src/const.ts`) builds a redirect URL from `window.location.origin`;
  - `useAuth` writes `localStorage` inside a `useMemo` **and** evaluates `getLoginUrl()` as a default parameter value — both run during `renderToString` on every page that calls it;
  - **`DashboardLayout`** reads `localStorage` in a `useState` initializer (sidebar width) — this crashes the server render of **every auth-gated route** that uses it, turning the `[SSR] render failed` alert into permanent noise.
- **Fix (a):** Guard every browser global on the render path:
  ```ts
  export const getLoginUrl = () => {
    if (typeof window === "undefined") return "/api/oauth/callback"; // SSR placeholder
    /* ...real client logic (window.location.origin, btoa)... */
  };
  ```
  Do the same in `useAuth` (skip `localStorage`/`sessionStorage` reads when `typeof window === "undefined"`) and `DashboardLayout` (`typeof window === "undefined" ? DEFAULT_WIDTH : …` in the initializer). Sweep the FULL hazard set (a storage-only grep misses bare `window.location`/`window.innerWidth`/`document.*` — e.g. the template's own `getLoginUrl()`): `grep -rnE "localStorage|sessionStorage|matchMedia|\bwindow\.|\bdocument\.|\bnavigator\." client/src --include="*.tsx" --include="*.ts"` (hooks/stores are usually `.ts`). Triage: hits in `useState`/`useMemo` initializers, default parameter values, module scope, and JSX expressions are render-path hazards; hits inside `useEffect` bodies and event handlers are safe to skip. Guards must swap *behavior*, never *rendered output* (see §12).
  `ThemeContext` is SSR-safe **as shipped** (it reads `localStorage` only when `switchable` is enabled, and touches `document` only inside `useEffect`) — guard its `useState` initializer only if the project enabled `switchable`.

**(b) A DEPENDENCY touching `window`/`document` at MODULE SCOPE** (leaflet, mapbox-gl, quill, tiptap, some chart libs, i18next browser detectors). Signature: the stack points into `node_modules/<dep>` and fires at import/`ssrLoadModule` time, before any component renders.
- **Fix (b):** `typeof window` guards in app code **cannot** fix a dep's own top-level code. The fix is keeping the dep out of the server module graph — `React.lazy` the importing component + `Suspense`, or a mounted-state client gate — per the decision rule and options in playbook §10. One such import on one page (even a gated-only page — the static import graph is what counts) breaks SSR for EVERY route.
- **Caveat — check where `getLoginUrl()` is called:** if any page renders it in JSX (`<a href={getLoginUrl()}>Login</a>`), the SSR placeholder leaks into the crawler-visible HTML as a dead link. In that case convert those anchors to `onClick={() => (window.location.href = getLoginUrl())}` on a `<button>`, or recompute the href in an effect after hydration. Grep first: `grep -rn "getLoginUrl" client/src --include="*.tsx"`.
- **Theme flash (switchable themes only):** guarding a `switchable` ThemeContext with a server-side default means a dark-mode user gets a light first paint on every SSR load, because the stored theme is applied only in `useEffect`. Fix with a tiny inline script in `<head>` (before the app bundle) that applies the class pre-paint:
  ```html
  <script>try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}</script>
  ```
  Skip this if the app uses a fixed theme (the template default) — there is nothing to flash.
  **This inline script fixes ONLY the CSS flash on `<html>`. It does NOT fix theme-conditional React output inside `#root`** (e.g. the template's own `{theme === "light" ? <Moon/> : <Sun/>}` toggle): the guarded `useState` initializer must return the server-safe default on the client's FIRST render too — do NOT seed it from `document.documentElement`'s class (that reads "dark" on the client while the server rendered the default) — then swap the real theme in `useEffect`. The theme value is rendered output, so this is the "browser-persisted state rendered directly" anti-pattern (§12), not a plain window-only guard.

## 2. `TypeError: jsxDEV is not a function`
- **Symptom:** Prod SSR only; `dist/server-ssr/entry-server.js` throws inside `render`. `grep -c jsxDEV dist/server-ssr/entry-server.js` returns a large number.
- **Cause:** The SSR bundle was built in development mode, so `@vitejs/plugin-react` emitted `jsxDEV` calls, but the production `react/jsx-runtime` (or `react/jsx-dev-runtime` resolution) does not provide `jsxDEV`.
- **Fix:** Prefix the build command with `NODE_ENV=production` — that is the knob that actually controls it. Vite keeps a pre-existing `NODE_ENV` and `@vitejs/plugin-react` follows it, so `mode: "production"` + the `define` in `vite.config.ssr.ts` do NOT override an inherited `NODE_ENV=development` (verified: a config with both, built under `NODE_ENV=development`, still emits `jsxDEV`); keep them as defense-in-depth but never rely on them instead of the prefix. After a correct build, `grep -c jsxDEV dist/server-ssr/entry-server.js` returns `0`.
- **Same leak, silent variant:** the CLIENT leg of the build is susceptible to the same environment leak but fails silently — a development React bundle ships to production with no error. Put `NODE_ENV=production` on the **whole** build chain, not just the SSR leg (playbook §8).

## 3. `Could not resolve entry module "client/client/src/entry-server.tsx"`
- **Symptom:** SSR build fails immediately.
- **Cause:** The main `vite.config.ts` sets `root: "client"`. Running `vite build --ssr client/src/entry-server.tsx` resolves that path *relative to root*, producing `client/client/...`.
- **Fix:** Use a separate `vite.config.ssr.ts` whose base/root is the project root and set the entry via `build.ssr = path.resolve(import.meta.dirname, "client/src/entry-server.tsx")`. Invoke with `--config vite.config.ssr.ts` (no positional `--ssr <path>`). Remember to copy **every** `resolve.alias` from the main config (`@`, `@shared`, `@assets`) — a missing alias fails only the SSR build.

## 4. `ERR_MODULE_NOT_FOUND: .../server-ssr/entry-server.js`
- **Symptom:** Prod server boots, every request falls back to shell; log shows it tried to import `/home/ubuntu/<proj>/server-ssr/entry-server.js` (missing `dist/`).
- **Cause:** In the bundled prod server, `import.meta.dirname` is `dist/`, but the code resolved `../server-ssr`, climbing out of `dist/`.
- **Fix:** `path.resolve(import.meta.dirname, "server-ssr", "entry-server.js")` in production (the bundle sits at `dist/server-ssr/`). Keep a separate dev-mode branch if the code can run un-bundled.

## 5. `Unknown file extension ".css"` during SSR
- **Symptom:** SSR module evaluation throws on a dependency's `.css` (seen with `streamdown` → `katex/dist/katex.min.css`).
- **Cause:** Node's ESM loader cannot import `.css`. Some client libs import CSS at module top-level, which is fine in the browser/Vite but fatal in Node SSR.
- **Fix:** Two valid approaches — pick by the dep's content role (full decision rule and ladder in `ssr-playbook.md` §10). **Grep for every import first** (`grep -rn "streamdown" client/src`) — in the fresh template the public `Home.tsx` imports it (in the graph from App), and `AIChatBox` imports it but is reachable only via the unrouted ComponentShowcase demo (out of the graph until a project routes/reuses it). What matters is the **static import graph reachable from App/entry-server**, not which route renders the component.
  - **`ssr.noExternal` (playbook §10 option 0) — for a `.css`-import crasher like streamdown, this IS a valid one-line fix** (verified for streamdown 1.4.0): added to `ssr.noExternal` in BOTH vite configs, Vite transforms the dep and compiles the top-level `.css` import away in dev `ssrLoadModule` and the prod `--ssr` bundle alike. Prefer it when you want the dep's own SSR render (markdown that IS the page's primary crawlable content). Costs: the dep renders on every SSR request and joins the SSR bundle.
  - **Graph exclusion** — `React.lazy` the importing component + `Suspense`, or a client gate PAIRED with a dynamic import (⚠ gating the *render* alone does not remove a top-level `import`; see playbook §10 option 2). Prefer this when the output is NOT crawlable content (chat boxes, editors, admin panels).
  - **`noExternal` does NOT fix a §1b dep that touches `window`/`document` at module scope** — the transformed code still executes in Node; use graph exclusion for those.

## 6. Content flash / double-fetch after hydration
- **Symptom:** Page renders correct HTML, then briefly blanks or refetches on load.
- **Cause:** One of three: (a) prefetch seeded the cache under a query key that does not match the component's `useQuery` key (wrong input shape, or different decoding of a URL-derived value); (b) the dehydrated state was not deserialized with superjson; (c) **no `staleTime` on the client QueryClient** — TanStack Query v5 defaults `staleTime` to `0`, so hydrated data is instantly stale and every prefetched query refetches on mount (each SSR'd page fetched twice).
- **Fix:** Seed with `getQueryKey(proc, input, "query")` using the *identical* input object the component passes. Deserialize `window.__RQ_STATE__` with `superjson.deserialize` before `HydrationBoundary`. Set `staleTime` (e.g. `30_000`) on the client QueryClient. Keep `retry:false` / `refetchOnWindowFocus:false` on the **server** QueryClient only — copying them onto the client silently changes app-wide request behavior the template did not have.

## 7. `index.html` served instead of SSR output
- **Symptom:** Raw HTML has the empty `<div id="root"></div>` even though SSR "works".
- **Cause:** `express.static` served the built `index.html` before the SSR catch-all ran.
- **Fix:** `express.static(distPath, { index: false, redirect: false })` and let the `app.use("*", ...)` SSR handler own all HTML responses (`redirect: false` also stops serve-static's directory 301 — `/assets` → `/assets/` — from ping-ponging with the trailing-slash normalizer into an infinite redirect loop; playbook §6). Also redirect explicit `/index.html` requests to `/` **before** static, or that path still serves the raw template with unreplaced `<!--app-html-->` placeholders.

## 8. DEV-ONLY unstyled-skeleton flash before hydration
- **Symptom:** In the Vite **dev** preview, the SSR'd page appears for a moment with correct structure/text but **no styling** (raw skeleton), then snaps to styled once JS runs. Production does NOT show this.
- **Cause:** This is Vite dev behavior, not an SSR bug. In dev, `/src/index.css` is served as a `text/javascript` module (for HMR) that injects a `<style>` at runtime — so the server-rendered HTML arrives with no stylesheet and stays unstyled until the client JS executes. Production builds a real hashed `<link rel="stylesheet">` that blocks first paint, so it never flashes. The flash actually *proves* SSR works (structure/text exist pre-JS).
- **Fix (preferred — cheap, 3 lines):** In the dev SSR handler only, inject a **render-blocking `<link>` to Vite's `?direct` CSS variant**, which Vite serves as real `text/css`. This matches prod's first-paint without shipping any extra bytes in the HTML:
  ```ts
  // dev SSR path, after vite.transformIndexHtml(...)
  template = template.replace(
    "</head>",
    `<link rel="stylesheet" href="/src/index.css?direct" data-ssr-dev-css></head>`
  );
  ```
  HMR keeps working because entry-client still loads the JS-module version of the CSS. Verify: `curl -sD- -o/dev/null "http://localhost:<port>/src/index.css?direct" | grep -i content-type` returns `text/css`, and the dev page HTML contains the `data-ssr-dev-css` link.
- **Anti-pattern (avoid):** Inlining the *entire* compiled CSS as a `<style>` via `vite.ssrLoadModule("/src/index.css?inline")`. It works but bloats every dev HTML response by the full stylesheet (~150KB+) on every navigation. The blocking `?direct` link is lighter and closer to prod behavior. Prod is unaffected either way — it uses the built hashed stylesheet and never hits this dev branch.

## 9. Corrupted page content: `$` characters vanish or placeholder text appears
- **Symptom:** Rendered HTML shows `$50` where the page says `$$50`, literal `<!--app-html-->` fragments mid-page, or the document truncates/duplicates around the serialized state.
- **Cause:** `composeHtml` used **string** replacement values. `String.prototype.replace` interprets `$$`, `$&`, `` $` ``, `$'` in the replacement string as special patterns — and app HTML or serialized query state routinely contains them (prices, React-escaped `&`, code snippets).
- **Fix:** Function-form replacement values for every replacement whose value contains dynamic content (app HTML, serialized state, DB-derived head values): `.replace("<!--app-html-->", () => appHtml)`. Functions' return values are never pattern-interpreted. (Static, `$`-free literals — like the dev cache-buster retarget — are safe as plain strings.) Also inject the state script into the template **before** splicing in app HTML, so a literal `</body>` inside app content cannot capture the state script (playbook §6).

## 10. Stored XSS via head tags
- **Symptom:** None until exploited — a DB record whose title contains `</title><script>…</script>` executes on every visit to its page.
- **Cause:** `composeHtml` interpolates DB-sourced values (titles, excerpts) into raw HTML outside React, bypassing React's auto-escaping.
- **Fix:** `escapeHtml()` (`& < > " '`) every dynamic value entering head tags — title, description, og:*, twitter:*, canonical. See `ssr-playbook.md` §6.

## 11. Transient backend error served as 404 + noindex (deindexing hazard)
- **Symptom:** Pages drop out of the search index after infra blips; during a DB outage, `curl -o /dev/null -w "%{http_code}"` on a *real* article slug returns 404 and the HTML carries `noindex`.
- **Cause:** The detail-page prefetch wrapped its call in a catch-all (`.catch(() => null)`), which maps *every* failure — DB connection refused, timeout, any thrown error — to `notFound: true`. The server then responds with a hard 404 + `noindex` for pages that exist, and search engines drop them. The failure is silent: the outer `[SSR] render failed` fallback never fires because the error was swallowed upstream.
- **Fix:** Never return `notFound` from a catch-all. Only a genuine miss may 404: if the procedure returns null for missing rows, use the null check with **no** catch; if it throws, catch narrowly (`e instanceof TRPCError && e.code === "NOT_FOUND"`) and rethrow everything else so the outer handler serves the 200 shell. See playbook §4.

## 12. Hydration mismatch: server DOM discarded, page flickers/re-renders
- **Symptom:** React 19 logs hydration-mismatch errors (often pointing at text nodes — dates, counters) and re-renders client-side; layout jumps after load.
- **Cause:** render output that differs between the server render and the client's first render:
  - relative timestamps ("5 minutes ago") computed from `Date.now()` — drifts between render and hydration on every comment/feed item;
  - `toLocaleString()`/`Intl` without an explicit locale (Node's ICU ≠ the browser's);
  - `Math.random()`/unstable ids in render (use `useId`);
  - `typeof window` ternaries **inside JSX** — guards must swap behavior, never rendered output;
  - browser-persisted state rendered directly (cart badge / wishlist count read from `localStorage`, theme-conditional icons read from a theme store).
- **Two failure modes, and they behave DIFFERENTLY — this decides the fix:**
  - **Text / element-structure diff:** React 19 logs a recoverable error (dev: full text; prod: minified `#418` via `onRecoverableError`), DISCARDS the server DOM for that subtree, and the client value wins. Self-healing but flickers.
  - **Attribute-value diff** (`className`, `href`, `style` — e.g. a `typeof window` ternary on a link's `href`, a theme class): React 19 KEEPS the server DOM, NEVER patches the attribute (a later re-render does not fix it — the client props are already equal), logs only a dev-only `"…won't be patched up"` console.error, and is COMPLETELY SILENT in prod. **The wrong server value sticks forever for every user** (e.g. a `getLoginUrl()` SSR placeholder shipped as a dead login href). A bare ternary does NOT self-heal.
- **Fix:** make render output deterministic on both sides — absolute dates, explicit locale, stable ids. For anything browser-derived that reaches rendered output (localStorage state, theme, a `getLoginUrl()` href): render the server-safe default on BOTH the server and the client's FIRST render, then swap the real value in `useEffect` — `const [href, setHref] = useState(placeholder); useEffect(() => setHref(getLoginUrl()), [])` (this DOES patch the DOM). Accept the brief post-hydration pop-in; never read storage/`window` during render. This effect-swap is mandatory for attribute-value cases (they never self-heal), not merely a flicker-avoidance nicety.
  - **Relative timestamps specifically:** don't replace "3 天前" with a static absolute date (that violates the visual-parity guardrail) — use the SAME defer pattern: render a deterministic value (the record's ISO date, or an absolute string) on both server and first client render, then compute and swap the relative string in `useEffect`. The design stays identical to the SPA.
- **Related but NOT a bug:** framer-motion entrance animations (`initial={{ opacity: 0 }}`) bake `style="opacity:0"` onto that copy in the raw SSR HTML (the initial pose). The text is still in the DOM and og: tags carry previews, so leave it alone for most sites; only where raw-HTML visibility of above-the-fold SEO copy matters, set `initial={false}` there. Do not "fix" this by restyling.

## 13. Crawlers get a spinner: `React.lazy` route splitting vs `renderToString`
- **Symptom:** SSR "works", but the raw HTML of some public routes contains only the Suspense fallback wrapped in a `<!--$!-->…<!--/$-->` client-render boundary; verify needles fail on exactly the lazy routes. Grep for `<!--$!-->` (note the `!` — a resolved boundary emits `<!--$-->`); it is build-invariant. In DEV renders the `<template>` inside it additionally carries `data-msg="Switched to client rendering because the server rendering aborted due to:…"`, but the PRODUCTION build (what step 11 verifies) emits a bare `<template></template>` — so don't grep for the "Switched to client rendering" text against built output.
- **Cause:** `renderToString` does not await `React.lazy` modules — an unresolved lazy boundary renders its **fallback** (verified on React 19: the first render emits the fallback; once the lazy module has resolved, subsequent renders emit the real content). Evolved projects commonly lazy-load routes for bundle size.
- **⚠ Do the §10 dep check FIRST.** Both fixes below pull the route's module (and its static imports) into server-side evaluation. If a public lazy route's module statically imports an SSR-hostile dep (streamdown, leaflet…), un-lazying or preloading it drops that dep into the server graph and crashes SSR for EVERY route (pitfalls §5) — the `lazy()` may be the only thing currently keeping it out. Grep the page's imports; handle §10-class deps per playbook §10 (noExternal / component-lazy / route-local swap) BEFORE applying either option here. (Note option (b)'s awaited preload evaluates the module in Node on every render even though it never enters the STATIC import graph — a real exception to §10's "static graph" criterion.)
- **Fix:** grep first: `grep -rn "lazy(" client/src`. For PUBLIC routes either (a) switch them back to static imports (simplest; those routes join the main client chunk — the bundle-size cost is usually fine for small public pages, and gated routes left lazy still split — this option is also immune to the client-side flash below), or (b) keep splitting with a substitution component that renders synchronously once its module is loaded:
  ```tsx
  const load = () => import("@/pages/Products");
  let Mod: React.ComponentType<any> | undefined;
  export const preloadProducts = () => load().then(m => { Mod = m.default; });
  const LazyProducts = React.lazy(load); // client-side fallback path
  export const Products = (props: any) => (Mod ? <Mod {...props} /> : <LazyProducts {...props} />);
  export const PUBLIC_PRELOADS = [preloadProducts /* …one per substituted public route… */];
  // entry-server render(): await Promise.all(PUBLIC_PRELOADS.map(p => p())); // before renderToString
  // entry-client, BEFORE hydrateRoot: await the preload for the landing route,
  //   e.g. await (ROUTE_PRELOADS[location.pathname] ?? (() => Promise.resolve()))();
  ```
  CLIENT-SIDE HAZARD (option b): on the client `Mod` starts `undefined`, so the route hydrates as a dehydrated `React.lazy` Suspense boundary. While that chunk is still downloading, ANY non-transition state update above the boundary — a §12 cart-badge `useEffect`, the `auth.me` header flip — makes React 19 SILENTLY swap the SSR'd route content for the spinner fallback until the chunk resolves (zero console output in dev AND prod). So entry-client must `await` the landing route's preload BEFORE `hydrateRoot` (verified to keep the server DOM); a fire-and-forget preload is not enough (§12 effects fire faster than a cold chunk fetch). Option (a) avoids this entirely.
  CAUTION: merely awaiting the raw `import()` does NOT fix a plain `React.lazy` — its internal state only resolves when the component is first *rendered*, so the first `renderToString` per process still emits the fallback (verified on react-dom 19). A boot-time warmup works only if it actually renders the tree once (throwaway `renderToString`, then yield a MACROTASK — `setTimeout(0)`/`setImmediate`; a single micro-task turn is not enough for the dynamic import to settle) — the substitution pattern above is more predictable. Auth-gated routes may stay lazy; their fallback HTML is never a crawler deliverable.

## 14. `Unexpected token 'export'` / `require is not defined` / `Named export … not found` during SSR
- **Symptom:** one of those three strings in the SSR failure log (`[SSR] render failed, serving shell:` in prod, `[SSR] dev render failed:` in dev — sometimes prod-only, sometimes dev-only), stack pointing into `node_modules`.
- **Cause:** SSR externalizes dependencies by default — Node loads them natively and chokes on packages shipping untranspiled ESM, top-level CSS imports, or CJS/ESM mixtures.
- **Fix:** add the package to `ssr.noExternal` in **BOTH** vite configs — `vite.config.ssr.ts` (prod SSR bundle) AND the main `vite.config.ts` (dev `ssrLoadModule` resolves through the dev server's config; the `ssr` key is ignored by the client build, so it is safe there). `noExternal` also fixes top-level `.css` imports (§5 — Vite compiles them away; it does NOT need graph exclusion). It CANNOT fix a dep that touches `window`/`document` at module scope (§1b) — the transformed code still runs in Node; use graph exclusion for those. For `Named export … not found`: import the package's default export and destructure.

## 15. A route added AFTER the conversion returns 404 (page looks fine in the browser)
- **Symptom:** months later, a new public page renders normally for humans but gets no search traffic; `curl -o /dev/null -w "%{http_code}"` on it returns 404 (+ noindex meta).
- **Cause:** `prefetchForPath`'s unknown-path fallback is `notFound: true` by design. A wouter route added without a prefetch branch is served with status 404 while the client router still renders the page — invisible in a browser, no log, and strictly worse than the pre-SSR SPA.
- **Fix:** adding a route touches these places, and the count depends on the route KIND:
  - the wouter `Switch`;
  - `prefetchForPath` — a prefetch branch, or an explicit default-head branch for no-data pages;
  - the title mechanism, **which is not always `ROUTE_TITLES`**: a STATIC route → add to `ROUTE_TITLES`; a DYNAMIC detail route (`/events/:id`) → call `useDocumentTitle(record.title)` inside the page (adding `"/events/:id"` to `ROUTE_TITLES` is INERT — the lookup is an exact-string match and never matches `/events/123`, so the tab title silently goes stale on client navigation; playbook §9); a query-parameterized list → `useSearch` + `useDocumentTitle` (playbook §9);
  - the verify-ssr.sh table (a row of the right class);
  - **plus, for a DATA-backed route, TWO more:** the `SsrPrefetch` type entry (playbook §4) and the `buildSsrPrefetch` wrapper in `ssrCaller.ts` (playbook §5). So a data route touches SIX places, not four.
  Re-run the verify script after every route addition — its per-route rows are the only thing that turns the 404 red. A shared route manifest can drive the wouter/prefetch/title/verify entries, but the procedure-keyed `SsrPrefetch`/`ssrCaller` wrappers stay manual.

## 16. Crawl bursts: every bot hit is now a full render + DB queries
- **Symptom:** API latency / DB load spikes correlated with bot User-Agents after going live.
- **Cause:** the conversion turns each crawler HTML hit from a static-file read into a synchronous `renderToString` (blocking the event loop the tRPC API shares) plus N in-process procedure calls — and SSR HTML is deliberately `no-cache`.
- **Fix (only if it actually hurts):** cache requests that carry no SESSION credential — NOT `!req.headers.cookie`. On this template the only cookie that makes a request non-anonymous is the session cookie (`COOKIE_NAME` in `shared/const.ts`, e.g. `app_session_id`; `authenticateRequest` in `sdk.ts` authenticates from that cookie or an `Authorization: Bearer` header). Gate on `!/(?:^|;\s*)app_session_id=/.test(req.headers.cookie ?? "") && !req.headers.authorization` — an UNRELATED cookie (a CDN/LB like Cloudflare/ALB routinely injects one on responses) leaves `ctx.user = null` and identical anonymous HTML, yet `!req.headers.cookie` would disable the cache for it, silently no-opping the cache for much of the anonymous crawler traffic §16 targets. Micro-cache in-process for tens of seconds, keyed on **path + query string** (the full normalized URL — pagination and indexable filtered views vary by query; keying on the query-stripped path would serve cached page-1 HTML for `?page=2`). Never cache session-bearing requests.

## Verification habit

After every conversion step that touches routing, providers, data, or the build, rebuild and run the project's copy of `verify-ssr.sh` (copied from this skill's `scripts/` into the project — asserts status codes, body content inside `#root`, single `<title>`/`og:title`/canonical, og: values, the noindex contract in BOTH directions, dehydrated state, redirect targets, and 404+noindex; exits non-zero on failure). Content needles must be **body-only text** that never appears in the title/description. Also re-run it after CONTENT changes, not just code changes: a render error swallowed by a Suspense boundary (§13) produces a 200 with a baked fallback and NO log, so the content needles are its only automated detection. Never trust the browser alone, because the SPA shell hydrates and hides SSR failures from human eyes.


## Appendix: why og:/canonical/404 are part of the conversion, not a follow-up

Making the SPA SSR only solves "body text is visible". To give crawlers a complete single-pass read of each page — what a framework-SSR (Next.js-style) setup provides out of the box — the **server-injected raw HTML** must also carry the items below, all implemented in the playbook's `HeadMeta` / `buildHeadTags` / `notFound` flow (§4 and §6); this appendix explains the *why*:

1. **Per-route `<title>` + `<meta name="description">`** — different values per route (table stakes). Exactly one `<title>`: delete the template's static one.
2. **Open Graph + Twitter Card** — `og:type` (`article` for detail pages, `website` for lists/home), `og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale`, `og:image` (+ width/height/alt), `article:published_time` for articles, plus `twitter:card`/`title`/`description`/`image`. Social scrapers (facebookexternalhit, Twitterbot, WeChat) do **not** execute JS; these tags must be in the raw HTML or link-preview cards stay blank.
3. **`<link rel="canonical">`** — prevents duplicate-content dilution (plus the 301 trailing-slash normalization in playbook §6, since Baidu treats canonical as a hint only).
4. **Real HTTP status codes** — a missed detail-page slug or unknown route must return **404** (plus `<meta name="robots" content="noindex, follow">`), otherwise search engines index soft-404s. And only a genuine miss may 404 (see §11).

Sitemap.xml, robots.txt, and JSON-LD structured data remain **out of scope** for the conversion itself — offer them as follow-ups (see SKILL.md "Out of scope").

Both the dev and prod SSR paths must apply the same `HeadMeta` → status-code logic. Verify: `curl -A facebookexternalhit $URL | grep og:` shows the tags; `curl -o /dev/null -w "%{http_code}" $URL/nonexistent-slug` returns 404 (both asserted by `verify-ssr.sh`).
