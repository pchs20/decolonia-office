# Decolonia Office

Decolonia Office is a simple tool designed to help manage the day-to-day administrative work of a small independent construction and renovation business, my father's :)

It centralizes client information, budgets, invoices, and work-related documents in one place, making it easier to keep track of ongoing jobs and past work.

The goal is to reduce manual paperwork, avoid duplicated effort, and make it simple to generate and share professional documents with clients and accountants.

The system is designed to be easy to use, even for non-technical users, and works smoothly on both laptop and tablet devices.

## Client Management Foundation

The platform includes a complete client management foundation:

- Create, view, edit, and soft-delete clients
- Search clients by name (case-insensitive)
- Paginated client listing in the web app
- API documentation for client endpoints in Swagger UI

Main routes:

- Web: `http://localhost:3000/clients`
- API: `http://localhost:3000/api/clients`
- Swagger: `http://localhost:3000/api/docs`

## Bootstrap Stack

- Monorepo: `pnpm` workspaces + `turbo`
- Frontend: Next.js (TypeScript)
- API runtime: Next.js Route Handlers (serverless-compatible REST)
- Database: PostgreSQL (Docker Compose)

## Repository Layout

```text
apps/
	web/          Next.js app
packages/
	config/       Shared config package
openspec/       OpenSpec artifacts and changes
docs/adr/       Architecture decision records
docker-compose.yml
```

## First-Time Setup

1. Install prerequisites:
	 - Node.js 20+
	 - pnpm 9+
	 - Docker Desktop
2. Install dependencies:

```bash
pnpm install
```

3. Start infrastructure services:

```bash
pnpm dev:infra
```

4. Run app:

```bash
pnpm dev:apps
```

Or run both in sequence:

```bash
pnpm dev
```

## Local Connectivity Validation

With API and infrastructure running:

```bash
pnpm verify:connectivity
```

Manual checks:

- API health: `http://localhost:3000/api/health`
- API connectivity: `http://localhost:3000/api/health/connectivity`
- Swagger UI (API documentation): `http://localhost:3000/api/docs`
- Web app: `http://localhost:3000`

Contract checks (app must be running):

```bash
pnpm --filter @decolonia/web contract:check
```

## Managed Postgres and Environment Variables

Selected free-tier provider: **Supabase Postgres (Free Plan)**.

Required environment variables:

- `DATABASE_URL`: Postgres pooler connection string used by serverless route handlers (port 6543 with `?pgbouncer=true`)
- `DEV_DIRECT_URL`: Direct Postgres connection for running migrations against the dev database (port 5432) — developer-machine-only secret, never set in Vercel
- `PROD_DIRECT_URL`: Direct Postgres connection for running migrations against the prod database (port 5432) — developer-machine-only secret, never set in Vercel
- `NEXT_PUBLIC_API_BASE_URL`: optional override for scripts and checks (defaults to `http://localhost:3000`)

For local development, defaults are provided in `.env.example`.

## Free-Tier Deployment (Vercel + Supabase)

### Deployment Environments

The project uses a **two-environment deployment model** for staging and production:

| Git Branch | Vercel Environment | Deployment | Database | URL Pattern |
|---|---|---|---|---|
| `main` | Preview | Auto-deploys on push/merge to `main` | Dev Supabase | `https://<app>-git-main-<username>.vercel.app` |
| `prod` | Production | Auto-deploys on push/merge to `prod` | Prod Supabase | `https://<app>.vercel.app` |
| Feature branches | Preview | Auto-deploys on push | Dev Supabase | `https://<app>-git-<branch>-<username>.vercel.app` |

**Workflow:**
- Commits to feature branches and `main` deploy to Preview (dev environment) for testing.
- Merges from `main` → `prod` trigger the Production deployment.

**Promote to production:**

```bash
git checkout prod
git merge main
git push
```

### Recommended Architecture

- App/API: Vercel Hobby (Next.js + Route Handlers)
- Database: Two Supabase Free Postgres projects (dev and prod)
- Source of truth for OpenAPI definition: `apps/web/src/server/openapi.ts`

### Database Migrations

Database migrations are **run manually from a developer machine** against the target environment before or after deployment.

**For dev environment (after merging to `main` or before testing):**

1. Set `DEV_DIRECT_URL` locally to the Supabase dev project direct connection URL (from Supabase project Settings → Database → Connection String, port 5432).
2. Run:
   ```bash
   psql "$DEV_DIRECT_URL" -f apps/api/src/migrations/<migration-filename>.sql
   ```
3. Verify the migration in the Supabase dashboard table editor.

**For prod environment (before promoting to `prod` branch):**

1. Set `PROD_DIRECT_URL` locally to the Supabase prod project direct connection URL.
2. Run:
   ```bash
   psql "$PROD_DIRECT_URL" -f apps/api/src/migrations/<migration-filename>.sql
   ```
3. Verify the migration in the Supabase dashboard table editor.
4. Then merge `main` → `prod` and push to deploy.

### Deployment Validation

After each deployment (dev or prod), verify the following endpoints:

```bash
# Replace with your Vercel URL
VERCEL_URL="https://<your-app>.vercel.app"  # for prod or the Preview URL for dev

curl "$VERCEL_URL/api/health"
curl "$VERCEL_URL/api/health/connectivity"
curl "$VERCEL_URL/api/clients"
curl "$VERCEL_URL/api/docs"
```

All should return HTTP 200.

### Operational Constraints & Monitoring

**Supabase free-tier limits:**
- 500 MB storage per project
- 2 GB bandwidth per month
- Database pauses after **1 week of inactivity** (can be resumed from Supabase dashboard with no data loss)

**Vercel free-tier limits:**
- Serverless functions can have cold starts under low traffic (expected for internal tools)
- 100 deployments per day

**Monitoring:**
- Check Vercel dashboard for deployment status and function invocation logs.
- Check Supabase dashboard for database storage, bandwidth usage, and connection status.

### Rollback Procedure

**To rollback a production deployment:**

1. In Vercel dashboard, go to Deployments and select a previous stable deployment.
2. Click "Promote to Production" to instantly roll back (no code push needed).
3. Run connectivity checks to confirm the rollback succeeded.

**Database rollback is not supported** (migrations are applied directly and cannot be easily reversed). Plan and test migrations carefully before deploying to prod.

Stop infrastructure:

```bash
pnpm stop:infra
```
