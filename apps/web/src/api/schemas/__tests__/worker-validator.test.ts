import { ApiError } from "@/api/errors/api-errors";
import {
  validateWorkerCreatePayload,
  validateWorkerUpdatePayload
} from "@/api/schemas/worker-validator";

describe("worker payload validation", () => {
  it("validates create payload with structured work address and optional billing", () => {
    const input = validateWorkerCreatePayload({
      name: "Worker A",
      street: "Carrer 1",
      city: "Barcelona",
      postalCode: "08001",
      taxId: "12345678X"
    });

    expect(input.street).toBe("Carrer 1");
    expect(input.city).toBe("Barcelona");
    expect(input.postalCode).toBe("08001");
    expect(input.billingStreet).toBeUndefined();
  });

  it("rejects create payload with incomplete billing fields", () => {
    expect(() =>
      validateWorkerCreatePayload({
        name: "Worker B",
        street: "Carrer 2",
        city: "Barcelona",
        postalCode: "08002",
        billingStreet: "Avinguda 3",
        taxId: "B12345678"
      })
    ).toThrow(ApiError);
  });

  it("allows update payload without address fields for forward-only tolerance", () => {
    const input = validateWorkerUpdatePayload({ name: "Updated Name" });
    expect(input.name).toBe("Updated Name");
  });

  it("rejects update payload with partial billing fields", () => {
    expect(() => validateWorkerUpdatePayload({ billingCity: "Barcelona" })).toThrow(ApiError);
  });

  it("accepts update payload with isPrimary: true", () => {
    const input = validateWorkerUpdatePayload({ isPrimary: true });
    expect(input.isPrimary).toBe(true);
  });

  it("accepts update payload with isPrimary: false", () => {
    const input = validateWorkerUpdatePayload({ isPrimary: false });
    expect(input.isPrimary).toBe(false);
  });

  it("rejects update payload with non-boolean isPrimary", () => {
    expect(() => validateWorkerUpdatePayload({ isPrimary: "yes" })).toThrow(ApiError);
  });
});