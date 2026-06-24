import { DomainException } from "@/domain/exceptions/domain-exception";

export class InvalidTaxError extends DomainException {
  constructor(message: string) {
    super(`Invalid tax definition: ${message}`);
    Object.setPrototypeOf(this, InvalidTaxError.prototype);
  }
}
