## 1. Dependency Installation

- [x] 1.1 Install OpenAPI documentation dependencies in `apps/web` workspace
- [x] 1.2 Ensure Swagger UI support is available through Next.js API docs route

## 2. SwaggerModule Configuration and Setup

- [x] 2.1 Configure OpenAPI document builder in `apps/web/src/layers/web/openapi/openapi.ts`
- [x] 2.2 Create OpenAPI configuration with `DocumentBuilder` (title: "Decolonia Office API", version: "1.0", description)
- [x] 2.3 Build the Swagger document from the app module in `main.ts`
- [x] 2.4 Register SwaggerModule to serve at `/api/docs` route in `main.ts`
- [x] 2.5 Verify Swagger UI loads without errors when API starts

## 3. Health Module API Documentation

- [x] 3.1 Add `@ApiOperation({ summary: '...' })` decorator to `HealthController.health()` method
- [x] 3.2 Add `@ApiResponse({ status: 200, description: '...', type: HealthResponseDto })` decorator to `HealthController.health()` method
- [x] 3.3 Create `HealthResponseDto` class with `@ApiProperty()` decorators for `status` and `timestamp` fields
- [x] 3.4 Add `@ApiOperation({ summary: '...' })` decorator to `HealthController.connectivity()` method
- [x] 3.5 Add `@ApiResponse({ status: 200, ... })` and `@ApiResponse({ status: 500, ... })` decorators to `HealthController.connectivity()` method
- [x] 3.6 Create `ConnectivityResponseDto` with `@ApiProperty()` decorators for response structure
- [x] 3.7 Update health module to export DTOs so they're available to SwaggerModule

## 4. Testing and Validation

- [x] 4.1 Start the app locally and verify Swagger UI loads at `http://localhost:3000/api/docs`
- [x] 4.2 Verify `/health` endpoint appears in Swagger UI with correct method, description, and response schema
- [x] 4.3 Verify `/health/connectivity` endpoint appears in Swagger UI with correct method, description, and response schemas
- [x] 4.4 Test "Try it out" feature: make a request to `/health` from Swagger UI and verify response displays
- [x] 4.5 Test "Try it out" feature: make a request to `/health/connectivity` from Swagger UI and verify response displays
- [x] 4.6 Verify error responses (500) are documented for `/health/connectivity` endpoint

## 5. Documentation and Future Preparation

- [x] 5.1 Document Swagger decorator patterns in contribution guidelines or API README
- [x] 5.2 Add note to README that Swagger UI is available at `/api/docs` for API documentation and testing
- [x] 5.3 Document that future modules should follow the same decorator pattern for Swagger support
