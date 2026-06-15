export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getErrorResponse(error: unknown): { status: number; body: { message: string } } {
  if (error instanceof ApiError) {
    return {
      status: error.status,
      body: { message: error.message }
    };
  }

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
