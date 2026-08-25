---
name: webdev-manus-oauth
description: Manus webdev fullstack (web-db-user) projects — Manus OAuth redirect URL handling, invite and magic links.
---

## Manus OAuth

**Key Rule:** When handling redirect URLs, always use `window.location.origin` and never hardcode domains or use `req.host`. This is because the frontend and the backend are deployed on separate servers. The server cannot reliably determine the frontend's origin and so the frontend must always pass it explicitly.

**Unsupported browsers:**
- Safari Private Browsing (blocks all cookies)
- Firefox with Enhanced Tracking Protection (Strict)
- Brave with Shields (Aggressive)
- Any browser with "Block all cookies" enabled

Manus OAuth requires cookies to maintain session state. If a user's browser blocks cookies, authentication will not work.

**Anti-patterns:**
```ts
// ❌ Guessing the URL doesn't allow you to redirect to the actual domain that the user is using
const appId = process.env.VITE_APP_ID || "";
const prefix = appId.substring(0, 8);
const baseUrl = `https://myapp-${prefix}.manus.space`;
const invitationUrl = `${baseUrl}/invite/${token}`;

// ❌ Same thing here, we should make sure that this information is preserved
const url = `https://${projectName}.manus.space/callback`;

// ❌ Setting subdomains here risks a chance of the env var being out of date.
const url = `https://${process.env.APP_SUBDOMAIN}.example.com/verify`;
```

The only correct approach: Frontend passes `window.location.origin` to the backend.

## Determining the URL

On the frontend, use `window.location.origin`:

```ts
// ✅ Always use window.location.origin
const frontendUrl = window.location.origin;
// Returns: "https://myapp.manus.space" (no trailing slash)

// For specific paths
const callbackUrl = `${window.location.origin}/api/oauth/callback`;
// Returns: "https://myapp.manus.space/api/oauth/callback"
```

The callback redirect URI is carried in `state`. But `state` is fully
attacker-controllable, so you MUST also bind it to the browser that started the
login with a one-time nonce. Skip this and you have an OAuth login CSRF /
session-fixation hole: a victim can be silently signed into the attacker's
account (they redeem the attacker's `code`), leaking everything the victim then
enters into that account.

**The template already implements this whole flow** — `encodeOAuthState` /
`decodeOAuthState` live in `@shared/const`, and the complete callback is
registered by `registerOAuthRoutes` in `server/_core/oauth.ts`. Do NOT hand-roll
a second callback; the snippets below show the mechanism so you can recognize
and preserve it when editing.

```ts
// Frontend: mint a one-time nonce, keep one copy in a host-only cookie and
// echo the other in `state`.
import { encodeOAuthState } from "@shared/const";

export const getLoginUrl = () => {
  const redirectUri = `${window.location.origin}/api/oauth/callback`;

  const nonce = crypto.randomUUID();
  // The __Host- prefix forces the cookie host-only (Secure, Path=/, no Domain),
  // so a sibling *.manus.space site cannot plant a matching value.
  document.cookie = `__Host-oauth_state=${nonce}; Path=/; Max-Age=600; SameSite=None; Secure`;

  const state = encodeOAuthState({ redirectUri, nonce });

  const params = new URLSearchParams({
    app_id: APP_ID,
    redirect_url: redirectUri,
    state,
  });

  return `${OAUTH_PORTAL_URL}/login?${params.toString()}`;
};
```

On the callback, compare the two copies BEFORE redeeming the `code`, and fail
closed on any mismatch:

```ts
// Backend: verify the nonce, then exchange the code (server/_core/oauth.ts).
import { OAUTH_STATE_COOKIE, decodeOAuthState } from "@shared/const";

router.get("/api/oauth/callback", async (req, res) => {
  const { code, state } = req.query;

  // ✅ CSRF guard: the state nonce must match the cookie set at login start.
  // decodeOAuthState never throws — malformed state yields no nonce → 403.
  const { nonce } = decodeOAuthState(state as string);
  const expected = parseCookie(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
  if (!nonce || nonce !== expected) {
    res.status(403).json({ error: "invalid oauth state" });
    return; // never exchange the code on mismatch
  }
  res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });

  // ✅ Pass the RAW `state` — the SDK decodes the redirectUri out of it itself.
  const token = await sdk.exchangeCodeForToken(code as string, state as string);
  res.cookie(COOKIE_NAME, token, cookieOptions);

  // ✅ Redirect to a fixed in-app path — never to a URL taken from user input.
  res.redirect("/");
});
```

**Two important properties of the nonce/cookie flow:**

- **Mint the nonce only when you actually navigate to the login URL** (in the click handler or a redirect effect), never on every render — otherwise a re-render overwrites the cookie and desyncs it from an in-flight `state`, and your own guard 403s the login.
- **`decodeOAuthState` must never throw** — the callback receives a fully user-controlled `state`, so a malformed value must fail closed (return an empty/nonce-less result → 403), not raise; the `@shared/const` implementation already does this — always decode through it, never inline `JSON.parse(atob(...))`. On Express 4 an async throw here has no error wrapper and can hang the request or crash the process.

The nonce cookie is `Secure`, so the login flow requires a context where cookies can be set and sent: production HTTPS works; local `http://localhost` works in Chrome/Firefox; a plain-HTTP non-localhost address or a cookie-blocked embedded context (Safari ITP iframe, some WebViews) will fail closed. Manus preview auto-login does not go through this redirect flow, so it is unaffected.

## Generating Invite URLs / Redirect URLs

When the backend needs to generate URLs (magic links, invitations, email verification), the frontend must pass its origin in the request.

```ts
// Frontend: Pass origin in tRPC calls
const createInvite = trpc.invites.create.useMutation();
await createInvite.mutateAsync({
  eventId: "123",
  origin: window.location.origin, // ✅ Always pass this
});
```

This ensures that the backend knows where to redirect the user after the invite is accepted.

```ts
// Backend: Use the passed origin
createInvite: protectedProcedure
  .input(z.object({
    eventId: z.string(),
    origin: z.string().url(),
  }))
  .mutation(async ({ input }) => {
    const { eventId, origin } = input;
    const token = generateToken();

    // ✅ Use the origin passed from frontend
    const inviteUrl = `${origin}/events/${eventId}/join?token=${token}`;

    return { inviteUrl };
  }),
```
