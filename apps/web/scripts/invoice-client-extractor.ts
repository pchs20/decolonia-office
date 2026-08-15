import fs from "node:fs";
import path from "node:path";
import XLSX from "xlsx";

export type ClientType = "individual" | "company";

export interface ExtractedClientFields {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  taxId: string;
  originalName: string;
  originalStreet: string;
  originalCity: string;
  originalTaxId: string;
}

export interface ClientCandidate extends ExtractedClientFields {
  type: ClientType | "";
  typeReason: string;
  sourceFiles: string[];
  reviewReasons: string[];
}

export interface ReviewRecord {
  sourceFiles: string[];
  name: string;
  street: string;
  city: string;
  postalCode: string;
  taxId: string;
  type: string;
  reviewReasons: string[];
  originalName: string;
  originalStreet: string;
  originalCity: string;
  originalTaxId: string;
}

export interface ExtractionResult {
  candidates: ClientCandidate[];
  importReady: ClientCandidate[];
  review: ReviewRecord[];
}

const LABEL_ALIASES: Record<string, string> = {
  nombre: "name",
  direccion: "street",
  ciudad: "city",
  cif: "taxId",
  vat: "taxId"
};

const COMPANY_INDICATORS = [
  /s\.?\s*l\.?\s*u?\.?/i,
  /\bs\.?a\.?\b/i,
  /\bc\.?b\.?\b/i,
  /fundaci[oó]/i,
  /comunitat/i,
  /construccions/i
];

function asText(value: unknown): string {
  return value === null || value === undefined ? "" : String(value);
}

function cleanWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function labelKey(value: string): string {
  return cleanWhitespace(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[.:]/g, "")
    .trim();
}

export function normalizeTaxId(value: string): string {
  return cleanWhitespace(value).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function parseCityPostal(value: string): {
  city: string;
  postalCode: string;
  issue?: string;
} {
  const original = cleanWhitespace(value);
  const match = original.match(/\b(\d{5})\b/);

  if (!match) {
    return { city: original, postalCode: "", issue: "postal-code-unparsed" };
  }

  const city = cleanWhitespace(
    original
      .replace(/\bC\.?\s*P\.?\s*/i, " ")
      .replace(match[1], " ")
  );

  if (!city) {
    return { city: "", postalCode: match[1], issue: "city-unparsed" };
  }

  return { city, postalCode: match[1] };
}

export function classifyClient(name: string): {
  type: ClientType | "";
  reason: string;
  issue?: string;
} {
  const normalizedName = cleanWhitespace(name);
  if (COMPANY_INDICATORS.some((indicator) => indicator.test(normalizedName))) {
    return { type: "company", reason: "organization-indicator" };
  }

  const words = normalizedName.split(" ").filter(Boolean);
  if (words.length >= 2 && words.every((word) => /^[\p{L}'-]+$/u.test(word))) {
    return { type: "individual", reason: "personal-name-pattern" };
  }

  return { type: "", reason: "classification-ambiguous", issue: "type-ambiguous" };
}

function extractLabeledFields(rows: unknown[][]): Record<string, string> {
  const fields: Record<string, string> = {};

  for (const row of rows) {
    for (let index = 0; index < row.length - 1; index += 1) {
      const field = LABEL_ALIASES[labelKey(asText(row[index]))];
      if (!field) continue;

      const value = cleanWhitespace(asText(row[index + 1]));
      if (value) fields[field] = value;
    }
  }

  return fields;
}

export function extractWorkbook(filePath: string): ClientCandidate | ReviewRecord {
  const workbook = XLSX.readFile(filePath, { raw: false });
  const sheetName = workbook.SheetNames[0];
  const rows = sheetName
    ? (XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: "" }) as unknown[][])
    : [];
  const fields = extractLabeledFields(rows);
  const originalName = fields.name ?? "";
  const originalStreet = fields.street ?? "";
  const originalCity = fields.city ?? "";
  const originalTaxId = fields.taxId ?? "";
  const parsedAddress = parseCityPostal(originalCity);
  const classification = classifyClient(originalName);
  const reviewReasons = [
    ...(parsedAddress.issue ? [parsedAddress.issue] : []),
    ...(classification.issue ? [classification.issue] : []),
    ...(!originalName ? ["name-missing"] : []),
    ...(!originalStreet ? ["street-missing"] : []),
    ...(!normalizeTaxId(originalTaxId) ? ["tax-id-missing"] : [])
  ];

  if (!originalName && !originalStreet && !originalCity && !originalTaxId) {
    return {
      sourceFiles: [path.basename(filePath)],
      name: "",
      street: "",
      city: "",
      postalCode: "",
      taxId: "",
      type: "",
      reviewReasons: ["client-block-not-found"],
      originalName,
      originalStreet,
      originalCity,
      originalTaxId
    };
  }

  return {
    name: cleanWhitespace(originalName),
    street: cleanWhitespace(originalStreet),
    city: parsedAddress.city,
    postalCode: parsedAddress.postalCode,
    taxId: normalizeTaxId(originalTaxId),
    type: classification.type,
    typeReason: classification.reason,
    sourceFiles: [path.basename(filePath)],
    reviewReasons,
    originalName,
    originalStreet,
    originalCity,
    originalTaxId
  };
}

export function identityKey(candidate: ExtractedClientFields): string {
  if (candidate.taxId) return `tax:${candidate.taxId}`;
  return [candidate.name, candidate.street, candidate.city, candidate.postalCode]
    .map((value) => cleanWhitespace(value).toLocaleLowerCase())
    .join("|");
}

function mergeCandidates(left: ClientCandidate, right: ClientCandidate): ClientCandidate {
  return {
    ...left,
    sourceFiles: [...new Set([...left.sourceFiles, ...right.sourceFiles])].sort(),
    reviewReasons: [...new Set([...left.reviewReasons, ...right.reviewReasons])].sort()
  };
}

export function deduplicateCandidates(records: Array<ClientCandidate | ReviewRecord>): {
  candidates: ClientCandidate[];
  review: ReviewRecord[];
} {
  const candidatesByKey = new Map<string, ClientCandidate>();
  const reviewRecords: ReviewRecord[] = [];

  for (const record of records) {
    if (!("typeReason" in record)) {
      reviewRecords.push(record);
      continue;
    }

    const key = identityKey(record);
    const existing = candidatesByKey.get(key);
    candidatesByKey.set(key, existing ? mergeCandidates(existing, record) : record);
  }

  const candidates = [...candidatesByKey.values()].sort((left, right) =>
    identityKey(left).localeCompare(identityKey(right))
  );

  for (const candidate of candidates) {
    if (candidate.reviewReasons.length > 0) {
      reviewRecords.push({ ...candidate });
    }
  }

  reviewRecords.sort((left, right) => left.sourceFiles.join(",").localeCompare(right.sourceFiles.join(",")));
  return { candidates, review: reviewRecords };
}

export function extractDirectory(inputDirectory: string): ExtractionResult {
  const files = fs
    .readdirSync(inputDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".xlsx"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
  const records = files.map((file) => extractWorkbook(path.join(inputDirectory, file)));
  const { candidates, review } = deduplicateCandidates(records);
  return {
    candidates,
    importReady: candidates.filter((candidate) => candidate.reviewReasons.length === 0),
    review
  };
}

export const CLIENT_CSV_COLUMNS = [
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

export const REVIEW_CSV_COLUMNS = [
  "sourceFiles",
  "name",
  "type",
  "typeReason",
  "street",
  "city",
  "postalCode",
  "taxId",
  "reviewReasons",
  "originalName",
  "originalStreet",
  "originalCity",
  "originalTaxId"
] as const;

function csvCell(value: unknown): string {
  const text = Array.isArray(value) ? value.join("; ") : asText(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv<T extends Record<string, unknown>>(columns: readonly string[], rows: T[]): string {
  return [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(","))
  ].join("\n") + "\n";
}

export function clientRows(candidates: ClientCandidate[]): Record<string, unknown>[] {
  return candidates.map((candidate) => ({
    name: candidate.name,
    type: candidate.type,
    street: candidate.street,
    city: candidate.city,
    postalCode: candidate.postalCode,
    billingStreet: candidate.street,
    billingCity: candidate.city,
    billingPostalCode: candidate.postalCode,
    taxId: candidate.taxId,
    phone: "",
    email: "",
    sourceFiles: candidate.sourceFiles
  }));
}

export function reviewRows(review: ReviewRecord[]): Record<string, unknown>[] {
  return review.map((record) => record as unknown as Record<string, unknown>);
}
