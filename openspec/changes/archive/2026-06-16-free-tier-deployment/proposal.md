## Why

The app runtime and serverless API model are already in place locally, but there is no deployment target defined. Formalising the free-tier production stack (Vercel Hobby + Supabase Postgres) is the next step to make the project shippable without any paid infrastructure.

## What Changes

- Add Vercel deployment configuration (project settings, root directory selection, environment variable definitions) with the Vercel production branch set to `prod`; merges to `main` auto-deploy to a stable Preview URL (dev environment).
- Create a long-lived `prod` branch; merging `main` → `prod` triggers the Vercel Production deployment.
- Add two Supabase Postgres projects (dev + prod); wire each to the corresponding Vercel environment via `DATABASE_URL`.
- Document manual migration workflow with explicit per-environment scripts (`DEV_DIRECT_URL`, `PROD_DIRECT_URL`) and a promote checklist in the README.
- Add PWA manifest and viewport meta so the web app is installable on iPad via "Add to Home Screen".
- Document production operational limits and accepted constraints (cold starts, connection pooling, Supabase free-tier row/storage limits).
- No new REST endpoints or API contract changes; the `/api/clients`, `/api/health`, and `/api/docs` surfaces remain as-is.

## Capabilities

### New Capabilities
- `vercel-deployment`: Vercel Hobby deployment configuration — `apps/web` selected as the Vercel root directory, `prod` branch as Vercel production branch, per-environment `DATABASE_URL` wiring, and the deploy/promote workflow.
- `supabase-postgres`: Two Supabase free-tier Postgres projects (dev + prod) — provisioning steps, connection string environment variables, manual migration scripts, and accepted operational constraints.
- `pwa-installability`: PWA manifest (`manifest.json`), `<link rel="manifest">`, and viewport/theme-color meta tags to make the web app installable on iPad via "Add to Home Screen".

### Modified Capabilities
<!-- No existing spec-level requirements are changing. Implementation details in
     platform-bootstrap-and-local-connectivity and serverless-rest-runtime remain
     valid; only the production environment target is being added. -->

## Impact

- `apps/web/`: `public/manifest.json`, meta tags in `app/layout.tsx`, and Vercel project settings targeting `apps/web`.
- Environment variables: `DATABASE_URL` (Supabase pooler URL), `DIRECT_URL` (direct connection for migrations), added to Vercel project settings and `.env.example`.
- `package.json` / turbo pipeline: ensure `pnpm build` targets `apps/web` correctly for Vercel's monorepo build.
- No changes to REST contract, OpenAPI definition, or Swagger UI page.
- Deferred: Google Drive integration, document pipeline, any paid add-ons.
