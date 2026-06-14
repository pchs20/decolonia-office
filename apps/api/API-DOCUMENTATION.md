# API Documentation

## Swagger UI

The API includes interactive API documentation via Swagger UI, available at `/api/docs` when the API is running.

Swagger UI provides:
- Visual exploration of all API endpoints
- Request/response schemas and examples
- Interactive "Try it out" feature to test endpoints directly
- Detailed error response documentation

### URL

- **Local development**: `http://localhost:3001/api/docs`
- **Staging/Production**: `https://<api-domain>/api/docs`

## Adding Swagger Documentation to Endpoints

When adding new endpoints or modifying existing ones, use the following decorator patterns to ensure they appear correctly in Swagger UI.

### Defining Reusable Schemas

Create a dedicated schema file for each module to keep schemas organized and reusable:

**`src/resource/resource.schemas.ts`**
```typescript
export const ResourceSchema = {
  type: "object",
  properties: {
    id: { type: "string", example: "123" },
    name: { type: "string", example: "Example Resource" }
  }
};

export const ResourceListSchema = {
  type: "array",
  items: ResourceSchema
};
```

### Basic Endpoint Documentation

```typescript
import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResourceSchema } from "./resource.schemas";

@ApiTags("Resources")  // Group endpoints by topic
@Controller("resources")
export class ResourceController {
  @Get(":id")
  @ApiOperation({
    summary: "Get resource by ID",
    description: "Retrieves a single resource by its unique identifier"
  })
  @ApiResponse({
    status: 200,
    description: "Resource found",
    schema: ResourceSchema
  })
  @ApiResponse({
    status: 404,
    description: "Resource not found"
  })
  getResource(id: string) {
    // implementation
  }
}
```

### Decorators Explained

- **`@ApiTags("TagName")`**: Groups related endpoints together in Swagger UI (capitalized for display)
- **`@ApiOperation({ summary, description })`**: Describes what the endpoint does
  - `summary`: One-sentence description (appears as title in Swagger UI)
  - `description`: Longer explanation of behavior and use cases
- **`@ApiResponse({ status, description, schema })`**: Documents a possible response
  - `status`: HTTP status code (200, 404, 500, etc.)
  - `description`: Human-readable description of this response
  - `schema`: Reference to a schema object from the module's schemas file

### Schema File Pattern

Each module should have a dedicated `<module>.schemas.ts` file containing reusable schema definitions:

```typescript
// src/resource/resource.schemas.ts
export const ResourceSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid", example: "123e4567-e89b-12d3-a456-426614174000" },
    name: { type: "string", example: "My Resource" },
    createdAt: { type: "string", format: "date-time", example: "2026-06-14T17:33:30.894Z" }
  }
};
```

Then import and use in decorators:

```typescript
import { ResourceSchema } from "./resource.schemas";

@ApiResponse({ status: 200, description: "...", schema: ResourceSchema })
```

### Common Patterns

#### GET Endpoint with Path Parameter

```typescript
import { ResourceSchema } from "./resource.schemas";

@Get(":id")
@ApiOperation({ summary: "Get resource by ID" })
@ApiResponse({ status: 200, description: "Resource found", schema: ResourceSchema })
@ApiResponse({ status: 404, description: "Resource not found" })
getById(@Param("id") id: string) { }
```

#### POST with Request Body

```typescript
import { ResourceSchema } from "./resource.schemas";

@Post()
@ApiOperation({ summary: "Create new resource" })
@ApiResponse({ status: 201, description: "Resource created", schema: ResourceSchema })
@ApiResponse({ status: 400, description: "Invalid request" })
create(@Body() createDto: CreateResourceDto) { }
```

#### List Endpoint

```typescript
import { ResourceListSchema } from "./resource.schemas";

@Get()
@ApiOperation({ summary: "List all resources" })
@ApiResponse({ status: 200, description: "Resources retrieved", schema: ResourceListSchema })
getAll() { }
```

#### Error Responses

Always document common error scenarios:

```typescript
@ApiResponse({ status: 400, description: "Bad Request - invalid parameters" })
@ApiResponse({ status: 401, description: "Unauthorized - authentication required" })
@ApiResponse({ status: 403, description: "Forbidden - permission denied" })
@ApiResponse({ status: 500, description: "Internal Server Error" })
```

## Best Practices

1. **Create dedicated schema files** - Define schemas in `<module>.schemas.ts` for reusability and clarity
2. **Avoid inline schemas** - Keep decorators clean by referencing schema objects instead of defining inline
3. **Keep summaries concise** - One sentence in `summary` field
4. **Use descriptions for context** - Explain why and when to use this endpoint
5. **Document all responses** - Success (2xx) and error (4xx, 5xx) scenarios
6. **Use realistic examples** - Help developers understand what data looks like
7. **Group related endpoints** - Use `@ApiTags` with capitalized names to organize endpoints logically
8. **Update decorators with code changes** - Keep documentation in sync with implementation
9. **Use format hints** - Include `format: "date-time"`, `format: "uuid"` for better Swagger UI rendering
10. **Document dependencies** - Note in the description if an endpoint depends on infrastructure (database, services)
