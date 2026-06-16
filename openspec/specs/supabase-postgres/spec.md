# Supabase Postgres

## Purpose

Define the requirements for provisioning and connecting two Supabase free-tier Postgres projects (dev and prod) to the corresponding Vercel deployment environments, and for running database migrations manually.

## ADDED Requirements

### Requirement: Two isolated Supabase Postgres projects
The project SHALL use two separate Supabase Free Plan projects — one for dev and one for prod — to achieve full data isolation between environments.

#### Scenario: Dev deployments connect to the dev Supabase project
- **WHEN** the Next.js app is deployed to the Vercel Preview environment
- **THEN** all database operations target the dev Supabase project exclusively

#### Scenario: Prod deployments connect to the prod Supabase project
- **WHEN** the Next.js app is deployed to the Vercel Production environment
- **THEN** all database operations target the prod Supabase project exclusively

#### Scenario: Dev database activity does not affect prod data
- **WHEN** a client record is created or deleted via the dev deployment
- **THEN** the prod Supabase project data remains unchanged

### Requirement: PgBouncer-compatible connection strings
The `DATABASE_URL` environment variable for each environment SHALL use the Supabase connection pooler URL (port 6543) with the `?pgbouncer=true` query parameter to ensure compatibility with serverless Route Handlers.

#### Scenario: Serverless handler connects via pooler
- **WHEN** a Next.js Route Handler executes a database query
- **THEN** the connection is established through PgBouncer (port 6543) without session-level conflicts

#### Scenario: `DATABASE_URL` includes pgbouncer flag
- **WHEN** the `DATABASE_URL` value is inspected
- **THEN** it contains `?pgbouncer=true` in the query string

### Requirement: Developer-held direct connection string for migrations
Each Supabase project SHALL have a direct connection URL (port 5432, not pooler) stored only as a local developer secret (`DEV_DIRECT_URL` / `PROD_DIRECT_URL`) and never set as a Vercel environment variable.

#### Scenario: Direct URL is not present in Vercel environment
- **WHEN** the Vercel project environment variables are inspected
- **THEN** no `DIRECT_URL`, `DEV_DIRECT_URL`, or `PROD_DIRECT_URL` variable is present

#### Scenario: Developer can retrieve direct URL from Supabase dashboard
- **WHEN** a developer navigates to Supabase project Settings → Database → Connection String (URI, port 5432)
- **THEN** the direct connection URL is available for local migration use

### Requirement: Manual database migration execution
Database migrations SHALL be run manually from a developer machine using a documented script against the appropriate direct connection URL before deploying to that environment.

#### Scenario: Run migration against dev database
- **WHEN** a developer runs `psql "$DEV_DIRECT_URL" -f <migration-file>.sql` locally
- **THEN** the migration is applied to the dev Supabase project and the schema change is reflected in the Supabase table editor

#### Scenario: Run migration against prod database before promoting
- **WHEN** a developer runs `psql "$PROD_DIRECT_URL" -f <migration-file>.sql` locally prior to merging `main` into `prod`
- **THEN** the migration is applied to the prod Supabase project before the production deployment goes live

#### Scenario: Migration script is documented in README
- **WHEN** a developer consults the README migration section
- **THEN** they find step-by-step instructions including how to retrieve `DEV_DIRECT_URL` and `PROD_DIRECT_URL` from the Supabase dashboard and how to verify the migration succeeded

### Requirement: Accepted free-tier operational constraints
The system SHALL accept and document Supabase Free Plan operational constraints without requiring any mitigation infrastructure.

#### Scenario: Developer is informed about DB pause policy
- **WHEN** a developer reads the README deployment section
- **THEN** they find a note that Supabase free projects pause after 1 week of inactivity and can be resumed from the Supabase dashboard

#### Scenario: System operates within free-tier storage limits
- **WHEN** the application is used as a single-user administrative tool
- **THEN** database storage remains well within the 500 MB free-tier limit under normal usage
