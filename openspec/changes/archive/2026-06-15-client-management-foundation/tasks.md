## 1. Database Setup

- [x] 1.1 Create database migration for `clients` table with all fields (id, name, type, address, billing_address, tax_id, phone, email, is_active, created_at, updated_at)
- [x] 1.2 Add indexes to `clients` table (name for search, is_active for filtering)
- [x] 1.3 Run migration locally and verify table structure

## 2. Backend: Entity & Database Layer

- [x] 2.1 Create `Client` entity (TypeORM) in `apps/api/src/clients/entities/client.entity.ts`
- [x] 2.2 Create `ClientRepository` extending `Repository<Client>` with custom query methods (findActive, searchByName, etc.)
- [x] 2.3 Implement `findActive()` method that filters `is_active = true` by default
- [x] 2.4 Implement `searchByName(name: string, page, limit)` method with pagination

## 3. Backend: Service Layer

- [x] 3.1 Create `ClientsService` with methods: create, findById, findAll, update, softDelete
- [x] 3.2 Implement validation: type must be 'individual' or 'company'; required fields checked
- [x] 3.3 Implement softDelete to set `is_active = false` (no actual deletion)
- [x] 3.4 Add error handling (404 for not found, 400 for validation errors)

## 4. Backend: DTOs & API Contract

- [x] 4.1 Create `CreateClientDto` with all required fields (name, type, address, billing_address, tax_id, phone, email)
- [x] 4.2 Create `UpdateClientDto` with partial fields (all optional)
- [x] 4.3 Create `ClientResponseDto` for API responses (excludes sensitive internal fields if any)
- [x] 4.4 Add API documentation decorators (@ApiOperation, @ApiResponse, @ApiParam) to controller methods

## 5. Backend: Controller & Endpoints

- [x] 5.1 Create `ClientsController` with endpoints:
  - POST `/api/clients` (create)
  - GET `/api/clients/:id` (retrieve single)
  - PATCH `/api/clients/:id` (update)
  - DELETE `/api/clients/:id` (soft-delete)
  - GET `/api/clients` (list with pagination & search)
- [x] 5.2 Add query parameter handling for `page`, `limit`, `search` on GET `/api/clients`
- [x] 5.3 Implement proper HTTP status codes (201 for create, 200 for success, 400 for validation, 404 for not found, 204 for delete)
- [x] 5.4 Test all endpoints manually in Swagger UI

## 6. Frontend: API Service Layer

- [x] 6.1 Create `ClientService` in `apps/web/src/services/client.service.ts` with typed methods
- [x] 6.2 Implement methods: create, getById, getAll, update, delete
- [x] 6.3 Add error handling and type definitions (types/Client.ts)
- [x] 6.4 Implement pagination and search parameters

## 7. Frontend: Components & Pages

- [x] 7.1 Create `ClientListPage` component showing paginated client list with columns: name, phone, city (from address)
- [x] 7.2 Add search input that filters clients by name on the list
- [x] 7.3 Create `ClientForm` component for create/edit with fields: name, type (radio), address, billing_address, tax_id, phone, email
- [x] 7.4 Create `ClientDetailPage` for viewing and editing individual client
- [x] 7.5 Add "Add Client" button that opens form (modal or new page)
- [x] 7.6 Add "Edit" and "Delete" buttons on each client row

## 8. Frontend: Routing & Integration

- [x] 8.1 Add route `/clients` to Next.js app (page layout in `apps/web/app/clients/`)
- [x] 8.2 Wire ClientListPage to fetch from API on mount
- [x] 8.3 Wire form submissions to ClientService (create/update calls)
- [x] 8.4 Handle loading, error, and success states in UI
- [x] 8.5 Add success/error toast notifications for user feedback

## 9. Testing & Validation

- [x] 9.1 Test all CRUD operations: create client, retrieve, update, delete
- [x] 9.2 Verify soft-delete: deleted client not in list, retrieval returns 404
- [x] 9.3 Test search by name: verify case-insensitive, substring matching
- [x] 9.4 Test pagination: verify limit, page parameters work, total count returned
- [x] 9.5 Test validation: missing fields, invalid type, invalid email/phone formats
- [x] 9.6 Test API documentation in Swagger UI at `/api/docs`

## 10. Documentation & Polish

- [x] 10.1 Document API endpoints in code comments (already done via Swagger decorators)
- [x] 10.2 Update [README.md](README.md) with client management feature overview
- [x] 10.3 Verify offline mode compatibility (draft clients stored locally — out of scope, future feature; explicitly deferred in this change)
- [x] 10.4 Code cleanup: unused imports, consistent naming, no console logs
