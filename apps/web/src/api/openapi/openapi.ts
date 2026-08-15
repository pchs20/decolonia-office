const clientSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    type: { type: "string", enum: ["individual", "company"] },
    street: { type: "string" },
    city: { type: "string" },
    postalCode: { type: "string" },
    billingStreet: { type: "string", nullable: true },
    billingCity: { type: "string", nullable: true },
    billingPostalCode: { type: "string", nullable: true },
    taxId: { type: "string" },
    phone: { type: "string", nullable: true },
    email: { type: "string", nullable: true },
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

const workerSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    street: { type: "string" },
    city: { type: "string" },
    postalCode: { type: "string" },
    billingStreet: { type: "string", nullable: true },
    billingCity: { type: "string", nullable: true },
    billingPostalCode: { type: "string", nullable: true },
    taxId: { type: "string" },
    phone: { type: "string", nullable: true },
    email: { type: "string", nullable: true },
    isActive: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  },
  required: [
    "id",
    "name",
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

const workerListSchema = {
  type: "object",
  properties: {
    workers: {
      type: "array",
      items: { $ref: "#/components/schemas/Worker" }
    },
    total: { type: "number" },
    page: { type: "number" },
    limit: { type: "number" }
  },
  required: ["workers", "total", "page", "limit"]
};

const taxSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    name: { type: "string" },
    rate: { type: "number" },
    behavior: { type: "string", enum: ["added", "included"] },
    isActive: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  },
  required: ["id", "name", "rate", "behavior", "isActive", "createdAt", "updatedAt"]
};

const workTemplateSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    title: { type: "string" },
    description: { type: "string" },
    defaultUnitPrice: { type: "number" },
    isActive: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  },
  required: ["id", "title", "description", "defaultUnitPrice", "isActive", "createdAt", "updatedAt"]
};

const jobItemSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    position: { type: "number" },
    title: { type: "string" },
    description: { type: "string", nullable: true },
    quantity: { type: "number", nullable: true },
    unitPrice: { type: "number", nullable: true },
    totalPrice: { type: "number", nullable: true },
    createdAt: { type: "string", format: "date-time" }
  },
  required: ["id", "position", "title", "description", "quantity", "unitPrice", "totalPrice", "createdAt"]
};

const budgetSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    number: { type: "number" },
    clientId: { type: "string", format: "uuid" },
    workerId: { type: "string", format: "uuid" },
    notes: { type: "string" },
    pricingMode: { type: "string", enum: ["computed", "manual-subtotal"] },
    manualSubtotalAmount: { type: "number", nullable: true },
    deliveredAt: { type: "string", format: "date-time", nullable: true },
    subtotal: { type: "number" },
    tax: { type: "number" },
    total: { type: "number" },
    jobItems: {
      type: "array",
      items: { $ref: "#/components/schemas/JobItem" }
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  },
  required: ["id", "number", "clientId", "workerId", "notes", "pricingMode", "manualSubtotalAmount", "subtotal", "tax", "total", "jobItems", "createdAt", "updatedAt"]
};

const invoiceSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    number: { type: "number" },
    clientId: { type: "string", format: "uuid" },
    workerId: { type: "string", format: "uuid" },
    notes: { type: "string" },
    pricingMode: { type: "string", enum: ["computed", "manual-subtotal"] },
    manualSubtotalAmount: { type: "number", nullable: true },
    issuedAt: { type: "string", format: "date-time" },
    sourceBudgetId: { type: "string", format: "uuid", nullable: true },
    subtotal: { type: "number" },
    tax: { type: "number" },
    total: { type: "number" },
    jobItems: {
      type: "array",
      items: { $ref: "#/components/schemas/JobItem" }
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  },
  required: ["id", "number", "clientId", "workerId", "notes", "pricingMode", "manualSubtotalAmount", "issuedAt", "subtotal", "tax", "total", "jobItems", "createdAt", "updatedAt"]
};

const budgetListSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: { $ref: "#/components/schemas/Budget" }
    },
    pagination: {
      type: "object",
      properties: {
        page: { type: "number" },
        limit: { type: "number" },
        total: { type: "number" },
        pages: { type: "number" }
      }
    }
  }
};

const invoiceListSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: { $ref: "#/components/schemas/Invoice" }
    },
    pagination: {
      type: "object",
      properties: {
        page: { type: "number" },
        limit: { type: "number" },
        total: { type: "number" },
        pages: { type: "number" }
      }
    }
  }
};

const taxListSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: { $ref: "#/components/schemas/Tax" }
    },
    pagination: {
      type: "object",
      properties: {
        page: { type: "number" },
        limit: { type: "number" },
        total: { type: "number" },
        pages: { type: "number" }
      }
    }
  }
};

const workTemplateListSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: { $ref: "#/components/schemas/WorkTemplate" }
    },
    pagination: {
      type: "object",
      properties: {
        page: { type: "number" },
        limit: { type: "number" },
        total: { type: "number" },
        pages: { type: "number" }
      }
    }
  }
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
      { name: "Budgets", description: "Budget management endpoints" },
      { name: "Clients", description: "Client management endpoints" },
      { name: "CommercialDocumentSettings", description: "Commercial document pricing settings endpoints" },
      { name: "Health", description: "Health and connectivity endpoints" },
      { name: "Invoices", description: "Invoice management endpoints" },
      { name: "Backup", description: "Backup and export endpoints" },
      { name: "Taxes", description: "Tax definition management endpoints" },
      { name: "Workers", description: "Worker management endpoints" },
      { name: "WorkTemplates", description: "Work template management endpoints" }
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
              schema: { type: "string" },
              description: "Search by client name or city"
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
      },
      "/api/workers": {
        get: {
          tags: ["Workers"],
          summary: "List active workers",
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
              schema: { type: "string" },
              description: "Search by worker name or city"
            }
          ],
          responses: {
            "200": {
              description: "List of workers",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/WorkerListResponse" }
                }
              }
            }
          }
        },
        post: {
          tags: ["Workers"],
          summary: "Create worker",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "street", "city", "postalCode", "taxId"],
                  properties: {
                    name: { type: "string" },
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
              description: "Worker created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Worker" }
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
      "/api/workers/{id}": {
        get: {
          tags: ["Workers"],
          summary: "Get worker by id",
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
              description: "Worker details",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Worker" }
                }
              }
            },
            "404": {
              description: "Worker not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" }
                }
              }
            }
          }
        },
        patch: {
          tags: ["Workers"],
          summary: "Update worker",
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
              description: "Updated worker",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Worker" }
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
              description: "Worker not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" }
                }
              }
            }
          }
        },
        delete: {
          tags: ["Workers"],
          summary: "Archive worker",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" }
            }
          ],
          responses: {
            "204": { description: "Worker archived" },
            "404": {
              description: "Worker not found",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" }
                }
              }
            }
          }
        }
      },
      "/api/backup/cloud": {
        post: {
          tags: ["Backup"],
          summary: "Synchronize backup data to Google Drive",
          requestBody: {
            required: false,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    cursor: { type: "integer", minimum: 0, default: 0 },
                    batchSize: { type: "integer", minimum: 1, maximum: 20, default: 5 }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Cloud synchronization batch progress",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      cursor: { type: "integer" },
                      nextCursor: { type: "integer", nullable: true },
                      processed: { type: "integer" },
                      skipped: { type: "integer" },
                      remaining: { type: "integer" },
                      spreadsheetUpdated: { type: "boolean" },
                      failures: { type: "array", items: { type: "object" } }
                    },
                    required: ["cursor", "nextCursor", "processed", "skipped", "remaining", "spreadsheetUpdated", "failures"]
                  }
                }
              }
            },
            "400": { description: "Invalid batch request" },
            "401": { description: "Unauthorized" },
            "500": { description: "Cloud synchronization failed" }
          }
        }
      },
      "/api/backup/cloud/authorize": {
        get: {
          tags: ["Backup"],
          summary: "Start Google Drive authorization",
          responses: {
            "302": { description: "Redirect to Google authorization" },
            "401": { description: "Unauthorized" }
          }
        }
      },
      "/api/backup/download": {
        get: {
          tags: ["Backup"],
          summary: "Download a complete backup ZIP",
          responses: {
            "200": {
              description: "Backup ZIP archive",
              content: { "application/zip": { schema: { type: "string", format: "binary" } } }
            },
            "401": { description: "Unauthorized" },
            "500": { description: "Backup generation failed" }
          }
        }
      },
      "/api/budgets": {
        get: {
          tags: ["Budgets"],
          summary: "List budgets",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "number", default: 1 }
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "number", default: 20 }
            },
            {
              name: "clientId",
              in: "query",
              schema: { type: "string", format: "uuid" }
            },
            {
              name: "search",
              in: "query",
              schema: { type: "string" },
              description: "Search by document number, client/worker name, or city"
            }
          ],
          responses: {
            "200": {
              description: "List of budgets",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/BudgetList" }
                }
              }
            }
          }
        },
        post: {
          tags: ["Budgets"],
          summary: "Create budget",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["clientId", "workerId"],
                  properties: {
                    clientId: { type: "string", format: "uuid" },
                    workerId: { type: "string", format: "uuid" },
                    notes: { type: "string" },
                    taxId: { type: "string", format: "uuid", nullable: true },
                    pricingMode: { type: "string", enum: ["computed", "manual-subtotal"] },
                    manualSubtotalAmount: { type: "number", nullable: true },
                    deliveredAt: { type: "string", format: "date-time" }
                  }
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Budget created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Budget" }
                }
              }
            }
          }
        }
      },
      "/api/budgets/{id}": {
        get: {
          tags: ["Budgets"],
          summary: "Get budget",
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
              description: "Budget details",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Budget" }
                }
              }
            }
          }
        },
        patch: {
          tags: ["Budgets"],
          summary: "Update budget",
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
                    notes: { type: "string" },
                    deliveredAt: { type: "string", format: "date-time" },
                    taxId: { type: "string", format: "uuid", nullable: true },
                    pricingMode: { type: "string", enum: ["computed", "manual-subtotal"] },
                    manualSubtotalAmount: { type: "number", nullable: true }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Budget updated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Budget" }
                }
              }
            }
          }
        }
      },
      "/api/budgets/{id}/items": {
        post: {
          tags: ["Budgets"],
          summary: "Add job item to budget",
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
                  required: ["title"],
                  properties: {
                    title: { type: "string" },
                    description: { type: "string", nullable: true },
                    quantity: { type: "number", nullable: true },
                    unitPrice: { type: "number", nullable: true },
                    totalPrice: { type: "number", nullable: true }
                  }
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Job item added",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/JobItem" }
                }
              }
            }
          }
        }
      },
      "/api/budgets/{id}/items/{itemId}": {
        patch: {
          tags: ["Budgets"],
          summary: "Update job item",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" }
            },
            {
              name: "itemId",
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
                    title: { type: "string" },
                    description: { type: "string", nullable: true },
                    quantity: { type: "number", nullable: true },
                    unitPrice: { type: "number", nullable: true },
                    totalPrice: { type: "number", nullable: true }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Job item updated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/JobItem" }
                }
              }
            }
          }
        },
        delete: {
          tags: ["Budgets"],
          summary: "Remove job item",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" }
            },
            {
              name: "itemId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" }
            }
          ],
          responses: {
            "200": {
              description: "Job item removed",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/budgets/{id}/pdf": {
        get: {
          tags: ["Budgets"],
          summary: "Export budget as PDF",
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
              description: "PDF file",
              content: {
                "application/pdf": {
                  schema: { type: "string", format: "binary" }
                }
              }
            },
            "404": { description: "Budget not found" }
          }
        }
      },
      "/api/invoices/{id}/pdf": {
        get: {
          tags: ["Invoices"],
          summary: "Export invoice as PDF",
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
              description: "PDF file",
              content: {
                "application/pdf": {
                  schema: { type: "string", format: "binary" }
                }
              }
            },
            "404": { description: "Invoice not found" }
          }
        }
      },
      "/api/invoices": {
        get: {
          tags: ["Invoices"],
          summary: "List invoices",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "number", default: 1 }
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "number", default: 20 }
            },
            {
              name: "clientId",
              in: "query",
              schema: { type: "string", format: "uuid" }
            },
            {
              name: "year",
              in: "query",
              schema: { type: "number" }
            },
            {
              name: "search",
              in: "query",
              schema: { type: "string" },
              description: "Search by document number, client/worker name, or city"
            }
          ],
          responses: {
            "200": {
              description: "List of invoices",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/InvoiceList" }
                }
              }
            }
          }
        },
        post: {
          tags: ["Invoices"],
          summary: "Create invoice",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["clientId", "workerId"],
                  properties: {
                    clientId: { type: "string", format: "uuid" },
                    workerId: { type: "string", format: "uuid" },
                    notes: { type: "string" },
                    taxId: { type: "string", format: "uuid", nullable: true },
                    pricingMode: { type: "string", enum: ["computed", "manual-subtotal"] },
                    manualSubtotalAmount: { type: "number", nullable: true },
                    issuedAt: { type: "string", format: "date-time" },
                    sourceBudgetId: { type: "string", format: "uuid", nullable: true }
                  }
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Invoice created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Invoice" }
                }
              }
            }
          }
        }
      },
      "/api/invoices/{id}": {
        get: {
          tags: ["Invoices"],
          summary: "Get invoice",
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
              description: "Invoice details",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Invoice" }
                }
              }
            }
          }
        },
        patch: {
          tags: ["Invoices"],
          summary: "Update invoice",
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
                    notes: { type: "string" },
                    issuedAt: { type: "string", format: "date-time" },
                    taxId: { type: "string", format: "uuid", nullable: true },
                    pricingMode: { type: "string", enum: ["computed", "manual-subtotal"] },
                    manualSubtotalAmount: { type: "number", nullable: true },
                    sourceBudgetId: { type: "string", format: "uuid", nullable: true }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Invoice updated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Invoice" }
                }
              }
            }
          }
        }
      },
      "/api/invoices/{id}/items": {
        post: {
          tags: ["Invoices"],
          summary: "Add job item to invoice",
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
                  required: ["title"],
                  properties: {
                    title: { type: "string" },
                    description: { type: "string", nullable: true },
                    quantity: { type: "number", nullable: true },
                    unitPrice: { type: "number", nullable: true },
                    totalPrice: { type: "number", nullable: true }
                  }
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Job item added",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/JobItem" }
                }
              }
            }
          }
        }
      },
      "/api/invoices/{id}/items/{itemId}": {
        patch: {
          tags: ["Invoices"],
          summary: "Update job item",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" }
            },
            {
              name: "itemId",
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
                    title: { type: "string" },
                    description: { type: "string", nullable: true },
                    quantity: { type: "number", nullable: true },
                    unitPrice: { type: "number", nullable: true },
                    totalPrice: { type: "number", nullable: true }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Job item updated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/JobItem" }
                }
              }
            }
          }
        },
        delete: {
          tags: ["Invoices"],
          summary: "Remove job item",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" }
            },
            {
              name: "itemId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" }
            }
          ],
          responses: {
            "200": {
              description: "Job item removed",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/taxes": {
        get: {
          tags: ["Taxes"],
          summary: "List tax definitions",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "number", default: 1 }
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "number", default: 100 }
            },
            {
              name: "includeInactive",
              in: "query",
              schema: { type: "boolean" }
            }
          ],
          responses: {
            "200": {
              description: "List of tax definitions",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/TaxList" }
                }
              }
            }
          }
        },
        post: {
          tags: ["Taxes"],
          summary: "Create tax definition",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "rate", "behavior"],
                  properties: {
                    name: { type: "string" },
                    rate: { type: "number" },
                    behavior: { type: "string", enum: ["added", "included"] }
                  }
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Tax definition created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Tax" }
                }
              }
            }
          }
        }
      },
      "/api/taxes/{id}": {
        patch: {
          tags: ["Taxes"],
          summary: "Update tax definition",
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
                    rate: { type: "number" },
                    behavior: { type: "string", enum: ["added", "included"] }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Tax definition updated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Tax" }
                }
              }
            }
          }
        }
      },
      "/api/taxes/{id}/archive": {
        post: {
          tags: ["Taxes"],
          summary: "Archive tax definition",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" }
            }
          ],
          responses: {
            "204": {
              description: "Tax definition archived"
            }
          }
        }
      },
      "/api/work-templates": {
        get: {
          tags: ["WorkTemplates"],
          summary: "List work templates",
          parameters: [
            {
              name: "page",
              in: "query",
              schema: { type: "number", default: 1 }
            },
            {
              name: "limit",
              in: "query",
              schema: { type: "number", default: 100 }
            },
            {
              name: "includeInactive",
              in: "query",
              schema: { type: "boolean" }
            }
          ],
          responses: {
            "200": {
              description: "List of work templates",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/WorkTemplateList" }
                }
              }
            }
          }
        },
        post: {
          tags: ["WorkTemplates"],
          summary: "Create work template",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "description", "defaultUnitPrice"],
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    defaultUnitPrice: { type: "number" }
                  }
                }
              }
            }
          },
          responses: {
            "201": {
              description: "Work template created",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/WorkTemplate" }
                }
              }
            }
          }
        }
      },
      "/api/work-templates/{id}": {
        patch: {
          tags: ["WorkTemplates"],
          summary: "Update work template",
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
                    title: { type: "string" },
                    description: { type: "string" },
                    defaultUnitPrice: { type: "number" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Work template updated",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/WorkTemplate" }
                }
              }
            }
          }
        }
      },
      "/api/work-templates/{id}/archive": {
        post: {
          tags: ["WorkTemplates"],
          summary: "Archive work template",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" }
            }
          ],
          responses: {
            "204": {
              description: "Work template archived"
            }
          }
        }
      },
      "/api/commercial-document-settings/sequences": {
        get: {
          tags: ["CommercialDocumentSettings"],
          summary: "Get document sequences",
          responses: {
            "200": {
              description: "Current document sequences",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      sequences: {
                        type: "array",
                        items: { $ref: "#/components/schemas/DocumentSequence" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/commercial-document-settings/sequences/adjust": {
        post: {
          tags: ["CommercialDocumentSettings"],
          summary: "Adjust document sequence",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["documentType", "nextNumber"],
                  properties: {
                    documentType: { type: "string", enum: ["budget", "invoice"] },
                    year: { type: "number" },
                    nextNumber: { type: "number" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Document sequence adjusted",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/DocumentSequence" }
                }
              }
            }
          }
        }
      },
      "/api/commercial-document-settings": {
        get: {
          tags: ["CommercialDocumentSettings"],
          summary: "Get commercial document default settings",
          responses: {
            "200": {
              description: "Default commercial document settings",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      defaultBudgetPricingMode: { type: "string", enum: ["computed", "manual-subtotal"] },
                      defaultInvoicePricingMode: { type: "string", enum: ["computed", "manual-subtotal"] }
                    },
                    required: ["defaultBudgetPricingMode", "defaultInvoicePricingMode"]
                  }
                }
              }
            }
          }
        },
        patch: {
          tags: ["CommercialDocumentSettings"],
          summary: "Update commercial document default settings",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["defaultBudgetPricingMode", "defaultInvoicePricingMode"],
                  properties: {
                    defaultBudgetPricingMode: { type: "string", enum: ["computed", "manual-subtotal"] },
                    defaultInvoicePricingMode: { type: "string", enum: ["computed", "manual-subtotal"] }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Updated commercial document settings",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      defaultBudgetPricingMode: { type: "string", enum: ["computed", "manual-subtotal"] },
                      defaultInvoicePricingMode: { type: "string", enum: ["computed", "manual-subtotal"] }
                    },
                    required: ["defaultBudgetPricingMode", "defaultInvoicePricingMode"]
                  }
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
        Worker: workerSchema,
        WorkerListResponse: workerListSchema,
        Tax: taxSchema,
        WorkTemplate: workTemplateSchema,
        JobItem: jobItemSchema,
        Budget: budgetSchema,
        Invoice: invoiceSchema,
        BudgetList: budgetListSchema,
        InvoiceList: invoiceListSchema,
        TaxList: taxListSchema,
        WorkTemplateList: workTemplateListSchema,
        ErrorResponse: errorSchema
      }
    }
  };
}
