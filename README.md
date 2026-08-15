# Decolonia Office

Decolonia Office is a simple tool designed to help manage the day-to-day administrative work of a small independent construction and renovation business, my father's :)

It centralizes client information, budgets, invoices, and work-related documents in one place, making it easier to keep track of ongoing jobs and past work.

The goal is to reduce manual paperwork, avoid duplicated effort, and make it simple to generate and share professional documents with clients and accountants.

The system is designed to be easy to use, even for non-technical users, and works smoothly on both laptop and tablet devices.

## Features

### Home Dashboard

Overview of recent activity — latest budgets and invoices at a glance, with quick-access links to each section.

### Client Management

- Create, view, edit, and soft-delete clients (individual or company)
- Separate address fields: street, city, postal code
- Case-insensitive name search, paginated listing

### Worker Profiles

- Manage workers (issuers of documents) with full address, tax ID, phone, email, and bank account details
- Bank account is materialized into invoice PDFs as a payment block
- Designate a **primary worker** in Settings — automatically assigned as issuer when creating new budgets and invoices

### Budget Management

- Create budgets linked to a client; primary worker is auto-assigned as issuer
- Auto-assigned global sequential number (Budget #1, #2, …)
- Add, edit, remove, and reorder line items (job items): title, description, quantity, unit price
- Two pricing modes: **computed** (unit price × quantity) or **manual subtotal override**
- Apply an optional tax from the catalog (e.g., IVA 21%); tax snapshot is materialized at creation
- Recalculated subtotal, tax, and total on every item change
- Track delivered date
- **Export as PDF** — professional document with issuer block, client block, line items table, and totals

### Invoice Management

- Create invoices independently or **from a budget** (pre-fills client, job items, and notes)
- Auto-assigned year-scoped sequential number (e.g., 2026/1, 2026/2, …)
- Same line item and pricing mode capabilities as budgets
- Track issued date
- **Export as PDF** — includes payment block with bank account when available

### Document Catalog & Settings

- **Taxes** — define reusable tax entries (name, rate, behavior); applied as snapshots on documents
- **Work Templates** — reusable line item presets (title, description, default unit price)
- **Commercial Document Settings** — configure default pricing mode and sequence numbers
- **Primary Worker** — select which worker is auto-assigned as issuer on new documents
- **Backup & Export** — synchronize a complete backup to Google Drive or download it as a ZIP archive

### Multi-language UI

Full interface in **Catalan**, **Spanish**, and **English** — switchable at any time via the language toggle.

### PWA — Installable on iPad & Mobile

- `manifest.json` + iOS meta tags for Safari "Add to Home Screen" install
- Launches in standalone mode (no browser chrome) on iPad and mobile
- Responsive layout: desktop top navigation bar, mobile fixed bottom tab bar with section icons and brand colours

---

## App Routes (local dev)

| Section | URL |
|---|---|
| Home dashboard | `http://localhost:3000/` |
| Clients | `http://localhost:3000/clients` |
| Budgets | `http://localhost:3000/budgets` |
| Invoices | `http://localhost:3000/invoices` |
| Settings | `http://localhost:3000/settings` |
| Swagger UI | `http://localhost:3000/api/docs` |

---

## Tech Stack

- Monorepo: `pnpm` workspaces + `turbo`
- Frontend: Next.js 15 (TypeScript, App Router)
- API runtime: Next.js Route Handlers (serverless-compatible REST)
- Database: PostgreSQL (Docker Compose locally, Supabase in deployment)
- PDF generation: `@react-pdf/renderer`
- Icons: `lucide-react`
- Auth: Auth.js v5 (Google OAuth)

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

## Layered Architecture (apps/web)

The web runtime follows a layered structure to keep concerns explicit:

- `apps/web/app/api/*`: web layer (HTTP adapters only)
- `apps/web/src/application/*`: application layer (use cases + outbound ports)
- `apps/web/src/infrastructure/*`: infrastructure layer (Postgres adapters, repositories, SQL)
- `apps/web/src/api/*`: API schemas, validators, mappers, OpenAPI, API error mapping
- `apps/web/src/domain/*`: entities, value objects, domain exceptions

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

## Testing and Checks

Run the complete web test suite from the repository root:

```bash
pnpm test
```

Run TypeScript validation:

```bash
pnpm check
```

Run one Jest file directly:

```bash
pnpm --filter @decolonia/web exec jest src/path/to/file.test.ts --runInBand
```

## Authentication

The app is protected with Google OAuth via [Auth.js v5](https://authjs.dev). Only email addresses listed in `ALLOWED_EMAILS` can sign in. Sessions are stored in a signed HTTP-only cookie — no database table required.

### Setting up Google OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Application type: Web application)
3. Add authorised redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local dev)
   - `https://<your-app>.vercel.app/api/auth/callback/google` (prod)
4. Copy the **Client ID** → `AUTH_GOOGLE_ID`
5. Copy the **Client Secret** → `AUTH_GOOGLE_SECRET`

### Generating AUTH_SECRET

```bash
npx auth secret
```

Copy the output into `AUTH_SECRET` in your `.env` file.

### Google Drive backup configuration

The cloud backup uses the logged-in worker's Google OAuth authorization and one shared folder in a normal personal Google Drive. Choose one canonical worker to create the folder; share it with the other authorized worker. Both workers authorize Drive access with their own Google accounts, but synchronization always targets the same folder and files.

#### Create the Google Cloud project and APIs

1. Open the [Google Cloud Console](https://console.cloud.google.com/), create or select a project, and note its project ID.
2. Enable the [Google Drive API](https://console.cloud.google.com/apis/library/drive.googleapis.com).
3. Enable the [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com).

#### Configure Google OAuth Drive access

1. In Google Cloud Console, open **APIs & Services → Credentials**.
2. Create an OAuth 2.0 Client ID for a Web application if one does not already exist.
3. Add these authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://<your-app>.vercel.app/api/auth/callback/google`
4. Ensure the Google OAuth consent configuration includes the Drive scope requested by the application.
5. Keep the OAuth client ID and secret in `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`; never expose the client secret in the browser.

#### Create and share the personal Drive folder

1. In the canonical worker's normal **My Drive**, create a folder named `Decolonia`.
2. Share that folder with the other authorized worker's Google email, granting Editor access.
3. Open the folder and copy its ID from the URL. For a URL such as `https://drive.google.com/drive/folders/ABC123`, the folder ID is `ABC123`.

The application creates this structure inside the configured folder:

```text
Decolonia/                    # the folder referenced by GOOGLE_DRIVE_SHARED_FOLDER_ID
├── Decolonia-data.xlsx
├── Budgets/<year>/Q1-Q4/
└── Invoices/<year>/Q1-Q4/
```

#### Set the environment variables

Set these values in `apps/web/.env` locally and in the matching Vercel environment:

- `GOOGLE_DRIVE_SHARED_FOLDER_ID` with the shared `Decolonia` folder ID

Example format:

```dotenv
GOOGLE_DRIVE_SHARED_FOLDER_ID=ABC123
```

When a worker clicks **Authorize Google Drive** in Settings, Google grants that worker Drive access. Access tokens are refreshed server-side; provider tokens are not returned in the browser session. If access is revoked or expires, authorize that worker again.

Official references: [Google OAuth web server flow](https://developers.google.com/identity/protocols/oauth2/web-server), [Drive API authorization](https://developers.google.com/drive/api/guides/api-specific-auth), and [Drive sharing](https://support.google.com/drive/answer/2494822).

## Managed Postgres and Environment Variables

Selected free-tier provider: **Supabase Postgres (Free Plan)**.

Required environment variables:

- `DATABASE_URL`: Postgres pooler connection string used by serverless route handlers (port 6543 with `?pgbouncer=true`)
- `DEV_DIRECT_URL`: Direct Postgres connection for running migrations against the dev database (port 5432) — developer-machine-only secret, never set in Vercel
- `PROD_DIRECT_URL`: Direct Postgres connection for running migrations against the prod database (port 5432) — developer-machine-only secret, never set in Vercel
- `NEXT_PUBLIC_API_BASE_URL`: optional override for scripts and checks (defaults to `http://localhost:3000`)
- `AUTH_SECRET`: secret used to sign session cookies — generate with `npx auth secret`
- `AUTH_GOOGLE_ID`: Google OAuth client ID (from Google Cloud Console)
- `AUTH_GOOGLE_SECRET`: Google OAuth client secret (from Google Cloud Console)
- `ALLOWED_EMAILS`: comma-separated list of email addresses allowed to sign in (e.g. `alice@gmail.com,bob@gmail.com`)
- `GOOGLE_DRIVE_SHARED_FOLDER_ID`: ID of the canonical personal Drive folder shared with the other worker

For local development, copy `.env.example` to `.env` and fill in the values.

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
- Source of truth for OpenAPI definition: `apps/web/src/api/openapi/openapi.ts`

### Vercel Import Notes

This repository deploys `apps/web` only.

Set the Vercel project Root Directory to `apps/web`.

### Database Migrations

Database migrations are **run manually from a developer machine** against the target environment before or after deployment.

For local development (`DATABASE_URL` pointing to localhost), the app auto-applies pending SQL migrations once at runtime (controlled by `AUTO_RUN_MIGRATIONS`, default enabled in `.env.example`).

**For dev environment (after merging to `main` or before testing):**

1. Set `DEV_DIRECT_URL` locally to the Supabase dev project direct connection URL (from Supabase project Settings → Database → Connection String, port 5432).
2. Run:
   ```bash
   psql "$DEV_DIRECT_URL" -f apps/web/src/infrastructure/persistence/postgres/migrations/<migration-filename>.sql
   ```
3. Verify the migration in the Supabase dashboard table editor.

**For prod environment (before promoting to `prod` branch):**

1. Set `PROD_DIRECT_URL` locally to the Supabase prod project direct connection URL.
2. Run:
   ```bash
   psql "$PROD_DIRECT_URL" -f apps/web/src/infrastructure/persistence/postgres/migrations/<migration-filename>.sql
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
```

Both should return HTTP 200. Note: all other API routes (`/api/clients`, etc.) require authentication and will return 401 without a valid session cookie. Use the web app or Swagger UI at `/api/docs` after signing in to test them.

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
