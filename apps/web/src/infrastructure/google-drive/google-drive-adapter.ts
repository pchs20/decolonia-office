import { google, drive_v3, sheets_v4 } from "googleapis";
import { Readable } from "node:stream";
import { CloudFilePort, CloudSpreadsheetPort } from "@/application/outbound/backup-export-ports";
import { GoogleDriveConfig } from "@/infrastructure/google-drive/config";

const DRIVE_FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";
const GOOGLE_SHEET_MIME_TYPE = "application/vnd.google-apps.spreadsheet";

function escapeQueryValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function sheetRange(name: string): string {
  return `'${name.replace(/'/g, "''")}'`;
}

export class GoogleDriveAdapter implements CloudFilePort, CloudSpreadsheetPort {
  private readonly drive: drive_v3.Drive;
  private readonly sheets: sheets_v4.Sheets;
  private readonly rootFolderId: string;

  constructor(credentials: GoogleDriveConfig) {
    const auth = new google.auth.OAuth2(
      process.env.AUTH_GOOGLE_ID,
      process.env.AUTH_GOOGLE_SECRET
    );
    auth.setCredentials({
      access_token: credentials.accessToken,
      refresh_token: credentials.refreshToken,
      expiry_date: credentials.expiresAt
    });

    this.drive = google.drive({ version: "v3", auth });
    this.sheets = google.sheets({ version: "v4", auth });
    this.rootFolderId = credentials.sharedFolderId;
  }

  async ensureFolder(input: { name: string; parentFolderReference: string | null }) {
    const parent = input.parentFolderReference ?? this.rootFolderId;
    const query = [
      `name = '${escapeQueryValue(input.name)}'`,
      `mimeType = '${DRIVE_FOLDER_MIME_TYPE}'`,
      "trashed = false",
      `'${escapeQueryValue(parent)}' in parents`
    ].join(" and ");
    const existing = await this.drive.files.list({
      q: query,
      spaces: "drive",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      fields: "files(id)",
      pageSize: 1
    });

    const existingId = existing.data.files?.[0]?.id;
    if (existingId) {
      return { externalReference: existingId };
    }

    const created = await this.drive.files.create({
      requestBody: {
        name: input.name,
        mimeType: DRIVE_FOLDER_MIME_TYPE,
        parents: [parent]
      },
      supportsAllDrives: true,
      fields: "id"
    });

    if (!created.data.id) {
      throw new Error(`Google Drive did not return an ID for folder ${input.name}`);
    }

    return { externalReference: created.data.id };
  }

  async upsertFile(input: {
    externalReference?: string;
    parentFolderReference: string;
    name: string;
    content: Uint8Array;
    contentType: string;
  }) {
    const media = {
      mimeType: input.contentType,
      body: Readable.from([Buffer.from(input.content)])
    };

    if (input.externalReference) {
      await this.moveFile({
        externalReference: input.externalReference,
        parentFolderReference: input.parentFolderReference
      });
      await this.drive.files.update({
        fileId: input.externalReference,
        requestBody: { name: input.name },
        media,
        supportsAllDrives: true,
        fields: "id"
      });
      return { externalReference: input.externalReference };
    }

    const created = await this.drive.files.create({
      requestBody: {
        name: input.name,
        parents: [input.parentFolderReference]
      },
      media,
      supportsAllDrives: true,
      fields: "id"
    });

    if (!created.data.id) {
      throw new Error(`Google Drive did not return an ID for file ${input.name}`);
    }

    return { externalReference: created.data.id };
  }

  async moveFile(input: { externalReference: string; parentFolderReference: string }) {
    const existing = await this.drive.files.get({
      fileId: input.externalReference,
      supportsAllDrives: true,
      fields: "parents"
    });
    const oldParents = existing.data.parents?.filter((parent): parent is string => Boolean(parent)).join(",");

    await this.drive.files.update({
      fileId: input.externalReference,
      addParents: input.parentFolderReference,
      removeParents: oldParents,
      supportsAllDrives: true,
      fields: "id,parents"
    });
  }

  async ensureSpreadsheet(input: { name: string; parentFolderReference: string }) {
    const query = [
      `name = '${escapeQueryValue(input.name)}'`,
      `mimeType = '${GOOGLE_SHEET_MIME_TYPE}'`,
      "trashed = false",
      `'${escapeQueryValue(input.parentFolderReference)}' in parents`
    ].join(" and ");
    const existing = await this.drive.files.list({
      q: query,
      spaces: "drive",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      fields: "files(id)",
      pageSize: 1
    });
    const existingId = existing.data.files?.[0]?.id;
    if (existingId) {
      return { externalReference: existingId };
    }

    const created = await this.drive.files.create({
      requestBody: {
        name: input.name,
        mimeType: GOOGLE_SHEET_MIME_TYPE,
        parents: [input.parentFolderReference]
      },
      supportsAllDrives: true,
      fields: "id"
    });

    if (!created.data.id) {
      throw new Error(`Google Drive did not return an ID for spreadsheet ${input.name}`);
    }

    return { externalReference: created.data.id };
  }

  async replaceTables(input: { spreadsheetReference: string; tables: { name: string; columns: string[]; rows: (string | number | boolean | null)[][] }[] }) {
    const spreadsheet = await this.sheets.spreadsheets.get({
      spreadsheetId: input.spreadsheetReference,
      fields: "sheets.properties"
    });
    const existingTitles = new Set(
      spreadsheet.data.sheets
        ?.map((sheet) => sheet.properties?.title)
        .filter((title): title is string => Boolean(title))
    );
    const missingTables = input.tables.filter((table) => !existingTitles.has(table.name));

    if (missingTables.length > 0) {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: input.spreadsheetReference,
        requestBody: {
          requests: missingTables.map((table) => ({ addSheet: { properties: { title: table.name } } }))
        }
      });
    }

    for (const table of input.tables) {
      const range = sheetRange(table.name);
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: input.spreadsheetReference,
        range
      });
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: input.spreadsheetReference,
        range: `${range}!A1`,
        valueInputOption: "RAW",
        requestBody: { values: [table.columns, ...table.rows] }
      });
    }
  }
}
