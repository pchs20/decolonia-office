import { DomainException } from "@/domain/exceptions/domain-exception";

/**
 * Thrown when a business logic conflict occurs.
 * Examples: duplicate email, constraint violations
 * Maps to 409 Conflict in API layer.
 */
export class ConflictError extends DomainException {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}
