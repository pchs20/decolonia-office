/**
 * Swagger API response schemas for health endpoints
 * These are reusable schema definitions for OpenAPI documentation
 */

export const HealthResponseSchema = {
  type: "object",
  properties: {
    status: { type: "string", example: "ok" },
    timestamp: { type: "string", format: "date-time", example: "2026-06-14T17:33:30.894Z" }
  }
};

export const ConnectivityResponseSchema = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["ok", "degraded"], example: "ok" },
    checks: {
      type: "object",
      properties: {
        postgres: {
          type: "object",
          properties: {
            ok: { type: "boolean" },
            detail: { type: "string" }
          }
        },
        objectStorage: {
          type: "object",
          properties: {
            ok: { type: "boolean" },
            detail: { type: "string" }
          }
        }
      }
    }
  }
};
