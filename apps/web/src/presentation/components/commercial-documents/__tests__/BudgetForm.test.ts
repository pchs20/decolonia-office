import { toBudgetSnapshotPayload } from "@/presentation/components/commercial-documents/BudgetForm";

describe("toBudgetSnapshotPayload", () => {
  test("preserves the worker bank account in the snapshot payload", () => {
    const payload = toBudgetSnapshotPayload({
      name: "Worker",
      taxId: "123",
      phone: "",
      email: "",
      bankAccount: "ES1234567890",
      workAddress: { street: "Work", city: "Barcelona", postalCode: "08001" },
      billingAddress: { street: "Billing", city: "Barcelona", postalCode: "08001" }
    });

    expect(payload.bankAccount).toBe("ES1234567890");
  });

  test("normalizes an empty bank account to null", () => {
    const payload = toBudgetSnapshotPayload({
      name: "Worker",
      taxId: "123",
      phone: "",
      email: "",
      bankAccount: "",
      workAddress: { street: "Work", city: "Barcelona", postalCode: "08001" },
      billingAddress: { street: "Billing", city: "Barcelona", postalCode: "08001" }
    });

    expect(payload.bankAccount).toBeNull();
  });
});
