# 0004. Authentication and authorization strategy

- Status: accepted
- Date: 2026-06-28

## Context

The application is a private tool used by exactly two people (the owner and his father). There is no concept of public access, self-registration, or multi-tenancy. All routes — both web UI and REST API — must be protected from unauthenticated access.

The data layer uses raw `pg` against Supabase Postgres; the Supabase JS client is not used anywhere in the codebase.

## Decision

### Authentication: Auth.js v5 with Google OAuth (OIDC)

Use **Auth.js v5** (`next-auth@beta`) as the authentication library, configured with the Google provider. Google's OAuth 2.0 / OIDC endpoint verifies the user's identity and returns an `id_token`; Auth.js extracts the email claim and then discards Google's token. No Supabase Auth, no custom OAuth implementation.

**Rationale over Supabase Auth**: Supabase Auth requires `@supabase/supabase-js` and `@supabase/ssr`. Since the data layer already uses raw `pg`, adding the Supabase JS client solely for auth would introduce two ways of talking to Supabase — an unnecessary coupling with no benefit.

### Sessions: JWT cookie, no database table

Sessions are stored as a signed, HTTP-only, `SameSite=Lax` JWT cookie managed by Auth.js. No session table in the database. The cookie is self-contained and requires no server round-trip to validate — a prerequisite for future offline/PWA work.

### Authorization: email-based allowlist via environment variable

Access is controlled by an `ALLOWED_EMAILS` environment variable (comma-separated). The `signIn` callback in Auth.js rejects any Google account whose email is not on the list. There is no role system, no user table, and no UI for managing access.

### Enforcement: Next.js middleware (single chokepoint)

A single `middleware.ts` file guards every request before it reaches any route handler or page. Behaviour differs by path:

- `/api/**` (excluding `/api/auth/**`): unauthenticated requests receive `HTTP 401 { "error": "Unauthorized" }`
- All other routes (excluding `/login`): unauthenticated requests are redirected to `/login`

This keeps auth enforcement out of individual route handlers — no per-handler auth checks are needed or expected.

## Consequences

Positive:
- Single enforcement point — impossible to accidentally expose a route by forgetting a handler-level check.
- No database schema changes required for auth.
- JWT cookie is offline-compatible for future PWA work.
- Allowlist is explicit, auditable configuration rather than implicit database state.
- Auth library is decoupled from the data layer.

Negative:
- Google is the sole identity provider — if Google OAuth is unavailable, both users are locked out.
- Rotating `AUTH_SECRET` invalidates all existing sessions (both users must re-login).
- `ALLOWED_EMAILS` changes require a Vercel environment variable update and redeployment.

Neutral:
- If the user base ever grows or roles are needed, this ADR should be superseded with a proper identity/authorization model.
