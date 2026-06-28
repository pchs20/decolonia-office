## 1. Dependencies

- [x] 1.1 Install `next-auth@beta` in `apps/web`
- [x] 1.2 Configure Google OAuth credentials in Google Cloud Console (add authorised redirect URI: `{origin}/api/auth/callback/google` for both dev and prod origins)

## 2. Auth.js Core Setup

- [x] 2.1 Create `apps/web/app/auth.ts` — Auth.js config with Google provider, `signIn` callback that enforces `ALLOWED_EMAILS` allowlist, and JWT session strategy
- [x] 2.2 Create `apps/web/app/api/auth/[...nextauth]/route.ts` — export GET and POST handlers from `app/auth.ts`

## 3. Middleware

- [x] 3.1 Create `apps/web/middleware.ts` — read Auth.js session, distinguish `/api/**` (return 401 JSON) from web routes (redirect to `/login`), exclude `/login` and `/api/auth/**` from protection

## 4. Login Page

- [x] 4.1 Create `apps/web/app/login/page.tsx` — minimal login page with "Sign in with Google" button using Auth.js `signIn("google")`
- [x] 4.2 Add sign-out button/action to the app shell (e.g. in `AppShell`) using Auth.js `signOut()`

## 5. Session Provider

- [x] 5.1 Wrap `apps/web/app/layout.tsx` with Auth.js `SessionProvider` so client components can access session

## 6. Environment Variables

- [x] 6.1 Add `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `ALLOWED_EMAILS` to local `.env.local`
- [x] 6.2 Set the same variables in Vercel environment (Preview and Production) — `ALLOWED_EMAILS` to the two authorised email addresses

## 7. Verification

- [x] 7.1 Verify unauthenticated browser request to `/clients` redirects to `/login`
- [x] 7.2 Verify unauthenticated `fetch /api/clients` returns `401 { "error": "Unauthorized" }`
- [x] 7.3 Verify sign-in with an allowlisted Google account grants access and sets session cookie
- [x] 7.4 Verify sign-in with a non-allowlisted Google account is rejected
- [x] 7.5 Verify sign-out clears the session and redirects to `/login`
- [x] 7.6 Verify authenticated requests to all existing API routes still work normally
