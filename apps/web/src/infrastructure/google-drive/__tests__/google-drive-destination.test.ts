import { prepareGoogleDriveDestination } from "@/infrastructure/google-drive/google-drive-destination";
import { GoogleDriveAdapter } from "@/infrastructure/google-drive/google-drive-adapter";

jest.mock("@/infrastructure/google-drive/google-drive-adapter");

describe("prepareGoogleDriveDestination", () => {
  it("prepares Spanish document folders without changing the shared root", async () => {
    const ensureFolder = jest.fn()
      .mockResolvedValueOnce({ externalReference: "budgets-folder" })
      .mockResolvedValueOnce({ externalReference: "invoices-folder" });
    const ensureSpreadsheet = jest.fn().mockResolvedValue({ externalReference: "spreadsheet" });

    jest.mocked(GoogleDriveAdapter).mockImplementation(() => ({
      ensureFolder,
      ensureSpreadsheet,
      upsertFile: jest.fn(),
      moveFile: jest.fn(),
      replaceTables: jest.fn()
    } as never));
    process.env.GOOGLE_DRIVE_SHARED_FOLDER_ID = "shared-folder";

    const destination = await prepareGoogleDriveDestination({
      accessToken: "access",
      refreshToken: "refresh",
      googleSubject: "subject"
    });

    expect(ensureFolder).toHaveBeenNthCalledWith(1, {
      name: "Presupuestos",
      parentFolderReference: "shared-folder"
    });
    expect(ensureFolder).toHaveBeenNthCalledWith(2, {
      name: "Facturas",
      parentFolderReference: "shared-folder"
    });
    expect(destination.destinationReference).toBe("shared-folder");
  });
});
