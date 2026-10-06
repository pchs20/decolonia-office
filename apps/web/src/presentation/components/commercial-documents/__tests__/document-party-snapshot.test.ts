import {
  emptyDocumentPartySnapshot,
  getChangedSnapshotFields,
  normalizeDocumentPartySnapshot,
  toDocumentPartySnapshotPayload
} from "@/presentation/components/commercial-documents/document-party-snapshot";

function snapshot() {
  return {
    ...emptyDocumentPartySnapshot(),
    name: "Worker",
    taxId: "123",
    workAddress: { street: "Work", city: "Barcelona", postalCode: "08001" },
    billingAddress: { street: "Billing", city: "Barcelona", postalCode: "08001" }
  };
}

describe("document party snapshots", () => {
  test("normalizes optional values and preserves worker bank account", () => {
    const current = snapshot();
    current.phone = "  +34 600 000 000 ";
    current.bankAccount = " ES123 ";

    expect(normalizeDocumentPartySnapshot(current).phone).toBe("+34 600 000 000");
    expect(toDocumentPartySnapshotPayload(current).bankAccount).toBe("ES123");
  });

  test("reports complete changed field list", () => {
    const current = snapshot();
    const source = snapshot();
    source.email = "worker@example.com";
    source.bankAccount = "ES123";
    source.billingAddress.city = "Girona";

    expect(getChangedSnapshotFields(current, source)).toEqual(["email", "bankAccount", "billingCity"]);
  });

  test("does not report formatting-only differences", () => {
    const current = snapshot();
    const source = snapshot();
    source.name = " Worker ";
    source.workAddress.city = " Barcelona ";

    expect(getChangedSnapshotFields(current, source)).toEqual([]);
  });
});
