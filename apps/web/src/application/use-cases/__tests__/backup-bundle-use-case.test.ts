import { assembleBackupBundle } from "@/application/use-cases/backup-export/backup-bundle-use-case";
import { BackupDataSource, DocumentPdfRenderer } from "@/application/outbound/backup-export-ports";

function createDependencies(
  data: Partial<BackupDataSource> = {},
  renderer: Partial<DocumentPdfRenderer> = {}
) {
  return {
    dataSource: {
      getClientsForExport: async () => [],
      getBudgetsForExport: async () => [],
      getInvoicesForExport: async () => [],
      ...data
    } as BackupDataSource,
    pdfRenderer: {
      renderBudgetPdf: async () => new Uint8Array([1]),
      renderInvoicePdf: async () => new Uint8Array([2]),
      getBudgetNumber: async () => "budget",
      getInvoiceNumber: async () => "invoice",
      ...renderer
    } as DocumentPdfRenderer
  };
}

describe("assembleBackupBundle", () => {
  it("creates all required tables and leaves empty document collections without files", async () => {
    const bundle = await assembleBackupBundle(createDependencies());

    expect(bundle.tables.map((table) => table.name)).toEqual(["Clients", "Budgets", "Invoices"]);
    expect(bundle.files).toEqual([]);
  });

  it("maps stable columns and creates deterministic budget and invoice paths", async () => {
    const bundle = await assembleBackupBundle(
      createDependencies({
        getClientsForExport: async () => [{ id: "client-1", name: "Client" }],
        getBudgetsForExport: async () => [
          { id: "budget-1", number: "2026/0042", deliveredAt: "2026-01-15T00:00:00.000Z", createdAt: "2026-01-01T00:00:00.000Z" }
        ],
        getInvoicesForExport: async () => [
          { id: "invoice-1", number: "2026-0007", issuedAt: "2026-02-10T00:00:00.000Z", createdAt: "2026-02-01T00:00:00.000Z" }
        ]
      })
    );

    expect(bundle.tables[0]).toEqual({
      name: "Clients",
      columns: ["id", "name"],
      rows: [["client-1", "Client"]]
    });
    expect(bundle.files.map((file) => file.path)).toEqual([
      "Budgets/2026/Q1/presupuesto-2026-0042.pdf",
      "Invoices/2026/Q1/factura-2026-0007.pdf"
    ]);
  });

  it("uses the updated document date when choosing a destination path", async () => {
    const bundle = await assembleBackupBundle(
      createDependencies({
        getBudgetsForExport: async () => [
          { id: "budget-1", number: "42", deliveredAt: "2027-11-15T00:00:00.000Z", createdAt: "2026-01-01T00:00:00.000Z" }
        ]
      })
    );

    expect(bundle.files[0]?.path).toBe("Budgets/2027/Q4/presupuesto-42.pdf");
  });
});
