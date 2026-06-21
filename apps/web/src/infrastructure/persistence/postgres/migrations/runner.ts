import { Pool } from "pg";
import { SQL_MIGRATIONS } from "@/infrastructure/persistence/postgres/migrations/migration-definitions";

async function ensureMigrationsTable(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id VARCHAR(32) PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrationIds(pool: Pool): Promise<Set<string>> {
  const result = await pool.query<{ id: string }>("SELECT id FROM schema_migrations");
  return new Set(result.rows.map(row => row.id));
}

export async function runPendingMigrations(pool: Pool): Promise<void> {
  await ensureMigrationsTable(pool);
  const appliedIds = await getAppliedMigrationIds(pool);

  for (const migration of SQL_MIGRATIONS) {
    if (appliedIds.has(migration.id)) {
      continue;
    }

    await pool.query("BEGIN");
    try {
      await pool.query(migration.sql);
      await pool.query(
        "INSERT INTO schema_migrations (id, name) VALUES ($1, $2)",
        [migration.id, migration.name]
      );
      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }
}