import { ApiError } from "@/server/api-errors";
import { validateCreateInput, validateUpdateInput } from "@/server/clients-service";

describe("clients-service validation", () => {
  it("validates create payload with structured work address and optional billing", () => {
    const input = validateCreateInput({
      name: "Client A",
      type: "individual",
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
      validateCreateInput({
        name: "Client B",
        type: "company",
        street: "Carrer 2",
        city: "Barcelona",
        postalCode: "08002",
        billingStreet: "Avinguda 3",
        taxId: "B12345678"
      })
    ).toThrow(ApiError);
  });

  it("allows update payload without address fields for forward-only tolerance", () => {
    const input = validateUpdateInput({ name: "Updated Name" });
    expect(input.name).toBe("Updated Name");
  });

  it("rejects update payload with partial billing fields", () => {
    expect(() => validateUpdateInput({ billingCity: "Barcelona" })).toThrow(ApiError);
  });
});
