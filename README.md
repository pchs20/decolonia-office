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
- API: `http://localhost:3001/api/clients`
- Swagger: `http://localhost:3001/api/docs`

## Bootstrap Stack

- Monorepo: `pnpm` workspaces + `turbo`
- Frontend: Next.js (TypeScript)
- Backend: NestJS (TypeScript)
- Database: PostgreSQL (Docker Compose)
- Object storage: MinIO, S3-compatible (Docker Compose)

## Repository Layout

```text
apps/
	web/          Next.js app
	api/          NestJS API
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

4. Run web + API apps:

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

- API health: `http://localhost:3001/health`
- API connectivity: `http://localhost:3001/health/connectivity`
- Swagger UI (API documentation): `http://localhost:3001/api/docs`
- Web app: `http://localhost:3000`

Stop infrastructure:

```bash
pnpm stop:infra
```
