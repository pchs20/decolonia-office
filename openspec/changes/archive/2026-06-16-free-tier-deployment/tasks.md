## 1. Repository & Branch Setup

- [x] 1.1 Create the `prod` long-lived branch from `main` and push it to origin
- [x] 1.2 Configure the Vercel project root directory as `apps/web` during import or in project settings
- [x] 1.3 Add `.env.example` entries for `DATABASE_URL`, `DEV_DIRECT_URL`, and `PROD_DIRECT_URL` with placeholder values and inline comments explaining each

## 2. PWA Assets & Layout

- [x] 2.1 Create 192×192 and 512×512 PNG icon files and place them in `apps/web/public/icons/`
- [x] 2.2 Create `apps/web/public/manifest.json` with `name`, `short_name`, `start_url: "/"`, `display: "standalone"`, `background_color`, `theme_color`, and both icon entries
- [x] 2.3 Add `<link rel="manifest" href="/manifest.json">` to `apps/web/app/layout.tsx` `<head>`
- [x] 2.4 Add `theme-color`, `apple-mobile-web-app-capable`, and `apple-mobile-web-app-status-bar-style` meta tags to `apps/web/app/layout.tsx` `<head>`

## 3. Account Setup (one-time, manual)

- [x] 3.1 Create a Vercel account at vercel.com and connect the GitHub user/org
- [x] 3.2 Create Supabase account at supabase.com
- [x] 3.3 Create Supabase project `decolonia-dev` (nearest EU region — Ireland or Frankfurt)
- [x] 3.4 Create Supabase project `decolonia-prod` (same region)
- [x] 3.5 For each project: copy the pooler URL (port 6543, append `?pgbouncer=true`) and the direct URL (port 5432) from Supabase Settings → Database → Connection String

## 4. Database Migration — Dev

- [x] 4.1 Set `DEV_DIRECT_URL` locally to the `decolonia-dev` direct connection URL (optional if using SQL Editor)
- [x] 4.2 Run the migration against dev by executing `apps/api/src/migrations/1718394400000-CreateClientsTable.sql` in Supabase SQL Editor
- [x] 4.3 Verify the `clients` table exists in the Supabase dev table editor

## 5. Vercel Project Setup

- [x] 5.1 Import the GitHub repo into Vercel (dashboard or `vercel link`)
- [x] 5.2 In Vercel Settings → Git: change Production Branch from `main` to `prod`
- [x] 5.3 Add `DATABASE_URL` as a **Preview** environment variable → `decolonia-dev` pooler URL
- [x] 5.4 Add `DATABASE_URL` as a **Production** environment variable → `decolonia-prod` pooler URL
- [x] 5.5 Trigger a deploy of the `main` branch (or push a commit to `main`)

## 6. Dev Environment Validation

- [x] 6.1 Confirm `/api/health` returns HTTP 200 on the stable `main` Preview URL
- [x] 6.2 Confirm `/api/health/connectivity` returns HTTP 200 with DB status confirmed
- [x] 6.3 Confirm `/api/clients` returns HTTP 200 with a valid paginated response
- [x] 6.4 Confirm `/api/docs` renders Swagger UI with the OpenAPI definition loaded

## 7. Database Migration — Prod

- [x] 7.1 Set `PROD_DIRECT_URL` locally to the `decolonia-prod` direct connection URL (optional if using SQL Editor)
- [x] 7.2 Run the migration against prod by executing `apps/api/src/migrations/1718394400000-CreateClientsTable.sql` in Supabase SQL Editor
- [x] 7.3 Verify the `clients` table exists in the Supabase prod table editor

## 8. Production Promotion & Validation

- [x] 8.1 Promote to production: `git checkout prod && git merge main && git push`
- [x] 8.2 Confirm `/api/health` returns HTTP 200 on the Vercel Production URL
- [x] 8.3 Confirm `/api/health/connectivity` returns HTTP 200 with DB status confirmed
- [x] 8.4 Confirm `/api/clients` returns HTTP 200 with a valid paginated response
- [x] 8.5 Confirm `/api/docs` renders Swagger UI on the Production URL

## 9. iPad PWA Validation

- [x] 9.1 On iPad Safari, visit the Production URL and tap "Add to Home Screen"
- [x] 9.2 Launch the app from the iPad home screen and confirm it opens in standalone mode (no Safari navigation bar)
- [x] 9.3 Confirm the configured icon appears correctly on the home screen

## 10. README Documentation

- [x] 10.1 Add a "Deployment Environments" section explaining the `main` → dev (Preview) and `prod` → production branch model
- [x] 10.2 Document the promote-to-production command (`git checkout prod && git merge main && git push`)
- [x] 10.3 Document the migration procedure with step-by-step instructions for both dev and prod, including where to find each URL in the Supabase dashboard
- [x] 10.4 Add a note about Supabase free-tier DB pause policy (1 week inactivity) and how to resume
- [x] 10.5 Update environment variable table to include `DEV_DIRECT_URL` and `PROD_DIRECT_URL` with descriptions
