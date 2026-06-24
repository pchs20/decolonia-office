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
  },
  {
    id: "1718394700000",
    name: "CreateBudgetsTable",
    sql: readMigrationSql("1718394700000-CreateBudgetsTable.sql")
  },
  {
    id: "1718394800000",
    name: "CreateInvoicesTable",
    sql: readMigrationSql("1718394800000-CreateInvoicesTable.sql")
  },
  {
    id: "1718394900000",
    name: "CreateJobItemsTable",
    sql: readMigrationSql("1718394900000-CreateJobItemsTable.sql")
  },
  {
    id: "1718395000000",
    name: "CreateTaxesTable",
    sql: readMigrationSql("1718395000000-CreateTaxesTable.sql")
  },
  {
    id: "1718395100000",
    name: "CreateWorkTemplatesTable",
    sql: readMigrationSql("1718395100000-CreateWorkTemplatesTable.sql")
  },
  {
    id: "1718395200000",
    name: "CreateDocumentSequencesTable",
    sql: readMigrationSql("1718395200000-CreateDocumentSequencesTable.sql")
  },
  {
    id: "1718395300000",
    name: "AddPricingModesAndCommercialDocumentSettings",
    sql: readMigrationSql("1718395300000-AddPricingModesAndCommercialDocumentSettings.sql")
  },
  {
    id: "1718395400000",
    name: "PerDocumentTypePricingDefaults",
    sql: readMigrationSql("1718395400000-PerDocumentTypePricingDefaults.sql")
  },
  {
    id: "1718395450000",
    name: "RenameTaxDefinitionsToTaxes",
    sql: readMigrationSql("1718395450000-RenameTaxDefinitionsToTaxes.sql")
  },
  {
    id: "1718395500000",
    name: "MergeDocumentSequencesIntoCommercialDocumentSettings",
    sql: readMigrationSql("1718395500000-MergeDocumentSequencesIntoCommercialDocumentSettings.sql")
  }
];