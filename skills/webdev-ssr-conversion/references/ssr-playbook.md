# SSR Playbook — Full Annotated Source

Copy-adapt these files for the Manus full-stack template. Names/tokens (site title, routes, procedure names) are from a real law-firm build; every block containing them carries an `EDIT PER PROJECT` banner — change them per project. The *structure* is what matters.

## 1. `client/index.html` (placeholders + client entry)

```html
<!doctype html>
<html lang="zh-CN"> <!-- EDIT PER PROJECT: set to the site's content language (the template ships lang="en") -->
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <!--app-head-->
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" src="/src/entry-client.tsx"></script>
    <!-- KEEP the template's analytics script (and any other %VITE_*% tags) — do not drop it -->
    <script
      defer
      src="%VITE_ANALYTICS_ENDPOINT%/umami"
      data-website-id="%VITE_ANALYTICS_WEBSITE_ID%"></script>
  </body>
</html>
```

`<!--app-head-->` and `<!--app-html-->` are the injection points. In dev, Vite rewrites the script tag; leave it pointing at `entry-client.tsx`.

Two edits that are easy to miss:

- **DELETE the template's existing static `<title>{{project_title}}</title>` AND any other static SEO tags** — static `<meta name="description">`, `og:*`, `twitter:*`, and `rel="canonical"`. `composeHtml` owns them all now — leaving a static `<title>`/`og:title` produces TWO and crawlers resolve to the first (generic) one, and a leftover static `canonical` usually points every page at `/` — worse, a duplicated `rel=canonical` makes Google ignore ALL canonical hints for the page; both silently defeat the per-route values. (verify-ssr.sh asserts exactly one `<title>`/`og:title`/`canonical`, so a leftover turns those rows red.) KEEP non-SEO head (favicon, fonts, the umami `%VITE_*%` script).
- **KEEP the umami analytics `<script>`** and its `%VITE_*%` placeholders. Vite's HTML env replacement resolves them at client build (prod) / `transformIndexHtml` (dev), so they work unchanged with SSR.

## 2. `client/src/entry-server.tsx`

```tsx
import { renderToString } from "react-dom/server";
import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import { Router } from "wouter";
import superjson from "superjson";
import { trpc } from "@/lib/trpc";
import { httpBatchLink } from "@trpc/client";
import App from "./App";
import { prefetchForPath, type SsrPrefetch, type HeadMeta } from "./ssr/prefetch";

export type RenderResult = {
  html: string;
  dehydratedState: unknown;
  head: HeadMeta; // title/description/og fields + notFound flag (see §4)
};

export async function render(url: string, prefetch: SsrPrefetch): Promise<RenderResult> {
  // Server-only QueryClient: no retry (fail fast into the shell fallback), no
  // focus refetch (meaningless in Node). These options are for THIS server-side
  // instance only — do NOT copy them onto the client QueryClient (see §3).
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  });
  // Split at the FIRST "?" OURSELVES and pass ssrPath/ssrSearch explicitly.
  // Letting wouter split ssrPath has two verified traps (wouter 3.7.1):
  //  - a bare trailing "?" is never split (its `if (search)` guard), so
  //    "/news?" would match NO route and render NotFound while prefetchForPath
  //    cleans it to "/news" and returns a 200 news head — an indexable 200
  //    whose body says "not found";
  //  - `ssrPath.split("?")` two-element destructuring DROPS everything after a
  //    SECOND "?" (legal per RFC 3986 — e.g. a naively appended "?utm=x"), so
  //    server-side useSearch sees a truncated query while the client keeps the
  //    full string — diverging inputs (§4 pagination) and a hydration refetch.
  // Explicit props avoid both: wouter leaves ssrSearch untouched when ssrPath
  // contains no "?".
  const qi = url.indexOf("?");
  const ssrPath = qi === -1 ? url : url.slice(0, qi);
  const ssrSearch = qi === -1 ? "" : url.slice(qi + 1);
  const head = await prefetchForPath(url, queryClient, prefetch);
  // Dummy client: plain useQuery hooks issue no requests during renderToString
  // (their fetches start in useEffect, which never runs on the server) because
  // everything the page needs is already in the cache from prefetch.
  // CAVEAT: useSuspenseQuery DOES kick off a fetch during render (verified: 1
  // queryFn call) that renderToString can never await — and what decides the
  // outcome is the COMPONENT TREE, not the URL. With NO Suspense ancestor the
  // render throws (→ outer catch → shell fallback, "[SSR] render failed"
  // logged). Under ANY Suspense ancestor (e.g. the route-level <Suspense>
  // added for React.lazy per pitfalls §13 or §10 options 1-2) renderToString
  // returns 200 HTML with the FALLBACK silently baked in — no throw, no
  // console.error, no unhandledRejection; only verify-ssr.sh content needles
  // catch it. No URL fixes either case: a useSuspenseQuery on a PUBLIC SSR'd
  // route must be prefetched (or converted to plain useQuery). On a GATED
  // route, do NOT prefetch (guardrail) and do NOT convert — a Suspense
  // boundary above it bakes the fallback into the 200+noindex page, which is
  // the intended gated contract; add a route-level <Suspense> if one is
  // missing rather than throwing on every gated request.
  const trpcClient = trpc.createClient({
    links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })],
  });
  const html = renderToString(
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* Explicit ssrPath/ssrSearch from the split above — do NOT pass the
            raw URL and rely on wouter's own "?" split (bare-"?" and second-"?"
            traps; see the comment on the split). */}
        <Router ssrPath={ssrPath} ssrSearch={ssrSearch}>
          <App />
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
  return { html, dehydratedState: dehydrate(queryClient), head };
}
```

## 3. `client/src/entry-client.tsx`

Mirror the template's original `main.tsx` (auth-redirect subscriptions, Bearer-token fallback, superjson) but swap `createRoot().render` → `hydrateRoot`, and wrap with `HydrationBoundary` fed from `window.__RQ_STATE__`.

```tsx
import { hydrateRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider, HydrationBoundary, type DehydratedState } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { Router } from "wouter";
import superjson from "superjson";
import { trpc } from "@/lib/trpc";
import App from "./App";
import "./index.css";

// Keep the template's client behavior (default retry & focus-refetch) — changing
// them app-wide is out of scope for SSR. Add ONLY `staleTime`: without it,
// TanStack Query v5 treats hydrated data as stale (staleTime defaults to 0) and
// refetches every prefetched query immediately on mount, so each SSR'd page is
// actually fetched twice. staleTime keeps just-hydrated data fresh for a window.
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } }, // tune per project
});
// ...keep the template's auth-error → getLoginUrl() cache subscriptions here...
const trpcClient = trpc.createClient({ /* ...same links/headers/fetch as main.tsx... */ });

const rawState = (window as any).__RQ_STATE__;
const dehydratedState = (rawState ? superjson.deserialize(rawState) : undefined) as DehydratedState | undefined;

hydrateRoot(
  document.getElementById("root")!,
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <Router>
          <App />
        </Router>
      </HydrationBoundary>
    </QueryClientProvider>
  </trpc.Provider>
);
```

> Delete or stop importing the old `main.tsx` so there is a single client entry.

## 4. `client/src/ssr/prefetch.ts`

`SsrPrefetch` is the interface the in-process caller implements. `seed()` writes fetched data into the query cache under the tRPC query key so the client finds it instead of refetching. `HeadMeta` carries everything `composeHtml` needs, including the `notFound` flag that drives a real 404 status (never soft-404).

```ts
import type { QueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
// Value import of @trpc/server is safe HERE ONLY: this file is imported by the
// server entry graph (entry-server.tsx / ssrCaller), never by entry-client.
import { TRPCError } from "@trpc/server";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../server/routers";
import { trpc } from "@/lib/trpc";

export type HeadMeta = {
  title: string;
  description: string;
  /** "article" for detail pages, "website" for lists/home */
  ogType?: "website" | "article";
  /** share image URL; relative template-storage paths (/manus-storage/...) are
   *  fine — buildHeadTags absolutizes them (requires CANONICAL_ORIGIN). Omit if none. */
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;
  /** ISO 8601; article pages only */
  publishedTime?: string;
  modifiedTime?: string;
  /** path only (e.g. "/news/foo"); composeHtml prepends the canonical origin */
  canonicalPath?: string;
  /** og-style locale (e.g. "zh_CN") for multi-locale sites; single-language sites omit (env default applies). See §11 */
  locale?: string;
  /** 200 but not indexable: internal search results, /cart, auth-gated shells */
  noindex?: boolean;
  /** slug missed / unknown route → server responds 404 + noindex */
  notFound?: boolean;
};

// Typing the wrappers with inferRouterOutputs keeps seeded data and component
// expectations aligned at compile time — drift becomes a type error, not a
// silent hydration refetch.
type RO = inferRouterOutputs<AppRouter>;

// This wrapper interface is a deliberate ALLOWLIST: only procedures listed here
// are reachable from SSR prefetch (mutations/admin stay out). On a large router
// you may instead pass the caller straight through, typed as
// `type AppCaller = ReturnType<typeof appRouter.createCaller>` — less
// boilerplate to keep in sync, but you lose the allowlist.
// ═══ EDIT PER PROJECT — procedure names below come from YOUR appRouter ═══
export type SsrPrefetch = {
  practiceAreasList: () => Promise<RO["content"]["practiceAreas"]["list"]>;
  practiceAreaBySlug: (slug: string) => Promise<RO["content"]["practiceAreas"]["bySlug"]>;
  attorneysList: () => Promise<RO["content"]["attorneys"]["list"]>;
  casesList: (category?: string) => Promise<RO["content"]["cases"]["list"]>;
  caseBySlug: (slug: string) => Promise<RO["content"]["cases"]["bySlug"]>;
  newsCategories: () => Promise<RO["content"]["news"]["categories"]>;
  newsList: (input: { page?: number; categoryId?: number; search?: string }) => Promise<RO["content"]["news"]["list"]>;
  newsBySlug: (slug: string) => Promise<RO["content"]["news"]["bySlug"]>;
};

async function seed(qc: QueryClient, key: unknown, data: unknown) {
  qc.setQueryData(key as any, data);
}

// ═══ EDIT PER PROJECT — site strings and every route branch below ═══
const SITE = "恒信律师事务所 | Hengxin Law Firm"; // EDIT: worked example from a real build
const DESC = "…default description…";

export async function prefetchForPath(url: string, qc: QueryClient, p: SsrPrefetch): Promise<HeadMeta> {
  // The PREFETCH INPUT must mirror what the component's useQuery actually
  // produces for this URL (the exact-key rule), independent of indexability:
  //  - component derives the filter from the query (useSearch) → seed the
  //    ACTUAL filtered fetch under that exact input; canonicalPath still points
  //    at the bare path (filtered views stay non-indexed unless you also add
  //    the params to canonicalPath).
  //  - component ignores URL params (filter is client-side state) → prefetch
  //    the unfiltered list; that IS the component's input.
  // NEVER seed unfiltered data under a filtered key (wrong content until
  // refetch) or under a key the component never reads (skeleton + wasted DB
  // call). If serving the filtered fetch is impractical, skip seeding for that
  // request (component client-fetches, like the SPA).
  //
  // PAGINATION is the MANDATORY exception to that default: a paginated list
  // (?page=N or /list/page/N) must prefetch THE REQUESTED PAGE and
  // self-canonicalize to the paged URL — canonicalizing page 2+ back to page 1
  // serves skeleton bodies and orphans the whole back catalog for non-JS
  // crawlers. Match the component's input EXACTLY INCLUDING TYPES: URL params
  // are strings, so coerce, and mirror defaulted keys. e.g.:
  //   const page = Number(new URLSearchParams(url.split("?").slice(1).join("?")).get("page")) || 1;
  //   (slice(1).join("?") keeps EVERYTHING after the first "?" — identical to
  //   the client's location.search parsing even if the URL holds a second "?")
  //   await seed(qc, getQueryKey(trpc.content.news.list, { page }, "query"), await p.newsList({ page }));
  //   return { title: page > 1 ? `法律资讯 · 第${page}页 · ${SITE}` : ...,
  //            canonicalPath: page > 1 ? `/news?page=${page}` : "/news", ... };
  // Path-style pagination (/news/page/2) needs its own explicit branch, or it
  // falls into the 404 default below.
  //
  // DECODE THE WHOLE PATH BEFORE MATCHING — wouter matches its route regexes
  // against the fail-safe-decodeURI'd location (relativePath applies decodeURI
  // to the entire path, never decodeURIComponent, never throws). A non-ASCII
  // route (/关于) arrives percent-encoded on the wire (/%E5%85%B3%E4%BA%8E);
  // wouter decodes+matches, but comparing the RAW url here falls into the 404
  // default → every hit to a real non-ASCII route is served 404 + noindex.
  // Decoding once here (and NOT re-decoding captured slug segments below —
  // decodeURI already ran, and it preserves reserved escapes like %2F/%26 so
  // the seeded key still matches the component's params) mirrors wouter exactly.
  let pathOnly = url.split("?")[0];
  try { pathOnly = decodeURI(pathOnly); } catch { /* malformed: use raw, as wouter does */ }
  const clean = pathOnly.replace(/\/+$/, "") || "/";

  // If the site stores identity/navigation in the DB (settings table, nav
  // categories), fetch-and-seed those layout-level queries HERE, before the
  // route switch — every page's header renders them — and derive SITE/DESC
  // from the settings record instead of module constants.

  if (clean === "/") {
    const areas = await p.practiceAreasList();
    await seed(qc, getQueryKey(trpc.content.practiceAreas.list, undefined, "query"), areas);
    return { title: SITE, description: DESC, ogType: "website", canonicalPath: "/" };
  }
  const newsMatch = clean.match(/^\/news\/([^/]+)$/);
  if (newsMatch) {
    // `clean` is already decodeURI'd (whole-path decode above), matching how
    // wouter derives params — so use the captured segment AS-IS. Do NOT
    // decodeURI again (double-decode) and NEVER decodeURIComponent: wouter
    // keeps reserved escapes like %2F/%26 encoded, so re-decoding would seed a
    // DIFFERENT query key than the component's useQuery input and cause the
    // flash-refetch this file exists to prevent. "Same input shape" includes
    // same decoding.
    const slug = newsMatch[1];
    // notFound RULE: only a genuine miss may become notFound. A catch-all
    // (`.catch(() => null)`) would convert DB outages/timeouts into
    // 404 + noindex and get real pages DEINDEXED. Catch narrowly; rethrow
    // everything else so the outer handler serves the 200 shell instead.
    let n: RO["content"]["news"]["bySlug"] | null;
    try {
      n = await p.newsBySlug(slug);
    } catch (e) {
      if (e instanceof TRPCError && e.code === "NOT_FOUND") n = null;
      else throw e;
    }
    // (If your procedure returns null for a miss instead of throwing, drop the
    // try/catch entirely — just `const n = await p.newsBySlug(slug);` — AND
    // drop the now-unused `import { TRPCError }` at the top, or it ships a dead
    // @trpc/server value-import in this graph.)
    if (!n) return { title: SITE, description: DESC, notFound: true }; // real 404, not soft-404
    await seed(qc, getQueryKey(trpc.content.news.bySlug, { slug }, "query"), n);
    return {
      // Guard the title: a record with an empty/whitespace-only title (common
      // in UGC) would compose to "· SITE" — a non-empty string, so buildHeadTags'
      // `clampText(title) || siteName` fallback never fires and every tag ships a
      // leading orphan middot. verify-ssr.sh can't catch it (site name is a
      // substring of the buggy title). Same guard belongs in useDocumentTitle (§9).
      title: n.title?.trim() ? `${n.title} · ${SITE}` : SITE,
      description: n.excerpt || DESC, // raw UGC/CMS text is fine — buildHeadTags normalizes+truncates (§6 metaText)
      ogType: "article",
      // Populate the record's cover image — this is what makes share cards.
      // Template storage URLs are relative; buildHeadTags absolutizes them.
      ogImage: n.coverImageUrl ?? undefined,
      publishedTime: n.publishedAt ? new Date(n.publishedAt).toISOString() : undefined,
      canonicalPath: clean,
    };
  }
  // …one branch per public route…

  // Head-only PUBLIC route (nothing to seed — /contact, /pricing, /legal/*):
  // still needs canonicalPath. Do NOT copy the gated branch's shape (noindex,
  // no canonicalPath) for a public page. (ogType may be omitted — buildHeadTags
  // defaults og:type to "website".)
  if (clean === "/contact") {
    return { title: `联系我们 · ${SITE}`, description: "欢迎来访或致电咨询…", canonicalPath: "/contact" };
  }

  // Auth-gated routes: 200 + default head, NO prefetch (never bake private
  // data into public HTML). This branch must exist IN CODE — without it these
  // paths fall through to the 404 below and logged-in users' first loads get
  // HTTP 404. EDIT PER PROJECT: list your gated prefixes.
  if (clean === "/portal" || clean.startsWith("/portal/") || clean === "/admin" || clean.startsWith("/admin/")) {
    // 200 + noindex: never 404 (breaks logged-in first loads), never indexed
    // (crawlers would only see identical thin shells). Same treatment fits
    // /cart and internal search results (/search?q=...).
    return { title: SITE, description: DESC, noindex: true };
  }

  // Paths matching no known route: real 404. CAVEAT: wouter matches routes
  // CASE-INSENSITIVELY (regexparam compiles every pattern with the 'i' flag),
  // so /News or /NEWS/some-slug renders the real page on the client while these
  // case-sensitive branches fall here → 404 + noindex + no data. Status and UI
  // do NOT automatically agree. If case-variant URLs are a concern (external
  // backlinks), add a case-normalization 301 for known static route segments to
  // the §6 middleware (NEVER lowercase dynamic slug segments — the bySlug lookup
  // handles genuine misses), OR make the static comparisons above
  // case-insensitive and always emit the canonical-cased canonicalPath.
  return { title: SITE, description: DESC, notFound: true };
}
```

**Critical:** the query key must exactly match what the component's `useQuery` produces — same procedure, same input object shape (`{ slug }`, `{ categoryId: undefined, search: undefined }`, or `undefined`), same TYPES (`{ page: 2 }`, never `{ page: "2" }`), and same decoding of any URL-derived value. A mismatch means the client cache misses and refetches, causing a content flash.

**Infinite queries:** `useInfiniteQuery` (feeds, load-more lists, comment threads) needs a DIFFERENT key type and data shape — grep for it (`grep -rn "useInfiniteQuery" client/src`) before writing the map. Seed like this:

```ts
qc.setQueryData(getQueryKey(trpc.posts.feed, input, "infinite"), {
  pages: [firstPage],   // exactly the one page you prefetched
  pageParams: [null],   // must equal the component's initialPageParam
});
```

where `input` is the component's input WITHOUT cursor/direction (tRPC strips them from the key). Seeding with the `"query"` type or a bare array silently cache-misses or crashes after hydration. When unsure, skip prefetching that section — a client-fetched feed is better than a wrong-shaped seed.

**Coverage check:** the prefetch map is hand-enumerated; a public route whose query is missing here fails silently (crawlers get a loading skeleton). Give every public route a content needle in `scripts/verify-ssr.sh` — the needle must be **body-only text** (not the title/description; the script greps only the `#root` slice) so a missed registration turns the check red.

## 5. `server/_core/ssrCaller.ts`

```ts
import type { Request, Response } from "express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import type { SsrPrefetch } from "../../client/src/ssr/prefetch";

// ═══ EDIT PER PROJECT — mirror the SsrPrefetch wrappers onto YOUR procedures ═══
export async function buildSsrPrefetch(req: Request, res: Response): Promise<SsrPrefetch> {
  // ctx.user is preserved — so procedures exposed here should return
  // VIEWER-INDEPENDENT data for public routes. If a public list branches on
  // ctx.user (likedByMe, isFollowing), the dehydrated HTML becomes per-user:
  // split the viewer part into a separate protectedProcedure (e.g.
  // posts.myInteractions(postIds)) fetched client-side after hydration.
  const ctx = await createContext({ req, res } as any); // keeps ctx.user from cookie
  const caller = appRouter.createCaller(ctx);
  return {
    practiceAreasList: () => caller.content.practiceAreas.list(),
    practiceAreaBySlug: (slug) => caller.content.practiceAreas.bySlug({ slug }),
    attorneysList: () => caller.content.attorneys.list(),
    casesList: (category) => caller.content.cases.list(category ? { category } : undefined),
    caseBySlug: (slug) => caller.content.cases.bySlug({ slug }),
    newsCategories: () => caller.content.news.categories(),
    newsList: (input) => caller.content.news.list(input),
    newsBySlug: (slug) => caller.content.news.bySlug({ slug }),
  };
}
```

## 6. `server/_core/vite.ts` (dev + prod wiring)

```ts
import superjson from "superjson";
import { buildSsrPrefetch } from "./ssrCaller";
import type { HeadMeta } from "../../client/src/ssr/prefetch";

// SECURITY: head values may originate from the database (CMS titles, excerpts).
// Interpolating them into raw HTML bypasses React's auto-escaping, so a stored
// title like `</title><script>…</script>` becomes stored XSS executing on every
// visit. escapeHtml() EVERY value that goes into headTags — no exceptions.
const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// Canonical origin for og:url / canonical. Configure per deployment (env var);
// never derive it from req.host (client-spoofable).
const CANONICAL_ORIGIN = process.env.CANONICAL_ORIGIN ?? ""; // e.g. "https://example.com"
// SITE_NAME feeds og:site_name and the prod-fallback default title. Keep it
// equal to the SITE constant in prefetch.ts/Head.tsx (or export SITE from a
// shared/ module and import it in all three — vite.ts must only type-import
// prefetch.ts, so don't value-import SITE from there). Both env vars must be
// set in the DEPLOYMENT environment, not just your local shell (SKILL step 5).
const SITE_NAME = process.env.SITE_NAME ?? "";
if (process.env.NODE_ENV === "production" && (!CANONICAL_ORIGIN || !SITE_NAME)) {
  // Without these, canonical/og:url (and relative og:image absolutization) and
  // og:site_name are silently OMITTED — nothing else will tell you.
  if (!CANONICAL_ORIGIN) console.warn("[SSR] CANONICAL_ORIGIN is not set — canonical/og:url/og:image tags will be omitted site-wide");
  if (!SITE_NAME) console.warn("[SSR] SITE_NAME is not set — og:site_name will be omitted and the prod-fallback title degrades to the hardcoded placeholder");
}
const OG_LOCALE = process.env.OG_LOCALE ?? "zh_CN"; // EDIT PER PROJECT

// Normalize head text that may come from UGC/CMS records. Escaping alone is
// not enough: multi-KB excerpts, embedded newlines, and literal markdown
// syntax produce broken or spammy meta tags. TWO paths: TITLES get
// whitespace-collapse + truncation ONLY — the markdown-token strip (metaText
// below) is for description PROSE and silently corrupts legitimate titles
// ("async/await in C#" → "…in C", "node_modules explained" → "nodemodules…").
const clampText = (s: string, max: number) => {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.lastIndexOf(" ", max);
  if (cut > max * 0.6) return t.slice(0, cut) + "…";
  // Hard cut on a spaceless run (CJK / emoji / hashtag titles): slice by CODE
  // POINT, not UTF-16 code unit, or a cut landing mid-surrogate leaves a lone
  // surrogate that renders as "�" at the tail of the tag. (Array.from handles
  // surrogate pairs; use Intl.Segmenter if ZWJ/combining graphemes matter.)
  return Array.from(t).slice(0, max).join("") + "…";
};
// Description path: cheap markdown-token strip on top (kills #/*/_/`/~ noise in
// UGC excerpts). Never use it on titles.
const metaText = (s: string, max: number) => clampText(s.replace(/[#*_`~]+/g, ""), max);

function buildHeadTags(head: HeadMeta, siteName: string): string {
  const title = escapeHtml(clampText(head.title, 70) || siteName); // empty UGC title → site default (title path: NO md-strip)
  const desc = escapeHtml(metaText(head.description, 200));
  const url = head.canonicalPath && CANONICAL_ORIGIN ? escapeHtml(CANONICAL_ORIGIN + head.canonicalPath) : "";
  // Template storage URLs are RELATIVE (/manus-storage/...) by design, but the
  // OG protocol requires ABSOLUTE URLs — scrapers ignore relative og:image.
  // Absolutize here; if CANONICAL_ORIGIN is unset, omit the tag entirely
  // rather than ship a broken one. (Protocol-relative "//cdn..." URLs must be
  // handled BEFORE the "/" branch or they get mangled.)
  const img = head.ogImage?.startsWith("//")
    ? "https:" + head.ogImage
    : head.ogImage?.startsWith("/")
      ? (CANONICAL_ORIGIN ? CANONICAL_ORIGIN + head.ogImage : undefined)
      : head.ogImage;
  // Social scrapers (facebookexternalhit, Twitterbot, WeChat) do NOT run JS —
  // og:/twitter: tags must be present in the raw HTML for link-preview cards.
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}" />`,
    `<meta property="og:type" content="${head.ogType ?? "website"}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:locale" content="${escapeHtml(head.locale ?? OG_LOCALE)}" />`,
    `<meta name="twitter:card" content="${img ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
  ];
  // Omit og:site_name entirely when SITE_NAME is unset, rather than shipping
  // content="" (an empty tag is worse than a missing one). verify-ssr.sh does
  // not assert og:site_name, so this would otherwise ship silently.
  if (siteName) tags.push(`<meta property="og:site_name" content="${escapeHtml(siteName)}" />`);
  if (img) {
    tags.push(`<meta property="og:image" content="${escapeHtml(img)}" />`);
    tags.push(`<meta name="twitter:image" content="${escapeHtml(img)}" />`);
    if (head.ogImageWidth) tags.push(`<meta property="og:image:width" content="${head.ogImageWidth}" />`);
    if (head.ogImageHeight) tags.push(`<meta property="og:image:height" content="${head.ogImageHeight}" />`);
    if (head.ogImageAlt) tags.push(`<meta property="og:image:alt" content="${escapeHtml(head.ogImageAlt)}" />`);
  }
  if (head.ogType === "article") {
    if (head.publishedTime) tags.push(`<meta property="article:published_time" content="${escapeHtml(head.publishedTime)}" />`);
    if (head.modifiedTime) tags.push(`<meta property="article:modified_time" content="${escapeHtml(head.modifiedTime)}" />`);
  }
  if (url) {
    tags.push(`<meta property="og:url" content="${url}" />`);
    tags.push(`<link rel="canonical" href="${url}" />`);
  }
  if (head.notFound || head.noindex) {
    tags.push(`<meta name="robots" content="noindex, follow" />`);
  }
  return tags.join("\n");
}

function composeHtml(template: string, appHtml: string, head: HeadMeta, dehydratedState: unknown) {
  const esc = (s: string) => s.replace(/</g, "\\u003c");
  const headTags = buildHeadTags(head, SITE_NAME);
  const stateScript =
    `<script>window.__RQ_STATE__ = ${esc(JSON.stringify(superjson.serialize(dehydratedState)))}</script>`;
  // IMPORTANT: replacement values MUST be functions. With a string value,
  // String.replace interprets `$$`, `$&`, "$`", `$'` inside the CONTENT as
  // special patterns: body text "$$50" silently becomes "$50", React-escaped
  // "$&amp;" re-injects the matched placeholder, and a "$`" inside the
  // serialized state splices half the page into itself. Function return values
  // are never pattern-interpreted.
  // ORDER: inject the state script BEFORE splicing in appHtml — app content
  // can legally contain a literal "</body>" (dangerouslySetInnerHTML, JSON-LD),
  // and replacing "</body>" afterwards would relocate the state script into
  // the middle of #root.
  return template
    .replace("</body>", () => `${stateScript}</body>`)
    .replace("<!--app-head-->", () => headTags)
    .replace("<!--app-html-->", () => appHtml);
}

// CACHING: the dehydrated state is rendered per-request with a cookie-derived
// ctx.user. If ANY shared cache (CDN, reverse proxy) stores this HTML, one
// user's state can be served to another. Default to `Cache-Control: no-cache`
// on all SSR HTML; only relax to `public, s-maxage=...` after verifying every
// prefetched procedure ignores ctx.user — and never cache cookie-varying
// responses without `Vary: Cookie`.

// DEV — replace the BODY of setupVite's app.use("*") catch-all with:
// NOTE: the trailing-slash 301 lives in serveStatic (PROD) only. In dev,
// multi-slash URLs like /news// or // return 200 with the real head tags and
// dehydrated state wrapped around the NotFound BODY (clean strips all trailing
// slashes, wouter tolerates exactly one) — don't debug SSR against such URLs.
app.use("*", async (req, res, next) => {
  const url = req.originalUrl;
  try {
    const clientTemplate = path.resolve(import.meta.dirname, "../..", "client", "index.html");
    let template = await fs.promises.readFile(clientTemplate, "utf-8");
    // The template's nanoid cache-buster targets `src="/src/main.tsx"` — after
    // step 1 renamed the entry it silently no-ops. Retarget it. (String-form
    // .replace is fine for these static, $-free literals; composeHtml's
    // DYNAMIC values still require function form — see pitfalls §9.)
    template = template.replace(`src="/src/entry-client.tsx"`, `src="/src/entry-client.tsx?v=${nanoid()}"`);
    // transformIndexHtml is NOT optional: it applies %VITE_*% env replacement
    // and lets plugins inject their scripts (vite-plugin-manus-runtime, the
    // debug collector) — skipping it breaks the Manus host handshake in dev.
    template = await vite.transformIndexHtml(url, template);
    // Dev-only blocking CSS so the SSR'd first paint is styled (pitfalls §8):
    template = template.replace("</head>", `<link rel="stylesheet" href="/src/index.css?direct" data-ssr-dev-css></head>`);
    const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
    const prefetch = await buildSsrPrefetch(req, res);
    const { html, dehydratedState, head } = await render(url, prefetch);
    res
      .status(head.notFound ? 404 : 200)
      .set("Cache-Control", "no-cache")
      .type("html")
      .end(composeHtml(template, html, head, dehydratedState));
  } catch (e) {
    vite.ssrFixStacktrace(e as Error);
    console.error("[SSR] dev render failed:", e);
    next(e); // dev: SURFACE the error (Vite overlay) instead of hiding it behind the shell
  }
});

// PROD (serveStatic):
// A direct request to /index.html would otherwise hit express.static and leak the
// raw template (unreplaced <!--app-html--> placeholders, HTTP 200). Redirect it
// into the SSR handler BEFORE mounting static — and 301-normalize trailing
// slashes while we're here: /news/ and /news would otherwise both 200 with
// identical content, and Baidu treats rel=canonical as a hint only.
app.use((req, res, next) => {
  if (req.path === "/index.html") return res.redirect(301, "/");
  // If public routes were RENAMED during the project's life (check analytics /
  // git history for old paths with live backlinks), 301 them here — the
  // prefetch fallback would otherwise hard-404 formerly indexed URLs. Use
  // PREFIX mapping so a renamed DETAIL namespace (/old-shop/:slug) redirects
  // too, and RE-APPEND the query (a dropped ?page=2 changes content). The
  // target always starts with the literal `to`, so no open-redirect:
  //   const LEGACY_PREFIXES: Record<string, string> = { "/old-shop": "/products" }; // EDIT PER PROJECT
  //   for (const [from, to] of Object.entries(LEGACY_PREFIXES))
  //     if (req.path === from || req.path.startsWith(from + "/"))
  //       return res.redirect(301, to + req.path.slice(from.length) + req.originalUrl.slice(req.path.length));
  if (req.path !== "/" && /\/+$/.test(req.path)) {
    const query = req.originalUrl.slice(req.path.length);
    // SECURITY: collapse leading slashes too — "GET //evil.com/" must redirect
    // to the LOCAL path "/evil.com", never to the protocol-relative
    // "//evil.com" (an open redirect browsers resolve to https://evil.com).
    const target = (req.path.replace(/\/+$/, "") || "/").replace(/^\/\/+/, "/");
    return res.redirect(301, target + query);
  }
  next();
});
// redirect:false is REQUIRED: serve-static's default directory 301
// (/assets -> /assets/) would ping-pong with the trailing-slash 301 above into
// an infinite redirect loop (dist/public/assets/ always exists — Vite's default
// assetsDir). With it off, bare directory paths fall through to the SSR
// catch-all → real 404 + noindex.
app.use(express.static(distPath, { index: false, redirect: false })); // SSR owns HTML
const templatePath = path.resolve(distPath, "index.html"); // distPath = dist/public — the BUILT template (env placeholders resolved)
const serverEntryPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(import.meta.dirname, "../..", "dist", "server-ssr", "entry-server.js")
    : path.resolve(import.meta.dirname, "server-ssr", "entry-server.js"); // dirname == dist/
app.use("*", async (req, res) => {
  try {
    const template = await fs.promises.readFile(templatePath, "utf-8");
    // This import must stay DYNAMIC with a runtime-variable path: the SSR
    // bundle only exists after build, and esbuild leaves variable-path imports
    // unbundled. buildSsrPrefetch comes from the normal top-level import.
    const { render } = await import(serverEntryPath);
    const prefetch = await buildSsrPrefetch(req, res);
    const { html, dehydratedState, head } = await render(req.originalUrl, prefetch);
    res
      .status(head.notFound ? 404 : 200)
      .set("Cache-Control", "no-cache")
      .type("html")
      .end(composeHtml(template, html, head, dehydratedState));
  } catch (e) {
    // ALERT on this log line in monitoring: this failure mode is invisible to
    // human QA (users get a working SPA) while crawlers get the degraded page.
    console.error("[SSR] render failed, serving shell:", e);
    const template = await fs.promises.readFile(templatePath, "utf-8");
    // Fall back WITH default head tags — an empty <!--app-head--> would serve
    // an untitled, description-less 200 that crawlers may index as a thin page.
    const fallbackHead = buildHeadTags(
      { title: SITE_NAME || "…site title…", description: "…default description…" }, // EDIT PER PROJECT
      SITE_NAME
    );
    res.status(200).set("Cache-Control", "no-cache").type("html").end(
      template.replace("<!--app-head-->", () => fallbackHead).replace("<!--app-html-->", () => "")
    );
    // NOTE: this fallback serves an EMPTY #root, so entry-client's hydrateRoot
    // logs one recoverable hydration error (dev: full text; prod: minified
    // React #418) on every fallback-served load. That is expected here — a
    // hydration-failed/#418 on EVERY page usually means this fallback fired;
    // check for "[SSR] render failed" in the server log BEFORE hunting render
    // nondeterminism (pitfalls §12). To silence it, entry-client can gate:
    // `el.firstChild ? hydrateRoot(el, app) : createRoot(el).render(app)`.
  }
});
```

## 7. `vite.config.ssr.ts` (dedicated SSR build)

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  // root: makes dependency externalization deterministic no matter what cwd the
  // build is invoked from (a foreign cwd otherwise silently bundles react-dom
  // into the SSR output); it also makes pitfall 3's "project root as base"
  // literally true rather than cwd-dependent.
  root: import.meta.dirname,
  mode: "production", // defense-in-depth (emit `jsx` not `jsxDEV`) — but Vite
  define: { "process.env.NODE_ENV": JSON.stringify("production") }, // keeps a
  // pre-existing NODE_ENV, so these do NOT override an inherited
  // NODE_ENV=development — the `NODE_ENV=production` prefix on the build command
  // (§8) is what actually controls the JSX runtime. Never skip the prefix.
  // Plugin rule: omit ONLY the template's OWN dev-tooling — jsxLocPlugin (adds
  // data-loc attributes; attribute-only diffs don't affect React 19 hydration,
  // and omitting them keeps source paths out of crawler-visible HTML),
  // vite-plugin-manus-runtime and the debug collector (transformIndexHtml /
  // dev-server hooks — no-ops in an --ssr build). But COPY every plugin the
  // PROJECT added that transforms application source or assets (vite-plugin-svgr,
  // glsl/wasm loaders, imagetools, markdown-import plugins): the SSR bundle
  // compiles the same sources and fails — sometimes only at render time —
  // without them.
  plugins: [react(), tailwindcss()],
  resolve: {
    // Copy EVERY resolve.alias from the project's vite.config.ts — a missing
    // alias (the template also ships "@assets") fails ONLY the SSR build.
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  // ssr.noExternal is ONLY for deps Node cannot load natively — top-level .css
  // imports (§10) or CJS/ESM mixtures (pitfalls §14). The template's own deps
  // need NO entries (lucide-react loads fine externalized — verified). Any entry
  // added here must ALSO be added to ssr.noExternal in the MAIN vite.config.ts:
  // dev's ssrLoadModule resolves through that config (setupVite spreads it), so
  // a one-config entry fixes prod but leaves dev crashing (pitfalls §14).
  // ssr: { noExternal: ["<only-if-needed>"] },
  build: {
    ssr: path.resolve(import.meta.dirname, "client/src/entry-server.tsx"),
    outDir: path.resolve(import.meta.dirname, "dist/server-ssr"),
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: "entry-server.js" } },
  },
});
```

## 8. `package.json` build script

```json
"build": "NODE_ENV=production vite build && NODE_ENV=production vite build --config vite.config.ssr.ts && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
```

Three artefacts: `dist/public` (client), `dist/server-ssr/entry-server.js` (SSR bundle), `dist/index.js` (bundled Express server). `NODE_ENV=production` must prefix **the whole chain**, not just the SSR leg: in a NODE_ENV=development environment the SSR leg fails loudly (`jsxDEV`, pitfall §2) but the client leg fails SILENTLY — it ships a development React bundle to production.

## 9. `client/src/components/Head.tsx` (client title sync)

On SSR the correct `<title>` is baked into the HTML. On client-side navigation, a small `Head` component (mounted in `App`) sets `document.title` per route via wouter's `useLocation`. Detail pages with dynamic titles call `useDocumentTitle(title)` once their data arrives.

```tsx
import { useEffect } from "react";
import { useLocation } from "wouter";

// ═══ EDIT PER PROJECT — site title and route map ═══
// Keep SITE in sync with ssr/prefetch.ts AND the SITE_NAME env var (server
// vite.ts). Best: define it once in shared/ (NOT in prefetch.ts — that file
// value-imports @trpc/server and is server-graph-only; shared/ has no such
// deps, so it is safe to import from Head.tsx, prefetch.ts, and vite.ts alike).
const SITE = "…site title…";
const ROUTE_TITLES: Record<string, string> = {
  "/": SITE,
  "/practice-areas": `业务领域 · ${SITE}`,
  "/attorneys": `律师团队 · ${SITE}`,
  // …static public routes; dynamic detail pages use useDocumentTitle instead…
};

export function Head() {
  const [location] = useLocation();
  useEffect(() => {
    const t = ROUTE_TITLES[location.replace(/\/+$/, "") || "/"];
    if (t) document.title = t;
  }, [location]);
  return null;
}

/** For detail pages: call with the fetched record's title. */
export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    // Guard whitespace-only titles (empty UGC records) — mirror the §4 detail
    // branch so a title-less page shows SITE, not "· SITE".
    document.title = title?.trim() ? `${title} · ${SITE}` : SITE;
  }, [title]);
}
```

> Routes missing from `ROUTE_TITLES` keep the PREVIOUS route's title on client-side navigation (the `if (t)` guard skips them) — add entries for gated sections too (`"/app": ...`, prefix-matched if needed), or knowingly accept the stale tab title there. Do NOT "fix" it with a bare `?? SITE` fallback: Head's effect also fires on navigations and would clobber detail-page titles set by `useDocumentTitle`.

> **Two title buckets only — a query-parameterized list belongs to NEITHER.** A paginated list (`/news?page=N`) whose title varies by query cannot use `ROUTE_TITLES` (wouter's `useLocation()` strips the query, so `"/news"` would clobber the SSR-baked page-N title on load and pin the page-1 title after client navigation). Keep such routes OUT of `ROUTE_TITLES`; in the page component derive the title from `useSearch` (not `useLocation`) and pass it to `useDocumentTitle`, mirroring the §4 branch — e.g. `const page = Number(new URLSearchParams(useSearch()).get("page")) || 1; useDocumentTitle(page > 1 ? \`法律资讯 · 第${page}页\` : "法律资讯");`. Likewise a **dynamic detail** pattern (`/news/:slug`) must NOT be added to `ROUTE_TITLES` (the exact-string lookup never matches `/news/foo`) — use `useDocumentTitle(record.title)` inside the page.

## 10. Handling SSR-hostile deps (streamdown, maps, editors, charts)

The template's `streamdown` renderer imports a `.css` chain (`katex.min.css`) that Node's ESM loader cannot evaluate. The same class of failure comes from deps that touch `window`/`document` at **module scope** (leaflet, mapbox-gl, quill, tiptap, some chart libs) — a `ReferenceError` at import time that no `typeof window` guard in app code can fix (pitfalls §1b). Both fail the moment the dep enters the **server** module graph.

**The criterion is the STATIC IMPORT GRAPH from App/entry-server — not which route renders the component.** A top-level import inside an auth-gated-only page still evaluates on every SSR request and takes down public pages too.

**Grep first — do not assume where it lives:**

```bash
grep -rn "streamdown" client/src --include="*.tsx" --include="*.ts"
# repeat for any dep named in the [SSR] render failed stack trace
```

In the **fresh template** the grep hits TWO files: the public `pages/Home.tsx` (module top-level import — in the static graph from App, this is what crashes SSR) and `components/AIChatBox.tsx` (reachable only via the *unrouted* `ComponentShowcase` demo page, so NOT in the graph on a fresh template — auth-gating would not have saved it either way; any project that routes `ComponentShowcase` or reuses `AIChatBox` puts it back in the graph). Real projects usually rewrite `Home.tsx`, but verify — every grep hit REACHABLE from App/entry-server must be handled.

Do NOT globally replace streamdown: it ships KaTeX math, Shiki code highlighting, Mermaid, and streaming-tolerant parsing. **Raw-HTML note (verified on streamdown 1.4.0): streamdown's default `rehypePlugins` include `rehype-raw`, so it RENDERS embedded raw HTML as real elements by default** (it even passes `<script>` through — a UGC hazard). A `marked`-based swap silently loses math/highlighting/Mermaid and changes behavior far beyond SSR.

Pick the option by the CONTENT'S ROLE, not blindly in order:

- Dep used only in chat boxes / editors / admin panels (not page content) → **option 1**.
- The rendered output IS the page's primary crawlable content (blog/article body) → **option 0 (`ssr.noExternal`) if the dep is only loader-hostile (streamdown's crash is a `.css` import, not a `window` access) — it keeps the exact renderer with zero component changes**; fall back to option 3 only when noExternal cannot apply (dep touches `window`/`document` at module scope). Option 2 would feed crawlers raw markdown source (headings/links/alt text lost) — unacceptable when the body is the SEO deliverable.
- Secondary markdown snippets on public pages (bio blurbs, short descriptions) → **option 2** is fine.

0. **Bundle it through Vite (`ssr.noExternal`) — for LOADER-hostile deps only, zero behavior change (verified for streamdown 1.4.0).** If the dep's only obstacle is a top-level `.css` import (streamdown → `katex.min.css`) or a CJS/ESM mixture — NOT a `window`/`document` access at module scope — add it to `ssr.noExternal` in **BOTH** vite configs (pitfalls §14): Vite transforms the dep and compiles the `.css` import away, in dev `ssrLoadModule` and in the prod `--ssr` bundle alike, so the SSR HTML is the dep's OWN full render with no component change. Best option when the rendered output is the page's primary crawlable content — it keeps KaTeX/Shiki/Mermaid and the exact typography.
   ```ts
   // vite.config.ssr.ts AND vite.config.ts:
   ssr: { noExternal: ["streamdown"] },
   ```
   Costs: the dep evaluates and renders on every SSR request and joins the SSR bundle. Verify: `grep -c '\.css' dist/server-ssr/entry-server.js` stays 0 and `curl … | grep` finds a rendered heading. This does NOT work for §1b deps that touch browser globals at module scope (the transformed code still runs in Node) — use option 1/2/3 for those.
1. **Keep it out of the server graph (zero behavior change).** Lazy-load the component that imports it, so the SSR bundle never evaluates the dep:
   ```tsx
   // React.lazy needs a DEFAULT export. The template's AIChatBox is a NAMED
   // export — map it (same pattern as option 2 below); only a default-exported
   // component can use the bare `React.lazy(() => import("..."))` form.
   const AIChatBox = React.lazy(() =>
     import("@/components/AIChatBox").then(m => ({ default: m.AIChatBox })));
   // render inside <Suspense>
   ```
2. **Client-only mount.** SSR outputs the raw text (crawlers still see *something*), the real renderer mounts after hydration. ⚠ A mounted-gate alone is NOT enough for an import-time crasher like streamdown: gating the *render* does not remove a top-level `import` from the server module graph — dev's `ssrLoadModule` evaluates it and dies on the `.css` chain before any component ever runs. Pair the gate with a dynamic import so the dep leaves the graph entirely:
   ```tsx
   const Streamdown = React.lazy(() =>
     import("streamdown").then(m => ({ default: m.Streamdown })));

   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);
   const plain = <div className="whitespace-pre-wrap">{md}</div>;
   return mounted
     ? <Suspense fallback={plain}><Streamdown>{md}</Streamdown></Suspense>
     : plain;
   ```
   (A bare mounted-gate without the lazy import is only sufficient for deps whose import is clean and that touch `window` during *render*.) For visual widgets (maps/charts/carousels) the placeholder must **reserve the widget's dimensions** (fixed-height div), or every SSR load ships layout shift.
3. **Replace the renderer for that page only** (fallback when option 0 can't apply, or you deliberately want a lighter renderer). Use `react-markdown` + `remark-gfm` (add `rehype-katex` / a highlighting plugin only if the content uses math/code) — SSR-safe. Porting rules:
   - **Raw HTML differs from streamdown — check before swapping.** react-markdown 10.x ESCAPES embedded raw HTML to visible literal text by default, whereas streamdown RENDERS it (see the raw-HTML note above). So `grep` the content source for inline `<` HTML first; if the body relies on it (`<br>`, `<img>`, embedded `<div>`/`<iframe>` from a CMS), a bare swap ships angle-bracket garbage as your SEO body text — add `rehype-raw` (SSR-safe in Node, verified) paired with a sanitizer (`rehype-sanitize`, or `rehype-harden` placed AFTER `rehype-raw`) to match streamdown, and eyeball one such snippet in the SSR HTML (verify-ssr.sh's plain-text needles still match escaped output, so they CANNOT catch this).
   - **Plugin CSS must NOT enter the server graph.** `rehype-katex`/highlight plugins emit unstyled markup that needs `katex/dist/katex.min.css` / a highlight theme `.css` to match the prior rendering — but importing that CSS from the (server-graph) page component re-triggers the exact pitfalls §5 `.css` crash you swapped to escape. Import the plugin CSS ONLY from `entry-client.tsx` (client graph, like the existing `import "./index.css"`) or link a built hashed stylesheet, never from a module reachable from entry-server; verify `grep -c '\.css' dist/server-ssr/entry-server.js` stays 0.
   - Port EVERY prop from the existing `<Streamdown …>` call site (`components`, plugins, `className`); if the page builds a TOC or is deep-linked by `#heading-id`, make the replacement emit identical ids (`rehype-slug` or the project's slugger — note a CJS/JS slugger may differ from streamdown's for CJK headings) and spot-check one anchor (`curl … | grep 'id="…"'`).
   - Styling: streamdown's typography is BUILT INTO its own components (hardcoded Tailwind classes), so the page usually has no wrapper classes to "reuse" — a bare react-markdown swap renders unstyled. Recreating equivalent typography is required, not scope creep: scope a minimal prose ruleset to the markdown container (or copy streamdown's own classes). "Match the prior rendering" — never ship unstyled markdown, and never use the swap to redesign. Disclose which capabilities (math/highlighting/Mermaid) the chosen plugins do or do not cover.

## 11. Multi-locale (i18n) sites — compact rules

Only relevant if the project has locale-prefixed routes (`/en/...`, `/zh/...`) or an i18n library. Then:

- **Locale is a per-request render input — never ambient detection.** Derive it from the URL prefix inside `render(url, prefetch)`; browser detectors (`navigator`, `localStorage`) crash or lie in Node. With i18next: per-request instance (`i18next.cloneInstance({ lng })` via `I18nextProvider`) — `changeLanguage` on a shared module singleton races across concurrent requests. Bundle translation resources synchronously (`initImmediate: false`).
- **Factor the locale out of the route tables ONCE**: strip the prefix at the top of `prefetchForPath` (and Head.tsx), keep a single set of branches parameterized by locale with per-locale SITE/DESC/title tables; unknown prefixes fall through to the 404 default. Include the locale in every prefetch input exactly as the component passes it (the exact-key rule).
- **Head**: set `HeadMeta.locale` per route (og-style `zh_CN` — buildHeadTags emits it as og:locale). For `<html lang>`, add a `lang="<!--app-lang-->"` placeholder in index.html plus one more function-form replace in composeHtml (`head.locale?.replace("_", "-") ?? "<default>"` — hreflang/lang use BCP-47, og:locale uses underscores); sync `document.documentElement.lang` in Head.tsx on navigation. If locale-equivalent pages exist, emit `<link rel="alternate" hreflang="…">` pairs + `x-default`.
- **One canonical form for the default locale** (always-prefixed OR never-prefixed — pick one), enforced with a 301 in the same middleware block as the trailing-slash rule; otherwise `/` and `/zh/...` index as full duplicates. If auto-redirecting `/` by `Accept-Language`: **302 + `Vary: Accept-Language`**, never a cacheable 301 (cache poisoning + it locks crawlers out of the other locale).
