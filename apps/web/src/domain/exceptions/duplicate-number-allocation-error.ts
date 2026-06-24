import { DomainException } from "@/domain/exceptions/domain-exception";

export class DuplicateNumberAllocationError extends DomainException {
  constructor(documentType: string) {
    super(`Duplicate number allocation for ${documentType}`);
    Object.setPrototypeOf(this, DuplicateNumberAllocationError.prototype);
  }
}
