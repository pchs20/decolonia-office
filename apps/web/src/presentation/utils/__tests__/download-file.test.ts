import { downloadFilename, downloadResponse } from "../download-file";

describe("downloadResponse", () => {
  const originalUrl = globalThis.URL;
  const originalDocument = globalThis.document;

  afterEach(() => {
    globalThis.URL = originalUrl;
    globalThis.document = originalDocument;
    jest.restoreAllMocks();
  });

  it("downloads a successful response and revokes its object URL", async () => {
    const click = jest.fn();
    const anchor = { href: "", download: "", click };
    const createObjectURL = jest.spyOn(URL, "createObjectURL").mockReturnValue("blob:test");
    const revokeObjectURL = jest.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);

    globalThis.document = { createElement: jest.fn(() => anchor) } as unknown as Document;

    await downloadResponse(
      { ok: true, blob: async () => new Blob(["pdf"]) } as Response,
      "invoice.pdf"
    );

    expect(anchor.download).toBe("invoice.pdf");
    expect(click).toHaveBeenCalledTimes(1);
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test");
  });

  it("rejects non-OK responses without creating a download", async () => {
    const createObjectURL = jest.spyOn(URL, "createObjectURL");

    await expect(
      downloadResponse({ ok: false } as Response, "backup.zip")
    ).rejects.toThrow("Download request failed");
    expect(createObjectURL).not.toHaveBeenCalled();
  });
});

describe("downloadFilename", () => {
  it("reads the server-provided filename", () => {
    expect(downloadFilename('attachment; filename="backup.zip"', "fallback.zip")).toBe("backup.zip");
  });

  it("uses the fallback when the header has no filename", () => {
    expect(downloadFilename(null, "fallback.zip")).toBe("fallback.zip");
  });
});
