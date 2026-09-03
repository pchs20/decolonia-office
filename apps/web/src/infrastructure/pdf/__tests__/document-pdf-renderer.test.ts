import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadPdfImage } from "@/infrastructure/pdf/pdf-image-assets";

describe("PDF image assets", () => {
  test.each([
    ["budget", "budget-image.jpg"],
    ["invoice", "invoice-image.jpg"]
  ])("loads the %s image as an embedded JPEG", async (kind, filename) => {
    const source = await loadPdfImage(kind as "budget" | "invoice");
    const image = await readFile(path.join(process.cwd(), "public", "pdf", filename));

    expect(source).toBe(`data:image/jpeg;base64,${image.toString("base64")}`);
  });
});
