import { Pool } from "pg";
import { runPendingMigrations } from "@/infrastructure/persistence/postgres/migrations/runner";

let pool: Pool | null = null;
let migrationInitPromise: Promise<void> | null = null;

function shouldAutoRunMigrations(connectionString: string): boolean {
  if (process.env.AUTO_RUN_MIGRATIONS === "true") {
    return true;
  }

  if (process.env.AUTO_RUN_MIGRATIONS === "false") {
    return false;
  }

  const isLocalConnection =
    connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

  return isLocalConnection && !process.env.VERCEL;
}

export function getDbPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is not set");
    }

    const isLocal =
    connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

    pool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false }
    });
  }

  return pool;
}

export async function ensureDatabaseReady(): Promise<void> {
  const activePool = getDbPool();
  const connectionString = process.env.DATABASE_URL ?? "";

  if (!shouldAutoRunMigrations(connectionString)) {
    return;
  }

  if (!migrationInitPromise) {
    migrationInitPromise = runPendingMigrations(activePool);
  }

  await migrationInitPromise;
}
