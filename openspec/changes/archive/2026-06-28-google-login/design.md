## Context

The application is a Next.js 15 App Router app deployed on Vercel. Currently there is no authentication — all routes (`(web-routes)/**`) and all API endpoints (`/api/**`) are completely open. The app is a private tool used by exactly two people (the owner and his father), both of whom have Google accounts. There is no concept of public access or self-registration.

The data layer uses raw `pg` against Supabase Postgres. The Supabase JS client is not used anywhere.

## Architecture Diagrams

```
┌───────────────────────────────────────────────────────────────┐
│                        Browser                                │
│                                                               │
│  1. Request any protected route                               │
│  2. No session cookie → redirected to /login                  │
│  3. Click "Sign in with Google" → OAuth dance                 │
│  4. Auth.js callback → sets JWT cookie                        │
│  5. Redirect to original destination                          │
└──────────────┬───────────────────────────────────────────────┘
               │
               ▼
┌───────────────────────────────────────────────────────────────┐
│  middleware.ts  (runs on every request except /login, /_next) │
│                                                               │
│  path starts with /api ?                                      │
│    yes → no session → 401 { error: "Unauthorized" }           │
│    no  → no session → redirect /login                         │
│                                                               │
│  session email ∉ ALLOWED_EMAILS ?                             │
│    → 403 { error: "Forbidden" } (API) / redirect /login (web) │
└──────────────┬────────────────────────────────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
  Web routes        API routes
  (web-routes)/**   /api/**
       │                │
       └───────┬────────┘
               ▼
       raw pg → Supabase Postgres
       (auth layer does NOT touch the DB)
```

## Goals / Non-Goals

**Goals:**
- Prevent unauthenticated access to all routes and API endpoints
- Use Google as the sole identity provider
- Keep the allowlist configurable via environment variable
- JWT sessions — no database schema changes
- Middleware-level enforcement (single chokepoint)
- Compatible with future PWA/offline improvements

**Non-Goals:**
- User management UI (no sign-up, no user table, no profile pages)
- Role-based access control
- API key or machine-to-machine auth
- Multi-provider auth
- Session storage in the database

## Decisions

### Decision 1: Auth.js v5 (NextAuth) over Supabase Auth

**Choice**: Auth.js v5

**Rationale**: The data layer uses raw `pg` — not the Supabase JS client. Adding Supabase Auth would introduce `@supabase/supabase-js` + `@supabase/ssr` solely for authentication while data access remains via `pg`. That split — two ways of talking to the same Postgres — adds accidental complexity. Auth.js keeps auth cleanly separated: one library for auth, `pg` for data.

**Alternative considered**: Supabase Auth — rejected because it would couple auth to the Supabase JS client without benefit given the existing raw `pg` data layer.

### Decision 2: JWT sessions (cookie-based, no DB)

**Choice**: JWT sessions stored in a signed, HTTP-only cookie

**Rationale**: With only two users and no server-side session revocation requirement, JWT cookies are sufficient. No migration needed. No session table. Additionally, JWT cookies are self-contained — a prerequisite for future offline/PWA work where the app may need to know the authenticated user without a server round-trip.

**Alternative considered**: Database sessions — rejected as unnecessary complexity for 2 users with no revocation requirement.

### Decision 3: Email allowlist via `ALLOWED_EMAILS` env var

**Choice**: `ALLOWED_EMAILS=email1@gmail.com,email2@gmail.com` parsed at runtime in the Auth.js `signIn` callback and in middleware

**Rationale**: No user table needed. Simple to change (update Vercel env var). Transparent — the allowlist is explicit configuration, not implicit database state.

### Decision 4: API routes return 401, web routes redirect

**Choice**: Middleware distinguishes by path prefix — `/api/**` gets JSON error responses, everything else gets a redirect to `/login`

**Rationale**: API clients (fetch calls from the web app) cannot follow HTML redirects gracefully. A redirect to the login page returns HTML, which the app would silently ignore or misparse. A 401 JSON response lets the frontend handle the error explicitly.

### Decision 5: Auth.js config at `src/auth.ts`, handler at `app/api/auth/[...nextauth]/route.ts`

**Choice**: `src/auth.ts` for the Auth.js config (not `app/auth.ts`) because the project's `@/` path alias maps to `src/`, making `@/auth` resolvable from middleware and all app routes. The catch-all handler lives at `app/api/auth/[...nextauth]/route.ts` per Auth.js App Router convention.

## Risks / Trade-offs

- **Google as single provider**: If Google OAuth is unavailable, both users are locked out. Accepted — the owners are aware of this limitation.
- **Long-lived JWT cookies**: If a cookie is stolen, there is no server-side revocation. Mitigated by HTTPS-only (Vercel enforces this), `HttpOnly`, and `SameSite=Lax` cookie attributes set by Auth.js by default.
- **`AUTH_SECRET` rotation**: Rotating `AUTH_SECRET` invalidates all existing sessions. Both users would need to log in again. Acceptable for a 2-user app.
- **`ALLOWED_EMAILS` env var**: A Vercel env var change requires a redeployment to take effect. Acceptable given the static user base.

## Migration Plan

1. Install `next-auth@beta`
2. Create `src/auth.ts` with Google provider and email allowlist callback
3. Create `src/lib/allowed-emails.ts` — shared allowlist parsing used by both auth config and middleware
4. Create `app/api/auth/[...nextauth]/route.ts`
5. Create `app/login/page.tsx`
6. Create `middleware.ts` with path-aware guard (401 unauthenticated, 403 forbidden)
7. Wrap root `app/layout.tsx` with `SessionProvider`
8. Set env vars: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `ALLOWED_EMAILS`
9. Configure Google OAuth credentials in Google Cloud Console (authorised redirect URI: `{origin}/api/auth/callback/google`)
10. Deploy and verify

**Rollback**: Remove `middleware.ts` — all routes become open again instantly.

## Open Questions

None outstanding. All design decisions resolved during exploration.
