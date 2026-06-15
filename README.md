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

- `DATABASE_URL`: Postgres connection string used by serverless route handlers
- `NEXT_PUBLIC_API_BASE_URL`: optional override for scripts and checks (defaults to `http://localhost:3000`)

For local development, defaults are provided in `.env.example`.

## Free-Tier Deployment (Vercel + Supabase)

Recommended free-tier target:

- App/API: Vercel Hobby (Next.js + route handlers)
- Database: Supabase Free Postgres

Deployment notes:

- Add `DATABASE_URL` in Vercel project environment variables.
- Verify `/api/health`, `/api/clients`, and `/api/docs` after deployment.
- Keep API docs source of truth in `apps/web/src/server/openapi.ts`.

Operational expectations:

- Free-tier cold starts can happen under low traffic.
- Monitor quota/usage from Vercel and Supabase dashboards.

Rollback procedure:

1. Re-point `NEXT_PUBLIC_API_BASE_URL` to the previous stable deployment URL if needed.
2. Redeploy web app with the previous environment variable configuration.
3. Re-run connectivity and contract checks.

Stop infrastructure:

```bash
pnpm stop:infra
```
