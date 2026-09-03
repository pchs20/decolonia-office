import { readFile } from "node:fs/promises";
import path from "node:path";

export type PdfImageKind = "budget" | "invoice";

const imageFilenames: Record<PdfImageKind, string> = {
  budget: "budget-image.jpg",
  invoice: "invoice-image.jpg"
};

export async function loadPdfImage(kind: PdfImageKind): Promise<string> {
  const filename = imageFilenames[kind];
  const candidatePaths = [
    path.join(process.cwd(), "public", "pdf", filename),
    path.join(process.cwd(), "apps", "web", "public", "pdf", filename)
  ];

  let lastError: unknown;
  for (const filePath of candidatePaths) {
    try {
      const image = await readFile(filePath);
      return `data:image/jpeg;base64,${image.toString("base64")}`;
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`Unable to load ${kind} PDF image asset`, { cause: lastError });
}
