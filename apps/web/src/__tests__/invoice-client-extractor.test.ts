import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import * as XLSX from "xlsx";
import {
  classifyClient,
  clientRows,
  deduplicateCandidates,
  extractDirectory,
  normalizeTaxId,
  parseCityPostal,
  toCsv
} from "../../scripts/invoice-client-extractor";

describe("invoice client extractor", () => {
  it("normalizes tax ids and parses city postal codes", () => {
    expect(normalizeTaxId("B 87962197")).toBe("B87962197");
    expect(parseCityPostal("Vilassar de Mar C.P 08340")).toEqual({
      city: "Vilassar de Mar",
      postalCode: "08340"
    });
    expect(parseCityPostal("08340 Vilassa de Mar")).toEqual({
      city: "Vilassa de Mar",
      postalCode: "08340"
    });
  });

  it("classifies organizations and personal names conservatively", () => {
    expect(classifyClient("Fundació Privada Casa Pairal").type).toBe("company");
    expect(classifyClient("Vicente Cañizares").type).toBe("individual");
    expect(classifyClient("123").issue).toBe("type-ambiguous");
  });

  it("deduplicates by tax id and retains source files", () => {
    const base = {
      name: "Fundació Privada Casa Pairal",
      street: "Rosari Nº 59",
      city: "Vilassar de Mar",
      postalCode: "08340",
      taxId: "G58084955",
      type: "company" as const,
      typeReason: "organization-indicator",
      reviewReasons: [],
      originalName: "Fundació Privada Casa Pairal",
      originalStreet: "Rosari Nº 59",
      originalCity: "Vilassar de Mar C.P 08340",
      originalTaxId: "G58084955"
    };
    const result = deduplicateCandidates([
      { ...base, sourceFiles: ["b.xlsx"] },
      { ...base, sourceFiles: ["a.xlsx"] }
    ]);

    expect(result.candidates).toHaveLength(1);
    expect(result.candidates[0]?.sourceFiles).toEqual(["a.xlsx", "b.xlsx"]);
  });

  it("extracts and reviews a workbook without changing the source", () => {
    const inputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "invoice-extractor-"));
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet([
      ["Cliente"],
      ["Nombre", "ChelulixS.L"],
      ["Dirección", "Tres Peces Nº 34"],
      ["Ciudad", "C.P 28012 Madrid"],
      ["CIF.", "B 87962197"]
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet, "Factura");
    const filePath = path.join(inputDirectory, "invoice.xlsx");
    fs.writeFileSync(filePath, XLSX.write(workbook, { bookType: "xlsx", type: "buffer" }));
    const before = fs.readFileSync(filePath);

    const result = extractDirectory(inputDirectory);

    expect(clientRows(result.importReady)[0]).toMatchObject({
      name: "ChelulixS.L",
      type: "company",
      city: "Madrid",
      postalCode: "28012",
      street: "Tres Peces Nº 34",
      billingStreet: "Tres Peces Nº 34",
      billingCity: "Madrid",
      billingPostalCode: "28012",
      taxId: "B87962197"
    });
    expect(fs.readFileSync(filePath)).toEqual(before);
  });

  it("escapes CSV values and keeps stable column order", () => {
    expect(toCsv(["name", "sourceFiles"], [{ name: "A, B", sourceFiles: ["a.xlsx", "b.xlsx"] }])).toBe(
      "name,sourceFiles\n\"A, B\",a.xlsx; b.xlsx\n"
    );
  });
});