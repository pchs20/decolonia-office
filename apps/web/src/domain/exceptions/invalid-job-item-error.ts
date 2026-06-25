import { DomainException } from "@/domain/exceptions/domain-exception";

export class InvalidJobItemError extends DomainException {
  constructor(message: string) {
    super(`Invalid job item: ${message}`);
    Object.setPrototypeOf(this, InvalidJobItemError.prototype);
  }
}
