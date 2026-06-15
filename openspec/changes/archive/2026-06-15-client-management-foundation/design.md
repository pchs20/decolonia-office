## Context

We're establishing the first domain-specific feature after bootstrap: centralized client management. Clients are core to the platform — every budget and invoice references one. This design lays the data model, API structure, and frontend integration pattern that future features (budgets, invoices, external invoices) will build upon.

The existing ADR (0001) commits us to PostgreSQL for relational data, NestJS for the API, and Next.js for the web app. This design respects those constraints and establishes conventions for entity/repository/service patterns in NestJS that will be reused.

## Architecture Diagrams

For now, client management is straightforward: web app → NestJS API → PostgreSQL. No diagrams needed at this stage — the architecture is simple and linear.

**Future consideration**: Once budgets and invoices are added, a container diagram showing data relationships (Client → Budget → Invoice → ExternalInvoice) and file storage flows would be valuable.

## Goals / Non-Goals

**Goals:**
- Store and retrieve client information reliably
- Enable fast search and filtering by name
- Support both individuals and companies with appropriate tax ID types
- Establish a reusable CRUD pattern for NestJS (entity/repository/service/controller) that will scale to budgets, invoices, etc.
- Provide clean frontend-to-API integration via a typed service layer
- Keep soft-deleted clients out of normal queries (data preservation without clutter)

**Non-Goals:**
- Client groups or hierarchies (out of scope for foundation)
- Permission/access control per client (out of scope; no multi-user initially)
- Batch import of clients (can be added later)
- Client relationship graph (which clients refer each other, etc.)
- Automated client deduplication

## Decisions

### Decision 1: Soft-delete instead of hard delete
**Choice**: Mark clients as `is_active = false` instead of removing rows.

**Rationale**:
- Preserves audit trail and historical data
- Avoids orphaning future budgets/invoices if a client is deleted
- Can easily reactivate a client if needed
- Simple implementation (filter by `is_active = true` in queries)

**Alternatives considered**:
- Hard delete: loses data, risks breaking references, poor for audit
- Logical delete with archive table: more complex, less flexible than single flag

### Decision 2: Client type enum (individual | company)
**Choice**: Store a `type` field that's either "individual" or "company" to guide tax ID validation and future UI presentation.

**Rationale**:
- Validates tax ID format early (NIF/NIE for individuals, CIF for companies)
- Allows future features to show different UI flows (e.g., invoice to person vs. legal entity)
- Simple and explicit; avoids ambiguity

**Alternatives considered**:
- Single tax_id field, infer type on validation: less explicit, error-prone
- Separate individual/company subtypes: over-engineered for foundation

### Decision 3: Separate address and billing_address
**Choice**: Two address fields instead of one, with optional billing_address (defaults to address if not provided).

**Rationale**:
- Real-world scenario: many small businesses have work address ≠ billing address
- Your father may visit a site but invoice the company HQ
- Future reports can group by billing_address for accounting

**Alternatives considered**:
- Single address: forces workaround; less flexible
- Address object (street, number, city, postal_code, ...): premature normalization; keep flat for now

### Decision 4: Pagination on list endpoint
**Choice**: `/api/clients` returns paginated results (page, limit, total count) to handle growth gracefully.

**Rationale**:
- Large client lists can cause UI lag; pagination is standard
- Simple offset-based pagination (page × limit) is sufficient for now
- Default: page=1, limit=10; easily adjustable

**Alternatives considered**:
- No pagination (return all): fine until hundreds of clients; then requires refactor
- Cursor-based pagination: overkill for small scales; adds complexity

### Decision 5: Case-insensitive search by name
**Choice**: Search queries are case-insensitive substring matches on the name field.

**Rationale**:
- User doesn't have to remember exact case ("joão" vs "João")
- Substring match is more forgiving than exact match
- Implemented at the query layer (PostgreSQL `ILIKE`)

**Alternatives considered**:
- Exact match: too restrictive
- Full-text search: overkill for small name field; simple ILIKE is fast enough

### Decision 6: Frontend API service layer
**Choice**: Create a typed `ClientService` in the frontend that wraps API calls, mirroring the backend pattern.

**Rationale**:
- Centralizes API URLs, error handling, and type definitions in one place
- Makes it easy to swap API implementation (mock for tests, real for prod)
- Follows existing NestJS-style separation (service = business logic, controller = HTTP)

**Alternatives considered**:
- Inline fetch calls in components: prone to repetition and errors
- Separate HTTP client abstraction: unnecessary until multiple resources

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| Soft-delete increases query complexity (need `is_active = true` everywhere) | Use a database view or repository base method to standardize filtering; establish early convention |
| No client deduplication logic; user could accidentally create duplicates | Accept for now (manual review); future feature can add duplication warnings |
| Search is substring; "joa" matches "joa", "joão da silva", "joaninho" | Acceptable UX trade-off; exact match too restrictive for human names with accents |
| Pagination defaults may not suit all users; future UX research needed | Start with page=1, limit=10; telemetry can inform better defaults |
| Tax ID validation not implemented in this phase | Future requirement; for now, accept any string; validate format later or in manual review |

## Migration Plan

This is a greenfield feature; no migration needed beyond initial schema.

1. Create `clients` table with schema (see schema below)
2. Run migration in development → verify API endpoints
3. Wire frontend components → test create/list/edit/delete flows
4. No rollback needed; if issues, drop table and restart

**Schema**:
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('individual', 'company')),
  address TEXT NOT NULL,
  billing_address TEXT,
  tax_id VARCHAR(20) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_is_active ON clients(is_active);
```

## Open Questions

- **Tax ID validation**: Should we validate format (NIF/NIE regex, CIF pattern) or accept any string initially? → Defer to future; accept any string for MVP
- **Audit logging**: Should all client changes (create/update/delete) be logged for compliance? → Out of scope; can add later if needed
- **Search performance**: For 10k+ clients, is substring search fast enough or do we need full-text search? → Monitor in production; optimize if needed
