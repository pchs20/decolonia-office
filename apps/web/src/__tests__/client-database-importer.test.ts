import {
  buildImportPlan,
  executeImport,
  formatReport,
  ImportDatabaseClient,
  ImportDatabasePool,
  normalizeTaxId,
  parseClientCsv,
  parseCsv,
  validateClientRow
} from "../../scripts/client-database-importer";

const csv = [
  "name,type,street,city,postalCode,billingStreet,billingCity,billingPostalCode,taxId,phone,email,sourceFiles",
  '"Client, One",individual,Street,City,08001,,,,"ab 123",,,client.xlsx',
  "Company,company,Other Street,Other City,08002,,,,C-456,,,company.xlsx"
].join("\n");

describe("client database importer core", () => {
  it("parses quoted CSV cells and maps import columns", () => {
    expect(parseClientCsv(csv)[0]).toMatchObject({
      name: "Client, One",
      taxId: "ab 123",
      rowNumber: 2
    });
  });

  it("supports quoted newlines and rejects unterminated fields", () => {
    expect(parseCsv('name\n"line one\nline two"')[1]).toEqual(["line one\nline two"]);
    expect(() => parseCsv('name\n"broken')).toThrow("unterminated");
  });

  it("normalizes tax ids and copies work address into missing billing fields", () => {
    const row = parseClientCsv(csv)[0];
    const result = validateClientRow(row);
    expect(normalizeTaxId(" ab-123 ")).toBe("AB123");
    expect(result).toMatchObject({
      billingStreet: "Street",
      billingCity: "City",
      billingPostalCode: "08001",
      normalizedTaxId: "AB123"
    });
  });

  it("reports invalid rows and duplicate tax ids deterministically", () => {
    const rows = parseClientCsv(`${csv}\nInvalid,wrong,,,,,,,,,,invalid.xlsx`);
    const plan = buildImportPlan(rows);
    expect(plan.eligible).toHaveLength(2);
    expect(plan.duplicateCsv).toHaveLength(0);
    expect(plan.invalid[0]?.reason).toContain("type-invalid");

    const duplicatePlan = buildImportPlan([...rows, { ...rows[0], rowNumber: 5 }]);
    expect(duplicatePlan.duplicateCsv[0]?.reason).toBe("duplicate-tax-id-in-csv");
    expect(formatReport({ inserted: [], skipped: duplicatePlan.duplicateCsv, invalid: [], failed: [] })).toContain(
      "Skipped: 1"
    );
  });

  it("does not connect for dry-run and skips existing database tax ids", async () => {
    const clientRows = parseClientCsv(csv);
    const plan = buildImportPlan(clientRows);
    let connectCalls = 0;
    const pool: ImportDatabasePool = {
      async query<Row>() {
        return { rows: [{ tax_id: "AB-123" }] as Row[] };
      },
      async connect() {
        connectCalls += 1;
        throw new Error("dry-run must not connect");
      }
    };

    const report = await executeImport(pool, plan, false);

    expect(connectCalls).toBe(0);
    expect(report.inserted).toEqual([]);
    expect(report.skipped).toEqual([
      { rowNumber: 2, sourceFiles: "client.xlsx", reason: "duplicate-tax-id-in-database" }
    ]);
  });

  it("commits new rows and rolls back when an insert fails", async () => {
    const clientRows = parseClientCsv(csv);
    const plan = buildImportPlan(clientRows);
    const queryLog: string[] = [];
    const transaction: ImportDatabaseClient = {
      async query<Row>(sql: string) {
        queryLog.push(sql.trim());
        if (sql.includes("INSERT")) return { rows: [] as Row[] };
        return { rows: [] as Row[] };
      },
      release() {}
    };
    const pool: ImportDatabasePool = {
      async query<Row>() {
        return { rows: [] as Row[] };
      },
      async connect() {
        return transaction;
      }
    };

    const report = await executeImport(pool, plan, true);

    expect(report.inserted).toHaveLength(2);
    expect(queryLog).toEqual(expect.arrayContaining(["BEGIN", "COMMIT"]));
  });

  it("reports rollback and no inserted rows after a database failure", async () => {
    const plan = buildImportPlan(parseClientCsv(csv));
    const queryLog: string[] = [];
    const transaction: ImportDatabaseClient = {
      async query<Row>(sql: string) {
        queryLog.push(sql.trim());
        if (sql.includes("INSERT")) throw new Error("insert failed");
        return { rows: [] as Row[] };
      },
      release() {}
    };
    const pool: ImportDatabasePool = {
      async query<Row>() {
        return { rows: [] as Row[] };
      },
      async connect() {
        return transaction;
      }
    };

    const report = await executeImport(pool, plan, true);

    expect(report.inserted).toEqual([]);
    expect(report.failed).toHaveLength(2);
    expect(queryLog).toEqual(expect.arrayContaining(["BEGIN", "ROLLBACK"]));
  });
});