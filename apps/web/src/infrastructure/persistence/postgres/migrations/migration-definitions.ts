import createClientsTable from "./1718394400000-CreateClientsTable.sql";
import addStructuredAddressFieldsToClients from "./1718394500000-AddStructuredAddressFieldsToClients.sql";
import createWorkersTable from "./1718394600000-CreateWorkersTable.sql";
import createBudgetsTable from "./1718394700000-CreateBudgetsTable.sql";
import createInvoicesTable from "./1718394800000-CreateInvoicesTable.sql";
import createJobItemsTable from "./1718394900000-CreateJobItemsTable.sql";
import createTaxesTable from "./1718395000000-CreateTaxesTable.sql";
import createWorkTemplatesTable from "./1718395100000-CreateWorkTemplatesTable.sql";
import createDocumentSequencesTable from "./1718395200000-CreateDocumentSequencesTable.sql";
import addPricingModesAndCommercialDocumentSettings from "./1718395300000-AddPricingModesAndCommercialDocumentSettings.sql";
import perDocumentTypePricingDefaults from "./1718395400000-PerDocumentTypePricingDefaults.sql";
import renameTaxDefinitionsToTaxes from "./1718395450000-RenameTaxDefinitionsToTaxes.sql";
import mergeDocumentSequencesIntoCommercialDocumentSettings from "./1718395500000-MergeDocumentSequencesIntoCommercialDocumentSettings.sql";
import addBankAccountToWorkers from "./1719316800000-AddBankAccountToWorkers.sql";
import addWorkerSnapshotBankAccountToBudgets from "./1719316801000-AddWorkerSnapshotBankAccountToBudgets.sql";
import addWorkerSnapshotBankAccountToInvoices from "./1719316802000-AddWorkerSnapshotBankAccountToInvoices.sql";

export type SqlMigration = {
  id: string;
  name: string;
  sql: string;
};

export const SQL_MIGRATIONS: SqlMigration[] = [
  {
    id: "1718394400000",
    name: "CreateClientsTable",
    sql: createClientsTable
  },
  {
    id: "1718394500000",
    name: "AddStructuredAddressFieldsToClients",
    sql: addStructuredAddressFieldsToClients
  },
  {
    id: "1718394600000",
    name: "CreateWorkersTable",
    sql: createWorkersTable
  },
  {
    id: "1718394700000",
    name: "CreateBudgetsTable",
    sql: createBudgetsTable
  },
  {
    id: "1718394800000",
    name: "CreateInvoicesTable",
    sql: createInvoicesTable
  },
  {
    id: "1718394900000",
    name: "CreateJobItemsTable",
    sql: createJobItemsTable
  },
  {
    id: "1718395000000",
    name: "CreateTaxesTable",
    sql: createTaxesTable
  },
  {
    id: "1718395100000",
    name: "CreateWorkTemplatesTable",
    sql: createWorkTemplatesTable
  },
  {
    id: "1718395200000",
    name: "CreateDocumentSequencesTable",
    sql: createDocumentSequencesTable
  },
  {
    id: "1718395300000",
    name: "AddPricingModesAndCommercialDocumentSettings",
    sql: addPricingModesAndCommercialDocumentSettings
  },
  {
    id: "1718395400000",
    name: "PerDocumentTypePricingDefaults",
    sql: perDocumentTypePricingDefaults
  },
  {
    id: "1718395450000",
    name: "RenameTaxDefinitionsToTaxes",
    sql: renameTaxDefinitionsToTaxes
  },
  {
    id: "1718395500000",
    name: "MergeDocumentSequencesIntoCommercialDocumentSettings",
    sql: mergeDocumentSequencesIntoCommercialDocumentSettings
  },
  {
    id: "1719316800000",
    name: "AddBankAccountToWorkers",
    sql: addBankAccountToWorkers
  },
  {
    id: "1719316801000",
    name: "AddWorkerSnapshotBankAccountToBudgets",
    sql: addWorkerSnapshotBankAccountToBudgets
  },
  {
    id: "1719316802000",
    name: "AddWorkerSnapshotBankAccountToInvoices",
    sql: addWorkerSnapshotBankAccountToInvoices
  }
];