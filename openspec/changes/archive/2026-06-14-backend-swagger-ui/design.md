## Context

The API is a NestJS application with modular structure (health module exists). Currently, API contracts are implicit in code. Developers need a way to visually explore endpoints and test them interactively. The architecture supports environment-based configuration (API_PORT, NODE_ENV) which we can leverage for conditional Swagger exposure.

## Architecture Diagrams

```
┌─────────────────────────────────────────────────────────┐
│                    Developer                             │
│              (Browser / REST Client)                     │
└────────────────────────┬────────────────────────────────┘
                         │
                   HTTP Request
                    /api/docs
              (public, no auth required)
                         │
            ┌────────────▼────────────┐
            │  Swagger UI             │
            │  (interactive)          │
            └────────────┬────────────┘
                         │
                  OpenAPI Schema
                  (generated from
                   decorators)
                         │
            ┌────────────▼────────────┐
            │   NestJS SwaggerModule  │
            │   (@nestjs/swagger)     │
            └────────────┬────────────┘
                         │
                   Serves at
                   /api/docs
                         │
            ┌────────────▼────────────────────────────┐
            │   Application Modules (Health, etc.)    │
            │   with API decorators                   │
            └─────────────────────────────────────────┘
```

**Future Enhancement:** When the API implements authentication, an auth guard will be added to the `/api/docs` endpoint as well.

**Key components:**
- **SwaggerModule**: Official NestJS integration that generates OpenAPI 3.0 schema from decorators
- **API Decorators**: `@ApiOperation`, `@ApiResponse`, `@ApiParam`, etc. on controllers and DTOs

## Goals / Non-Goals

**Goals:**
- Enable developers to discover and test all API endpoints visually in one place
- Generate OpenAPI documentation automatically from controller decorators
- Serve interactive Swagger UI at `/api/docs` (public during development)
- Provide comprehensive request/response documentation including error codes

**Non-Goals:**
- Modify existing API behavior or contracts
- Create new API endpoints (only document existing ones)
- Implement authentication for Swagger in dev environment
- Auto-migrate existing controllers to include decorators (manual per-module)

## Decisions

### Decision 1: Use @nestjs/swagger for documentation generation
**Choice:** @nestjs/swagger (official NestJS integration)

**Rationale:**
- Official NestJS library with first-class support
- Decorator-based approach keeps documentation close to code
- Automatic schema generation with zero boilerplate in many cases
- Integrates cleanly with existing module structure

**Alternatives considered:**
- Manual OpenAPI YAML file: More control but harder to keep in sync
- swagger-ui-express: Would require manual schema definition

**Implementation:** Install `@nestjs/swagger` and `swagger-ui-express` packages

### Decision 2: Public Swagger UI during development, auth-guarded when API auth is implemented
**Choice:** Serve `/api/docs` publicly without authentication during initial implementation. Guard with API authentication when the API's authentication system is added.

**Rationale:**
- Enables immediate implementation without waiting for auth infrastructure
- Developers can test and explore during dev/staging
- When API authentication is added, Swagger UI will automatically be protected by the same mechanism
- Avoids coupling Swagger UI release to auth system release

**Implementation:**
- Phase 1: Register SwaggerModule without auth guard
- Phase 2 (future, when API auth exists): Add auth guard to `/api/docs` endpoint

### Decision 3: Serve at `/api/docs` route
**Choice:** `/api/docs` (REST convention)

**Rationale:**
- Standard location where developers expect API docs
- Clearly namespaced under `/api` to indicate it's API-related
- Swagger UI convention

**Implementation:** SwaggerModule.setup('api/docs', ...)

### Decision 4: Progressive decorator rollout
**Choice:** Add API decorators incrementally to existing modules

**Rationale:**
- Avoids big-bang refactor of all controllers
- Can prioritize critical modules (health, auth, etc.)
- Reduces risk of introducing bugs during decorator adoption

**Implementation:**
- Start with health module endpoints
- Expand to other modules as needed
- Each decorator addition improves schema completeness incrementally

## Risks / Trade-offs

**[Risk] Schema completeness:** If decorators aren't added to all controllers, some endpoints won't appear in Swagger UI.
→ *Mitigation:* Start with critical endpoints; document which modules are Swagger-enabled. Add linting rule to enforce decorators on new controllers.

**[Risk] Documentation drift:** Decorators can become stale if not updated when API contracts change.
→ *Mitigation:* Treat decorators as code; include in PR review process. API contract changes should also update decorators.

**[Risk] Performance impact:** Schema generation and Swagger UI assets add to application startup and memory footprint.
→ *Mitigation:* Schema generation is cached; minimal impact for typical API. Negligible across all environments.

**[Trade-off] Manual decorator maintenance vs. automatic documentation:** We chose decorators (manual, more explicit) over auto-generation from JSDoc or reflection to keep documentation intentional and aligned with schema.

## Migration Plan

1. **Phase 1: Setup**
   - Install `@nestjs/swagger` and `swagger-ui-express` packages in API workspace
   - Import SwaggerModule in main.ts
   - Configure SwaggerModule (title, description, version)
   - Initialize SwaggerModule for all environments (no auth guard required)

2. **Phase 2: Decorate health module**
   - Add `@ApiOperation`, `@ApiResponse`, `@ApiParam` decorators to health controller
   - Define DTOs for responses using `@ApiProperty`
   - Test that `/api/docs` displays health endpoints correctly

3. **Phase 3: Expand to other modules**
   - Repeat Phase 2 for additional modules as they are developed
   - Document the pattern in contribution guidelines

4. **Phase 4: Add authentication guard (future, when API auth is implemented)**
   - Add auth guard to `/api/docs` endpoint when API authentication system is ready
   - Create a new change/ADR to document this modification

## Open Questions

- Which existing modules should be prioritized for decorator coverage first? *Suggest: Health module first, then auth/core modules.*
- Should we add TypeScript strict mode checks for Swagger decorators? *Suggest: Not immediately; defer to linting/CI standards.*
- When the API authentication system is built, should a new change be created to add auth guards to Swagger UI, or handled as a minor enhancement? *Suggest: Create a new change to track the modification formally.*
