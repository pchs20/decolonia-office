## Why

Your father currently tracks clients in ad-hoc ways without a centralized system. As the platform grows, he needs a structured place to manage client information (contact details, addresses, tax IDs) so that future features like budgets and invoices can reference and auto-fill from this data. Without this foundation, all downstream workflows become harder.

## What Changes

- Add a **Client entity** to the data model with standardized fields (name, address, billing address, tax ID, phone, email; supports individuals and companies)
- Implement **Client CRUD API endpoints** in the NestJS backend for creating, reading, updating, and listing clients
- Add **soft-delete** logic so clients can be marked inactive without losing historical records
- Build a **client list view** in the Next.js web app with name, phone, and city display
- Implement **search by name** to quickly find clients
- Wire **frontend-to-API integration** so the web app can manage clients via the backend

## Capabilities

### New Capabilities
- `client-management`: CRUD operations for clients with soft-delete, list filtering, and search functionality

### Modified Capabilities
<!-- No existing capabilities are modified in this change -->

## Impact

- **Backend (NestJS API)**:
  - Add `Client` entity and repository
  - Implement `ClientsController` and `ClientsService` with CRUD endpoints
  - Add database migration for clients table
  - New dependencies: none (ORM already exists from bootstrap)

- **Frontend (Next.js web app)**:
  - Add client list page component
  - Add client create/edit forms
  - Add API client service for client operations
  - No new external dependencies

- **Database**:
  - New `clients` table with fields: id, name, type (individual|company), address, billing_address, tax_id, phone, email, is_active, created_at, updated_at

- **No breaking changes** — this is purely additive
