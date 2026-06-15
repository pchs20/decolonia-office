# 0001. Adopt monorepo TypeScript stack for bootstrap

- Status: accepted
- Date: 2026-06-14

## Context

The first iteration needs a very small but durable technical base: one repository, clear app boundaries, and reliable local infrastructure startup. The team size is small, and speed of iteration plus low operational complexity is the primary concern.

## Decision

Use a TypeScript monorepo with pnpm workspaces and turbo as task orchestrator. Implement a Next.js web app with serverless route handlers for API endpoints. Use PostgreSQL for relational data, with Docker Compose for local infrastructure dependencies.

## Consequences

Positive:
- Single source of truth and simpler cross-app refactoring.
- Consistent tooling and language across frontend and backend.
- Good parity between local development and future hosted environments.

Negative:
- Initial workspace/tooling setup is more involved than a single app repository.
- Docker dependency adds local setup requirements.

Neutral:
- Future architectural changes remain possible through superseding ADRs if constraints evolve.
