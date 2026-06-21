import {
  DomainException,
  EntityNotFoundError,
  ValidationError,
  ConflictError
} from "@/domain/exceptions";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getErrorResponse(error: unknown): { status: number; body: { message: string } } {
  // API layer errors: pass through directly
  if (error instanceof ApiError) {
    return {
      status: error.status,
      body: { message: error.message }
    };
  }

  // Domain exceptions: map to HTTP status codes
  if (error instanceof EntityNotFoundError) {
    return {
      status: 404,
      body: { message: error.message }
    };
  }

  if (error instanceof ValidationError) {
    return {
      status: 400,
      body: { message: error.message }
    };
  }

  if (error instanceof ConflictError) {
    return {
      status: 409,
      body: { message: error.message }
    };
  }

  if (error instanceof DomainException) {
    return {
      status: 400,
      body: { message: error.message }
    };
  }

  // Unknown errors: log and return generic 500
  if (process.env.NODE_ENV !== "production") {
    const message = error instanceof Error ? error.message : String(error);
    return {
      status: 500,
      body: { message: `Internal server error: ${message}` }
    };
  }

  return {
    status: 500,
    body: { message: "Internal server error" }
  };
}
