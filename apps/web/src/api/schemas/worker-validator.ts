import { ApiError } from "@/api/errors/api-errors";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return value.trim();
}

function validateBillingCompleteness(
  billingStreet?: string,
  billingCity?: string,
  billingPostalCode?: string,
  forceCheck: boolean = false
): void {
  const hasAnyBillingField =
    forceCheck || billingStreet !== undefined || billingCity !== undefined || billingPostalCode !== undefined;

  if (!hasAnyBillingField) {
    return;
  }

  const hasAllBillingFields = Boolean(billingStreet && billingCity && billingPostalCode);
  const hasNoBillingFields = !billingStreet && !billingCity && !billingPostalCode;

  if (!hasAllBillingFields && !hasNoBillingFields) {
    throw new ApiError(
      400,
      "Billing street, city, and postal code must all be provided together"
    );
  }
}

export interface WorkerCreatePayload {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  billingStreet?: string;
  billingCity?: string;
  billingPostalCode?: string;
  taxId: string;
  phone?: string;
  email?: string;
  bankAccount?: string;
}

export interface WorkerUpdatePayload {
  name?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  billingStreet?: string;
  billingCity?: string;
  billingPostalCode?: string;
  taxId?: string;
  phone?: string;
  email?: string;
  bankAccount?: string;
  isPrimary?: boolean;
}

export function validateWorkerCreatePayload(payload: unknown): WorkerCreatePayload {
  if (!payload || typeof payload !== "object") {
    throw new ApiError(400, "Request body must be an object");
  }

  const data = payload as Record<string, unknown>;

  const name = normalizeString(data.name);
  if (!name) throw new ApiError(400, "Worker name is required");

  const street = normalizeString(data.street);
  if (!street) throw new ApiError(400, "Worker street is required");

  const city = normalizeString(data.city);
  if (!city) throw new ApiError(400, "Worker city is required");

  const postalCode = normalizeString(data.postalCode);
  if (!postalCode) throw new ApiError(400, "Worker postal code is required");

  const taxId = normalizeString(data.taxId);
  if (!taxId) throw new ApiError(400, "Worker tax ID is required");

  const billingStreet = normalizeString(data.billingStreet);
  const billingCity = normalizeString(data.billingCity);
  const billingPostalCode = normalizeString(data.billingPostalCode);

  validateBillingCompleteness(billingStreet, billingCity, billingPostalCode);

  const phone = normalizeString(data.phone);
  const email = normalizeString(data.email);

  if (email && !isValidEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (phone && phone.length < 6) {
    throw new ApiError(400, "Phone number must be at least 6 characters");
  }

  return {
    name,
    street,
    city,
    postalCode,
    billingStreet,
    billingCity,
    billingPostalCode,
    taxId,
    phone,
    email,
    bankAccount: normalizeString(data.bankAccount)
  };
}

export function validateWorkerUpdatePayload(payload: unknown): WorkerUpdatePayload {
  if (!payload || typeof payload !== "object") {
    throw new ApiError(400, "Request body must be an object");
  }

  const data = payload as Record<string, unknown>;
  const output: WorkerUpdatePayload = {};

  if ("name" in data) {
    const name = normalizeString(data.name);
    if (!name) throw new ApiError(400, "Worker name is required");
    output.name = name;
  }

  if ("street" in data) {
    const street = normalizeString(data.street);
    if (!street) throw new ApiError(400, "Worker street is required");
    output.street = street;
  }

  if ("city" in data) {
    const city = normalizeString(data.city);
    if (!city) throw new ApiError(400, "Worker city is required");
    output.city = city;
  }

  if ("postalCode" in data) {
    const postalCode = normalizeString(data.postalCode);
    if (!postalCode) throw new ApiError(400, "Worker postal code is required");
    output.postalCode = postalCode;
  }

  if ("billingStreet" in data) {
    output.billingStreet = normalizeString(data.billingStreet);
  }

  if ("billingCity" in data) {
    output.billingCity = normalizeString(data.billingCity);
  }

  if ("billingPostalCode" in data) {
    output.billingPostalCode = normalizeString(data.billingPostalCode);
  }

  if ("taxId" in data) {
    const taxId = normalizeString(data.taxId);
    if (!taxId) throw new ApiError(400, "Worker tax ID is required");
    output.taxId = taxId;
  }

  if ("phone" in data) {
    const phone = normalizeString(data.phone);
    if (phone && phone.length < 6) {
      throw new ApiError(400, "Phone number must be at least 6 characters");
    }
    output.phone = phone;
  }

  if ("email" in data) {
    const email = normalizeString(data.email);
    if (email && !isValidEmail(email)) {
      throw new ApiError(400, "Invalid email format");
    }
    output.email = email;
  }

  if ("bankAccount" in data) {
    output.bankAccount = normalizeString(data.bankAccount);
  }

  if ("isPrimary" in data) {
    if (typeof data.isPrimary !== "boolean") {
      throw new ApiError(400, "isPrimary must be a boolean");
    }
    output.isPrimary = data.isPrimary;
  }

  validateBillingCompleteness(
    output.billingStreet,
    output.billingCity,
    output.billingPostalCode,
    ["billingStreet", "billingCity", "billingPostalCode"].some(key => key in data)
  );

  return output;
}
