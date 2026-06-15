## Context

The current architecture standard is a Next.js web app with serverless API route handlers backed by PostgreSQL. This model is designed to sustain a fully free production setup while keeping deployment and operations simple.

Current in-force ADR set:
- `0001-adopt-bootstrap-monorepo-stack` (accepted, not superseded): monorepo TypeScript baseline, Next.js web + serverless API route handlers, PostgreSQL.

This change targets a free-tier production posture while preserving REST API behavior, iPad PWA viability, and data persistence for low-traffic operation.

## Architecture Diagrams

### Container-level target architecture

```text
+----------------------+        HTTPS        +----------------------------+
|  iPad PWA / Laptop   |-------------------->| Next.js App (Vercel free) |
|  Browser Client      |                     | - UI routes               |
+----------------------+                     | - REST route handlers     |
                                             | - Optional docs route     |
                                             +-------------+--------------+
                                                           |
                                                           | SQL/API client
                                                           v
                                             +----------------------------+
                                             | Managed Postgres (free)    |
                                             | (e.g., Supabase/Neon tier) |
                                             +----------------------------+
```

Assumptions:
- Traffic is low enough to remain within free-tier quotas.
- Cold starts are acceptable for occasional usage.
- Persistent relational data remains in managed Postgres.

Open diagram questions:
- Which export destination strategy should be selected when document workflows are introduced in a future change.
- Whether Swagger is hosted as a static OpenAPI UI route or generated at runtime.

## Goals / Non-Goals

**Goals:**
- Keep a REST API contract for client-management flows.
- Enable free-tier-friendly production deployment with persistent data.
- Preserve local development/testing ergonomics.
- Keep OpenAPI/Swagger documentation accessible.

**Non-Goals:**
- Full rewrite of business logic beyond runtime adaptation.
- Full offline-first replication architecture for all data.
- Immediate implementation of robust backup automation (deferred to follow-up phase).
- Document export destination integration (including Google Drive) until document workflows are added.
- Introduction of paid infrastructure.

## Decisions

### 1) Consolidate runtime to Next.js + serverless API routes
Decision:
- Use route handlers in the web deployment as the production API runtime for current REST resources.

Rationale:
- Removes dependency on a separately hosted always-on NestJS process.
- Aligns with free-tier constraints and single-deployment simplicity.

Alternatives considered:
- Split serverless API into separate provider (Cloud Run/Fly) + web on Vercel: operationally heavier for current stage.

### 2) Preserve REST surface compatibility for existing client endpoints
Decision:
- Maintain resource structure and HTTP semantics (`POST/GET/PATCH/DELETE` for clients) to minimize frontend impact.

Rationale:
- Existing UI and service layer already expect this contract.
- Reduces migration risk and rollout time.

Alternatives considered:
- Move immediately to direct database SDK usage from frontend: less backend code, but weakens API boundary and complicates future server-side orchestration.

### 3) Keep PostgreSQL as persistent store, but managed free-tier
Decision:
- Use a free managed Postgres provider for production persistence.

Rationale:
- Retains relational model and current domain fit.
- Avoids maintaining a self-hosted database process for production.

Alternatives considered:
- SQLite/file DB: simpler footprint but weak multi-device concurrency story.
- Non-relational backend: larger model rewrite and higher migration cost.

### 4) Keep Swagger/OpenAPI available via decoupled docs strategy
Decision:
- Serve API docs independently from Nest runtime coupling, using an OpenAPI source that can be rendered in the web app.

Rationale:
- Documentation remains available to developers and testers after runtime migration.

Alternatives considered:
- Drop Swagger temporarily: fastest, but harms discoverability and testability.
- Keep Nest docs server only for docs: adds deployment overhead.

## Risks / Trade-offs

- [Free-tier quotas exceeded] -> Define usage budgets and fallback behavior; monitor usage metrics in deployment dashboards.
- [Cold starts increase perceived latency] -> Keep endpoints lightweight and add clear loading states in UI.
- [API docs drift from implementation] -> Add validation checks between route schemas and OpenAPI artifact in CI.

## Migration Plan

1. Runtime preparation
- Define serverless API boundary and endpoint mapping for all existing client routes.
- Define shared validation and error mapping strategy for new handlers.

2. Data layer adaptation
- Configure managed Postgres environments (dev/stage/prod equivalence as feasible on free tier).
- Adapt repository access patterns to runtime-compatible DB clients.

3. API documentation continuity
- Define OpenAPI source-of-truth and expose Swagger UI route in web deployment.
- Confirm docs paths and developer workflow updates.

4. Deployment rollout
- Deploy web + serverless API to free host.
- Run smoke checks for REST behavior, docs availability, and PWA installability.

5. Rollback strategy
- Keep previous stable web deployment configuration documented until rollout is proven stable.
- If critical regressions occur, switch `NEXT_PUBLIC_API_BASE_URL` to the previous stable deployment URL.

## Open Questions

- Which managed Postgres provider best matches expected free-tier limits and EU data location requirements?
- Should OpenAPI be generated from schemas in-code or maintained as a versioned static artifact?
- Which export destination and processing model should be adopted when document workflows are introduced in a later change?
