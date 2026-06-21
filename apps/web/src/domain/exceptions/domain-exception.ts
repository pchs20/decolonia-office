/**
 * Base exception for domain layer errors.
 * All domain exceptions extend this.
 * API layer catches these and maps to ApiError.
 */
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, DomainException.prototype);
  }
}
