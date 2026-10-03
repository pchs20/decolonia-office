import { validateDocumentIdentifier } from "@/domain/value-objects/document-identifier";

describe("validateDocumentIdentifier", () => {
  it("trims valid identifiers", () => {
    expect(validateDocumentIdentifier("  EXT-42 ")).toBe("EXT-42");
  });

  it.each(["", "   ", "a".repeat(256), "bad\nvalue"]) ("rejects invalid identifier %j", value => {
    expect(() => validateDocumentIdentifier(value)).toThrow();
  });
});
