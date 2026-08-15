import { synchronizeCloudBatch } from "@/application/use-cases/backup-export/cloud-sync-use-case";
import { BackupDataSource, CloudFilePort, CloudSpreadsheetPort, DocumentPdfRenderer } from "@/application/outbound/backup-export-ports";
import { DocumentExportStateRepository } from "@/application/outbound/document-export-state-repository";
import { ExportProvider } from "@/application/outbound/export-provider";

function createDependencies(options: { skipBudgetOne?: boolean; failBudgetTwo?: boolean } = {}) {
  const uploads: string[] = [];
  const successes: string[] = [];
  const failures: string[] = [];
  const destinationReferences: string[] = [];
  const source: BackupDataSource = {
    getClientsForExport: async () => [],
    getBudgetsForExport: async () => [
      { id: "budget-1", number: "1", updatedAt: "2026-01-01T00:00:00.000Z", deliveredAt: "2026-01-01T00:00:00.000Z" },
      { id: "budget-2", number: "2", updatedAt: "2026-01-02T00:00:00.000Z", deliveredAt: "2026-01-02T00:00:00.000Z" }
    ],
    getInvoicesForExport: async () => []
  };
  const renderer: DocumentPdfRenderer = {
    renderBudgetPdf: async (id) => {
      if (id === "budget-2" && options.failBudgetTwo !== false) throw new Error("render failed");
      return new Uint8Array([1]);
    },
    renderInvoicePdf: async () => new Uint8Array([2]),
    getBudgetNumber: async () => "1",
    getInvoiceNumber: async () => "1"
  };
  const filePort: CloudFilePort = {
    ensureFolder: async ({ name }) => ({ externalReference: name }),
    upsertFile: async ({ name }) => {
      uploads.push(name);
      return { externalReference: `drive-${name}` };
    },
    moveFile: async () => undefined
  };
  const spreadsheetPort: CloudSpreadsheetPort = {
    ensureSpreadsheet: async () => ({ externalReference: "sheet" }),
    replaceTables: async () => undefined
  };
  const stateRepository: DocumentExportStateRepository = {
    getByDocument: async (_type, id, _provider, destinationReference) => {
      destinationReferences.push(destinationReference);
      return id === "budget-1" && options.skipBudgetOne !== false
      ? {
          id: "state-1",
          documentType: "budget",
          documentId: id,
          provider: ExportProvider.GoogleDrive,
          destinationReference: "shared-folder",
          externalReference: "drive-existing",
          sourceUpdatedAt: new Date("2026-01-01T00:00:00.000Z"),
          syncedAt: new Date(),
          lastAttemptedAt: new Date(),
          lastError: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      : null;
    },
    recordSuccess: async ({ documentId }) => {
      successes.push(documentId);
      return {} as never;
    },
    recordFailure: async ({ documentId }) => {
      failures.push(documentId);
      return {} as never;
    }
  };

  return {
    dependencies: {
      dataSource: source,
      pdfRenderer: renderer,
      exportStateRepository: stateRepository,
      destination: {
        provider: ExportProvider.GoogleDrive,
        destinationReference: "shared-folder",
        budgetsFolderReference: "budgets",
        invoicesFolderReference: "invoices",
        spreadsheetReference: "sheet",
        filePort,
        spreadsheetPort
      }
    },
    uploads,
    successes,
    failures,
    destinationReferences
  };
}

describe("synchronizeCloudBatch", () => {
  it("skips unchanged documents and records successful uploads", async () => {
    const test = createDependencies();
    const result = await synchronizeCloudBatch(test.dependencies, { batchSize: 2 });

    expect(result.skipped).toBe(1);
    expect(result.processed).toBe(0);
    expect(test.uploads).toEqual([]);
    expect(test.successes).toEqual([]);
    expect(test.failures).toEqual(["budget-2"]);
  });

  it("returns a continuation cursor for work beyond the current batch", async () => {
    const test = createDependencies();
    const result = await synchronizeCloudBatch(test.dependencies, { cursor: 0, batchSize: 1 });

    expect(result.nextCursor).toBe(1);
    expect(result.remaining).toBe(1);
    expect(result.spreadsheetUpdated).toBe(true);
  });

  it("creates a new provider file and records its external reference", async () => {
    const test = createDependencies({ skipBudgetOne: false, failBudgetTwo: false });
    const result = await synchronizeCloudBatch(test.dependencies, { batchSize: 1 });

    expect(result.processed).toBe(1);
    expect(test.uploads).toEqual(["presupuesto-1.pdf"]);
    expect(test.successes).toEqual(["budget-1"]);
  });

  it("keeps failed documents retryable", async () => {
    const test = createDependencies({ skipBudgetOne: false });
    const result = await synchronizeCloudBatch(test.dependencies, { cursor: 1, batchSize: 1 });

    expect(result.failures).toEqual([
      { documentType: "budget", documentId: "budget-2", message: "render failed" }
    ]);
    expect(test.failures).toEqual(["budget-2"]);
  });

  it("uses the shared destination reference for state lookups", async () => {
    const test = createDependencies({ skipBudgetOne: false, failBudgetTwo: false });
    await synchronizeCloudBatch(test.dependencies, { batchSize: 1 });

    expect(test.destinationReferences).toEqual(["shared-folder"]);
  });
});
