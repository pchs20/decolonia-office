import {
  CommercialDocumentPricingDefaults,
  CommercialDocumentSettingsRepository
} from "@/application/outbound/commercial-document-settings-repository";
import { ensureDatabaseReady, getDbPool } from "@/infrastructure/persistence/postgres/db";
import { PricingMode } from "@/domain/value-objects/pricing-mode";
import { DocumentSequence } from "@/domain/entities/document-sequence";
import { DocumentType } from "@/domain/value-objects/document-enums";

type SettingsRow = {
  id: string;
  default_budget_pricing_mode: PricingMode;
  default_invoice_pricing_mode: PricingMode;
  default_budget_next_number: string | number;
  invoice_next_numbers: Record<string, number> | null;
  updated_at: Date;
};

function normalizeInvoiceNumbers(value: SettingsRow["invoice_next_numbers"]): Record<string, number> {
  if (!value || typeof value !== "object") {
    return {};
  }

  const normalized: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value)) {
    const num = Number(raw);
    if (Number.isInteger(num) && num > 0) {
      normalized[key] = num;
    }
  }
  return normalized;
}

async function ensureSettingsRow(): Promise<void> {
  await ensureDatabaseReady();
  await getDbPool().query(
    `
      INSERT INTO commercial_document_settings (
        default_budget_pricing_mode,
        default_invoice_pricing_mode,
        default_budget_next_number,
        invoice_next_numbers
      )
      SELECT 'computed', 'computed', 1, '{}'::jsonb
      WHERE NOT EXISTS (SELECT 1 FROM commercial_document_settings)
    `
  );
}

async function getSettingsRowForRead(): Promise<SettingsRow> {
  await ensureSettingsRow();
  const result = await getDbPool().query<SettingsRow>(
    `
      SELECT
        id,
        default_budget_pricing_mode,
        default_invoice_pricing_mode,
        default_budget_next_number,
        invoice_next_numbers,
        updated_at
      FROM commercial_document_settings
      ORDER BY created_at ASC
      LIMIT 1
    `
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error("Failed to load commercial document settings");
  }
  return row;
}

async function getDefaultPricingModes(): Promise<CommercialDocumentPricingDefaults> {
  const row = await getSettingsRowForRead();

  return {
    budget: row.default_budget_pricing_mode,
    invoice: row.default_invoice_pricing_mode
  };
}

async function setDefaultPricingModes(
  modes: CommercialDocumentPricingDefaults
): Promise<CommercialDocumentPricingDefaults> {
  await ensureSettingsRow();
  const result = await getDbPool().query<{
    default_budget_pricing_mode: PricingMode;
    default_invoice_pricing_mode: PricingMode;
  }>(
    `
      UPDATE commercial_document_settings
      SET default_budget_pricing_mode = $1,
          default_invoice_pricing_mode = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = (
        SELECT id
        FROM commercial_document_settings
        ORDER BY created_at ASC
        LIMIT 1
      )
      RETURNING default_budget_pricing_mode, default_invoice_pricing_mode
    `,
    [modes.budget, modes.invoice]
  );

  return {
    budget: result.rows[0]?.default_budget_pricing_mode ?? modes.budget,
    invoice: result.rows[0]?.default_invoice_pricing_mode ?? modes.invoice
  };
}

async function getSequence(
  documentType: DocumentType,
  scopeYear: number | null
): Promise<DocumentSequence> {
  const row = await getSettingsRowForRead();

  if (documentType === "budget") {
    return {
      id: `${row.id}:budget:null`,
      documentType,
      scopeYear: null,
      nextNumber: Number(row.default_budget_next_number),
      updatedAt: row.updated_at
    };
  }

  if (scopeYear === null) {
    throw new Error("scopeYear is required for invoice sequence");
  }

  const invoiceNumbers = normalizeInvoiceNumbers(row.invoice_next_numbers);
  const nextNumber = invoiceNumbers[String(scopeYear)] ?? 1;

  return {
    id: `${row.id}:invoice:${scopeYear}`,
    documentType,
    scopeYear,
    nextNumber,
    updatedAt: row.updated_at
  };
}

async function allocateNumber(
  documentType: DocumentType,
  scopeYear: number | null
): Promise<number> {
  await ensureDatabaseReady();
  const pool = getDbPool();

  try {
    await pool.query("BEGIN");

    await pool.query(
      `
        INSERT INTO commercial_document_settings (
          default_budget_pricing_mode,
          default_invoice_pricing_mode,
          default_budget_next_number,
          invoice_next_numbers
        )
        SELECT 'computed', 'computed', 1, '{}'::jsonb
        WHERE NOT EXISTS (SELECT 1 FROM commercial_document_settings)
      `,
      []
    );

    const rowResult = await pool.query<SettingsRow>(
      `
        SELECT
          id,
          default_budget_pricing_mode,
          default_invoice_pricing_mode,
          default_budget_next_number,
          invoice_next_numbers,
          updated_at
        FROM commercial_document_settings
        ORDER BY created_at ASC
        LIMIT 1
        FOR UPDATE
      `
    );

    const row = rowResult.rows[0];
    if (!row) {
      throw new Error("Failed to lock commercial document settings for allocation");
    }

    let allocatedNumber = 1;
    if (documentType === "budget") {
      allocatedNumber = Number(row.default_budget_next_number);
      await pool.query(
        `
          UPDATE commercial_document_settings
          SET default_budget_next_number = default_budget_next_number + 1,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
        `,
        [row.id]
      );
    } else {
      if (scopeYear === null) {
        throw new Error("scopeYear is required for invoice sequence");
      }
      const invoiceNumbers = normalizeInvoiceNumbers(row.invoice_next_numbers);
      const yearKey = String(scopeYear);
      allocatedNumber = invoiceNumbers[yearKey] ?? 1;
      invoiceNumbers[yearKey] = allocatedNumber + 1;

      await pool.query(
        `
          UPDATE commercial_document_settings
          SET invoice_next_numbers = $1::jsonb,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
        `,
        [JSON.stringify(invoiceNumbers), row.id]
      );
    }

    await pool.query("COMMIT");
    return allocatedNumber;
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

async function adjustSequence(
  documentType: DocumentType,
  scopeYear: number | null,
  nextNumber: number
): Promise<DocumentSequence> {
  await ensureDatabaseReady();
  const pool = getDbPool();

  if (!Number.isInteger(nextNumber) || nextNumber < 1) {
    throw new Error("nextNumber must be an integer greater than 0");
  }

  await ensureSettingsRow();
  const row = await getSettingsRowForRead();

  if (documentType === "budget") {
    await pool.query(
      `
        UPDATE commercial_document_settings
        SET default_budget_next_number = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `,
      [nextNumber, row.id]
    );
    return getSequence("budget", null);
  }

  if (scopeYear === null) {
    throw new Error("scopeYear is required for invoice sequence");
  }

  const invoiceNumbers = normalizeInvoiceNumbers(row.invoice_next_numbers);
  invoiceNumbers[String(scopeYear)] = nextNumber;

  await pool.query(
    `
      UPDATE commercial_document_settings
      SET invoice_next_numbers = $1::jsonb,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `,
    [JSON.stringify(invoiceNumbers), row.id]
  );

  return getSequence("invoice", scopeYear);
}

export const postgresCommercialDocumentSettingsRepository: CommercialDocumentSettingsRepository = {
  getDefaultPricingModes,
  setDefaultPricingModes,
  getSequence,
  allocateNumber,
  adjustSequence
};
