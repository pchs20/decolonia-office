import { DomainException } from "@/domain/exceptions/domain-exception";

/**
 * Thrown when an entity is not found in the repository.
 * Maps to 404 Not Found in API layer.
 */
export class EntityNotFoundError extends DomainException {
  constructor(messageOrEntityName: string, id?: string) {
    // If id is provided, format as "EntityName with id "123" not found"
    // Otherwise, use messageOrEntityName as the full message
    const message = id
      ? `${messageOrEntityName} with id "${id}" not found`
      : messageOrEntityName;
    super(message);
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }
}

