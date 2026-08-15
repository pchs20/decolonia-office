import { CloudFilePort, CloudSpreadsheetPort } from "@/application/outbound/backup-export-ports";
import { getGoogleDriveConfig } from "@/infrastructure/google-drive/config";
import { GoogleDriveAdapter } from "@/infrastructure/google-drive/google-drive-adapter";
import { ExportProvider } from "@/application/outbound/export-provider";
import { GoogleDriveOAuthCredentials } from "@/infrastructure/google-drive/oauth";

export interface GoogleDriveDestination {
  provider: ExportProvider.GoogleDrive;
  destinationReference: string;
  rootFolderReference: string;
  budgetsFolderReference: string;
  invoicesFolderReference: string;
  spreadsheetReference: string;
  filePort: CloudFilePort;
  spreadsheetPort: CloudSpreadsheetPort;
}

export async function prepareGoogleDriveDestination(credentials: GoogleDriveOAuthCredentials): Promise<GoogleDriveDestination> {
  const config = getGoogleDriveConfig(credentials);
  const adapter = new GoogleDriveAdapter(config);
  const root = { externalReference: config.sharedFolderId };
  const [budgets, invoices] = await Promise.all([
    adapter.ensureFolder({ name: "Budgets", parentFolderReference: root.externalReference }),
    adapter.ensureFolder({ name: "Invoices", parentFolderReference: root.externalReference })
  ]);
  const spreadsheet = await adapter.ensureSpreadsheet({
    name: "Decolonia-data",
    parentFolderReference: root.externalReference
  });

  return {
    provider: ExportProvider.GoogleDrive,
    destinationReference: root.externalReference,
    rootFolderReference: root.externalReference,
    budgetsFolderReference: budgets.externalReference,
    invoicesFolderReference: invoices.externalReference,
    spreadsheetReference: spreadsheet.externalReference,
    filePort: adapter,
    spreadsheetPort: adapter
  };
}
