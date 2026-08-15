import { randomUUID } from "node:crypto";

export interface ClientImportRow {
  name: string;
  type: "individual" | "company";
  street: string;
  city: string;
  postalCode: string;
  billingStreet: string;
  billingCity: string;
  billingPostalCode: string;
  taxId: string;
  phone: string;
  email: string;
  sourceFiles: string;
  rowNumber: number;
}

export interface ValidatedClientRow extends ClientImportRow {
  normalizedTaxId: string;
}

export interface ImportIssue {
  rowNumber: number;
  sourceFiles: string;
  reason: string;
}

export interface ImportPlan {
  eligible: ValidatedClientRow[];
  invalid: ImportIssue[];
  duplicateCsv: ImportIssue[];
}

export interface ImportReport {
  inserted: Array<{ rowNumber: number; taxId: string; id?: string }>;
  skipped: ImportIssue[];
  invalid: ImportIssue[];
  failed: ImportIssue[];
}

export interface ImportQueryResult<Row> {
  rows: Row[];
  rowCount?: number;
}

export interface ImportDatabaseClient {
  query<Row = Record<string, unknown>>(sql: string, values?: unknown[]): Promise<ImportQueryResult<Row>>;
  release(): void;
}

export interface ImportDatabasePool {
  query<Row = Record<string, unknown>>(sql: string, values?: unknown[]): Promise<ImportQueryResult<Row>>;
  connect(): Promise<ImportDatabaseClient>;
}

export const CLIENT_IMPORT_COLUMNS = [
  "name",
  "type",
  "street",
  "city",
  "postalCode",
  "billingStreet",
  "billingCity",
  "billingPostalCode",
  "taxId",
  "phone",
  "email",
  "sourceFiles"
] as const;

function clean(value: string | undefined): string {
  return (value ?? "").trim();
}

export function normalizeTaxId(value: string): string {
  return clean(value).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function parseCsv(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    const nextCharacter = content[index + 1];

    if (quoted) {
      if (character === '"' && nextCharacter === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        cell += character;
      }
      continue;
    }

    if (character === '"' && cell.length === 0) {
      quoted = true;
    } else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  if (quoted) throw new Error("Malformed CSV: unterminated quoted field");
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function rowFromValues(headers: string[], values: string[], rowNumber: number): ClientImportRow {
  const data = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  return {
    name: clean(data.name),
    type: clean(data.type) as ClientImportRow["type"],
    street: clean(data.street),
    city: clean(data.city),
    postalCode: clean(data.postalCode),
    billingStreet: clean(data.billingStreet),
    billingCity: clean(data.billingCity),
    billingPostalCode: clean(data.billingPostalCode),
    taxId: clean(data.taxId),
    phone: clean(data.phone),
    email: clean(data.email),
    sourceFiles: clean(data.sourceFiles),
    rowNumber
  };
}

export function parseClientCsv(content: string): ClientImportRow[] {
  const rows = parseCsv(content);
  const headers = rows.shift() ?? [];
  const missingHeaders = CLIENT_IMPORT_COLUMNS.filter((column) => !headers.includes(column));
  if (missingHeaders.length > 0) {
    throw new Error(`CSV is missing required columns: ${missingHeaders.join(", ")}`);
  }

  return rows.map((values, index) => rowFromValues(headers, values, index + 2));
}

export function validateClientRow(row: ClientImportRow): ValidatedClientRow | ImportIssue {
  const billingStreet = row.billingStreet || row.street;
  const billingCity = row.billingCity || row.city;
  const billingPostalCode = row.billingPostalCode || row.postalCode;
  const normalizedTaxId = normalizeTaxId(row.taxId);
  const reasons: string[] = [];

  if (!row.name) reasons.push("name-missing");
  if (row.type !== "individual" && row.type !== "company") reasons.push("type-invalid");
  if (!row.street) reasons.push("street-missing");
  if (!row.city) reasons.push("city-missing");
  if (!row.postalCode) reasons.push("postal-code-missing");
  if (!billingStreet || !billingCity || !billingPostalCode) reasons.push("billing-address-incomplete");
  if (!normalizedTaxId) reasons.push("tax-id-missing");
  if (row.phone && row.phone.length < 6) reasons.push("phone-invalid");
  if (row.email && !isValidEmail(row.email)) reasons.push("email-invalid");

  if (reasons.length > 0) {
    return { rowNumber: row.rowNumber, sourceFiles: row.sourceFiles, reason: reasons.join("; ") };
  }

  return { ...row, billingStreet, billingCity, billingPostalCode, normalizedTaxId };
}

export function buildImportPlan(rows: ClientImportRow[]): ImportPlan {
  const eligible: ValidatedClientRow[] = [];
  const invalid: ImportIssue[] = [];
  const duplicateCsv: ImportIssue[] = [];
  const seenTaxIds = new Set<string>();

  for (const row of rows) {
    const validated = validateClientRow(row);
    if ("reason" in validated) {
      invalid.push(validated);
      continue;
    }

    if (seenTaxIds.has(validated.normalizedTaxId)) {
      duplicateCsv.push({
        rowNumber: row.rowNumber,
        sourceFiles: row.sourceFiles,
        reason: "duplicate-tax-id-in-csv"
      });
      continue;
    }

    seenTaxIds.add(validated.normalizedTaxId);
    eligible.push(validated);
  }

  return { eligible, invalid, duplicateCsv };
}

export function createReport(plan: ImportPlan): ImportReport {
  return {
    inserted: [],
    skipped: plan.duplicateCsv,
    invalid: plan.invalid,
    failed: []
  };
}

export function formatReport(report: ImportReport): string {
  const lines = [
    `Inserted: ${report.inserted.length}`,
    `Skipped: ${report.skipped.length}`,
    `Invalid: ${report.invalid.length}`,
    `Failed: ${report.failed.length}`
  ];
  for (const issue of [...report.skipped, ...report.invalid, ...report.failed]) {
    lines.push(`Row ${issue.rowNumber}: ${issue.reason}${issue.sourceFiles ? ` (${issue.sourceFiles})` : ""}`);
  }
  return lines.join("\n");
}

export async function getExistingTaxIds(pool: ImportDatabasePool): Promise<Set<string>> {
  const result = await pool.query<{ tax_id: string }>("SELECT tax_id FROM clients WHERE tax_id IS NOT NULL");
  return new Set(result.rows.map((row) => normalizeTaxId(row.tax_id)));
}

export async function executeImport(
  pool: ImportDatabasePool,
  plan: ImportPlan,
  write: boolean
): Promise<ImportReport> {
  const report = createReport(plan);
  const existingTaxIds = await getExistingTaxIds(pool);
  const pendingRows: ValidatedClientRow[] = [];

  for (const row of plan.eligible) {
    if (existingTaxIds.has(row.normalizedTaxId)) {
      report.skipped.push({
        rowNumber: row.rowNumber,
        sourceFiles: row.sourceFiles,
        reason: "duplicate-tax-id-in-database"
      });
    } else {
      pendingRows.push(row);
    }
  }

  report.skipped.sort((left, right) => left.rowNumber - right.rowNumber);
  if (!write || pendingRows.length === 0) return report;

  const transaction = await pool.connect();
  try {
    await transaction.query("BEGIN");
    for (const row of pendingRows) {
      const id = randomUUID();
      const timestamp = new Date();
      await transaction.query(
        `
          INSERT INTO clients (
            id, name, type, street, city, postal_code,
            billing_street, billing_city, billing_postal_code,
            tax_id, phone, email, is_active, created_at, updated_at
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true, $13, $13)
        `,
        [
          id,
          row.name,
          row.type,
          row.street,
          row.city,
          row.postalCode,
          row.billingStreet,
          row.billingCity,
          row.billingPostalCode,
          row.taxId,
          row.phone || null,
          row.email || null,
          timestamp
        ]
      );
      report.inserted.push({ rowNumber: row.rowNumber, taxId: row.taxId, id });
    }
    await transaction.query("COMMIT");
  } catch (error) {
    await transaction.query("ROLLBACK");
    report.failed = pendingRows.map((row) => ({
      rowNumber: row.rowNumber,
      sourceFiles: row.sourceFiles,
      reason: error instanceof Error ? error.message : "database-write-failed"
    }));
    report.inserted = [];
  } finally {
    transaction.release();
  }

  report.failed.sort((left, right) => left.rowNumber - right.rowNumber);
  return report;
}