import { ValidationError } from "@/domain/exceptions";

export type DocumentIdentifierSource = "automatic" | "custom";

export function validateDocumentIdentifier(value: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new ValidationError("Document number is required");
  }
  if (normalized.length > 255) {
    throw new ValidationError("Document number must not exceed 255 characters");
  }
  if ([...normalized].some(character => /[\u0000-\u001F\u007F]/u.test(character))) {
    throw new ValidationError("Document number contains invalid control characters");
  }
  return normalized;
}
