import { DomainException } from "@/domain/exceptions/domain-exception";

/**
 * Thrown when domain validation fails.
 * Maps to 400 Bad Request in API layer.
 */
export class ValidationError extends DomainException {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
