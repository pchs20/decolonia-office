const clientSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    type: { type: "string", enum: ["individual", "company"] },
    street: { type: "string" },
    city: { type: "string" },
    postalCode: { type: "string" },
    billingStreet: { type: ["string", "null"] },
    billingCity: { type: ["string", "null"] },
    billingPostalCode: { type: ["string", "null"] },
    taxId: { type: "string" },
    phone: { type: ["string", "null"] },
    email: { type: ["string", "null"] },
    isActive: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  },
  required: [
    "id",
    "name",
    "type",
    "street",
    "city",
    "postalCode",
    "billingStreet",
    "billingCity",
    "billingPostalCode",
    "taxId",
    "phone",
    "email",
    "isActive",
    "createdAt",
    "updatedAt"
  ]
};

const clientListSchema = {
  type: "object",
  properties: {
    clients: {
      type: "array",
      items: { $ref: "#/components/schemas/Client" }
    },
    total: { type: "number" },
    page: { type: "number" },
    limit: { type: "number" }
  },
  required: ["clients", "total", "page", "limit"]
};

const errorSchema = {
  type: "object",
  properties: {
    message: { type: "string" }
  },
  required: ["message"]
};

export function getOpenApiDocument() {
  return {
    openapi: "3.0.3",
    info: {
      title: "Decolonia Office API",
      description: "Serverless REST API for Decolonia Office platform",
      version: "1.0.0"
    },
    tags: [
      { name: "Health", description: "Health and connectivity endpoints" },
      { name: "Clients", description: "Client management endpoints" }
    ],
    paths: {
      "/api/health": {
        get: {
          tags: ["Health"],
          summary: "API health check",
          responses: {
            "200": {
              description: "API health status",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "ok" },
                      timestamp: { type: "string", format: "date-time" }
                    },
                    required: ["status", "timestamp"]
                  }
                }
              }
            }
          }
        }
      },
      "/api/health/connectivity": {
        get: {
          tags: ["Health"],
          summary: "Infrastructure connectivity check",
          responses: {
            "200": {
              description: "Connectivity status",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", enum: ["ok", "degraded"] },
                      checks: {
                        type: "object",
                        properties: {
                          postgres: {
                            type: "object",
                            properties: {
                              ok: { type: "boolean" },
                              detail: { type: "string" }
                            },
                            required: ["ok", "detail"]
                          }
                        },
                        required: ["postgres"]
                      }
                    },
                    required: ["status", "checks"]
                  }
                }
              }
            }
          }
        }
      },
      "/api/clients": {
        get: {
          tags: ["Clients"],
          summary: "List active clients",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "number", default: 1 }
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "number", default: 10 }
            },
            {
              name: "search",
              in: "query",
              schema: { type: "string" }
            }
          ],
          responses: {
            "200": {
              description: "List of clients",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ClientListResponse" }
                }
              }
            }
          }
        },
        post: {
          tags: ["Clients"],
          summary: "Create client",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "type", "street", "city", "postalCode", "taxId"],
                  properties: {
                    name: { type: "string" },
                    type: { type: "string", enum: ["individual", "company"] },
                    street: { type: "string" },
                    city: { type: "string" },
                    postalCode: { type: "string" },
                    billingStreet: { type: "string" },
                    billingCity: { type: "string" },
                    billingPostalCode: { type: "string" },
                    taxId: { type: "string" },
                    phone: { type: "string" },
                    email: { type: "string", format: "email" }
                  }
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Client created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Client" }
                }
              }
            },
            "400": {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" }
                }
              }
            }
          }
        }
      },
      "/api/clients/{id}": {
        get: {
          tags: ["Clients"],
          summary: "Get client by id",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" }
            }
          ],
          responses: {
            "200": {
              description: "Client details",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Client" }
                }
              }
            },
            "404": {
              description: "Client not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" }
                }
              }
            }
          }
        },
        patch: {
          tags: ["Clients"],
          summary: "Update client",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    type: { type: "string", enum: ["individual", "company"] },
                    street: { type: "string" },
                    city: { type: "string" },
                    postalCode: { type: "string" },
                    billingStreet: { type: "string" },
                    billingCity: { type: "string" },
                    billingPostalCode: { type: "string" },
                    taxId: { type: "string" },
                    phone: { type: "string" },
                    email: { type: "string", format: "email" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Updated client",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Client" }
                }
              }
            },
            "400": {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" }
                }
              }
            },
            "404": {
              description: "Client not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" }
                }
              }
            }
          }
        },
        delete: {
          tags: ["Clients"],
          summary: "Archive client",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" }
            }
          ],
          responses: {
            "204": { description: "Client archived" },
            "404": {
              description: "Client not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Client: clientSchema,
        ClientListResponse: clientListSchema,
        ErrorResponse: errorSchema
      }
    }
  };
}
