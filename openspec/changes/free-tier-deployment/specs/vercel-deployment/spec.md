# Vercel Deployment

## Purpose

Define the requirements for deploying the Next.js monorepo app to Vercel Hobby with a two-environment model (dev via Preview, production via the `prod` branch).

## ADDED Requirements

### Requirement: Vercel monorepo root configuration
The repository SHALL contain a `vercel.json` at the repo root that declares `apps/web` as the project root directory so that Vercel correctly resolves the Next.js app, build command, and output directory without manual dashboard configuration.

#### Scenario: Vercel detects Next.js app from repo root
- **WHEN** the Vercel project is linked to the GitHub repository
- **THEN** Vercel uses `apps/web` as the root directory and auto-detects the Next.js framework without additional build command overrides

#### Scenario: Config is reproducible across environments
- **WHEN** a new Vercel project is created from the same repository
- **THEN** the `vercel.json` file provides all necessary configuration without requiring manual dashboard edits

### Requirement: Two-environment deployment model via branch strategy
The project SHALL use a `prod` long-lived branch as the Vercel production branch, so that:
- Merges to `main` auto-deploy to a stable Preview URL (dev environment).
- Merges from `main` to `prod` trigger the Vercel Production deployment.

#### Scenario: Push to `main` deploys to dev (Preview)
- **WHEN** a commit is merged into `main`
- **THEN** Vercel automatically deploys to a stable, permanent Preview URL scoped to the `main` branch

#### Scenario: Promote to production by merging `main` into `prod`
- **WHEN** `main` is merged into `prod` and pushed
- **THEN** Vercel automatically deploys to the Production URL

#### Scenario: Production branch is `prod`, not `main`
- **WHEN** the Vercel project Git settings are inspected
- **THEN** the configured production branch is `prod`

### Requirement: Per-environment DATABASE_URL configuration
The Vercel project SHALL have `DATABASE_URL` configured separately for the Preview and Production environments, pointing to the dev and prod Supabase projects respectively.

#### Scenario: Preview deployments use the dev database
- **WHEN** any deployment triggered by `main` or a feature branch is running
- **THEN** the `DATABASE_URL` environment variable resolves to the dev Supabase pooler URL

#### Scenario: Production deployments use the prod database
- **WHEN** a deployment triggered by the `prod` branch is running
- **THEN** the `DATABASE_URL` environment variable resolves to the prod Supabase pooler URL

#### Scenario: Environment variable is never shared across environments
- **WHEN** the Vercel environment variable settings are inspected
- **THEN** `DATABASE_URL` is scoped to each environment separately (not set as "All Environments")

### Requirement: Deployment validation checklist
After each deployment (dev or prod), the following endpoints SHALL respond successfully to confirm the deployment is healthy.

#### Scenario: Health endpoint returns 200
- **WHEN** a GET request is sent to `/api/health` on the deployed URL
- **THEN** the response is HTTP 200

#### Scenario: Connectivity endpoint confirms database connection
- **WHEN** a GET request is sent to `/api/health/connectivity` on the deployed URL
- **THEN** the response is HTTP 200 with a payload confirming database connectivity

#### Scenario: Clients endpoint returns paginated response
- **WHEN** a GET request is sent to `/api/clients` on the deployed URL
- **THEN** the response is HTTP 200 with a valid paginated client list payload

#### Scenario: Swagger UI renders
- **WHEN** `/api/docs` is opened in a browser on the deployed URL
- **THEN** the Swagger UI page renders with the OpenAPI definition loaded

### Requirement: Production promotion procedure
The project SHALL have a documented, repeatable procedure for promoting `main` to `prod`.

#### Scenario: Developer promotes to production
- **WHEN** a developer runs the documented promote command (`git checkout prod && git merge main && git push`)
- **THEN** Vercel triggers a Production deployment automatically with no additional manual steps required
