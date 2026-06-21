import { readFileSync } from "fs";
import { join } from "path";

export type SqlMigration = {
  id: string;
  name: string;
  sql: string;
};

function readMigrationSql(fileName: string): string {
  const filePath = join(
    process.cwd(),
    "src/infrastructure/persistence/postgres/migrations",
    fileName
  );

  return readFileSync(filePath, "utf8");
}

export const SQL_MIGRATIONS: SqlMigration[] = [
  {
    id: "1718394400000",
    name: "CreateClientsTable",
    sql: readMigrationSql("1718394400000-CreateClientsTable.sql")
  },
  {
    id: "1718394500000",
    name: "AddStructuredAddressFieldsToClients",
    sql: readMigrationSql("1718394500000-AddStructuredAddressFieldsToClients.sql")
  },
  {
    id: "1718394600000",
    name: "CreateWorkersTable",
    sql: readMigrationSql("1718394600000-CreateWorkersTable.sql")
  }
];