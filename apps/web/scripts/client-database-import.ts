import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import {
  buildImportPlan,
  executeImport,
  formatReport,
  parseClientCsv
// @ts-ignore The native Node type-stripping runner requires the runtime extension.
} from "./client-database-importer.ts";
import type { ImportDatabasePool } from "./client-database-importer.ts";

function usage(): void {
  console.error("Usage: pnpm clients:import -- <clients.csv> [--write]");
}

function loadLocalEnv(): void {
  const candidatePaths = [
    path.resolve(process.cwd(), "../../.env"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../.env")
  ];
  const envPath = candidatePaths.find((candidatePath) => fs.existsSync(candidatePath));
  if (!envPath) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;

    const value = match[2].trim();
    process.env[match[1]] = value.replace(/^(['"])(.*)\1$/, "$2");
  }
}

function main(): void {
  loadLocalEnv();
  const argumentsList = process.argv.slice(2).filter((argument) => argument !== "--");
  const write = argumentsList.includes("--write");
  const inputPath = argumentsList.find((argument) => !argument.startsWith("--"));

  if (!inputPath) {
    usage();
    process.exitCode = 1;
    return;
  }

  if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isFile()) {
    throw new Error(`CSV file does not exist: ${inputPath}`);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false }
  });

  runImport(pool as ImportDatabasePool, inputPath, write).finally(() => pool.end());
}

async function runImport(pool: ImportDatabasePool, inputPath: string, write: boolean): Promise<void> {
  const rows = parseClientCsv(fs.readFileSync(path.resolve(inputPath), "utf8"));
  const plan = buildImportPlan(rows);
  const report = await executeImport(pool, plan, write);
  console.log(`${write ? "Write" : "Dry-run"} completed for ${rows.length} CSV rows.`);
  console.log(formatReport(report));
  if (report.failed.length > 0) process.exitCode = 1;
}

main();