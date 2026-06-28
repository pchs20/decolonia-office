## Why

The application currently has no authentication — all routes and API endpoints are completely open. It needs to be protected so that only two authorised users (the owner and his father) can access it. Google OAuth is the chosen identity provider since both users have Google accounts.

## What Changes

- Add Auth.js v5 with Google OAuth provider to the Next.js app
- Add a `/login` page with a "Sign in with Google" button
- Add `middleware.ts` that guards all routes:
  - `/api/**` returns `401 { "error": "Unauthorized" }` for unauthenticated requests
  - All other routes redirect to `/login` for unauthenticated requests
- Email allowlist via `ALLOWED_EMAILS` environment variable (comma-separated)
- Sessions are JWT-based, stored in a signed HTTP-only cookie — no DB changes needed

## Capabilities

### New Capabilities

- `google-auth`: Google OAuth login flow, session management, and route protection via middleware with an email-based allowlist

### Modified Capabilities

<!-- None — no existing spec-level requirements change -->

## Impact

- **New dependency**: `next-auth@beta` (Auth.js v5)
- **New files**: `middleware.ts`, `app/auth.ts`, `app/api/auth/[...nextauth]/route.ts`, `app/login/page.tsx`
- **Edited**: `app/layout.tsx` (wrap with `SessionProvider`)
- **New env vars**: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `ALLOWED_EMAILS`
- No database schema changes
- No changes to existing API route handlers
