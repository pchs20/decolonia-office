export function exportFileName(type: "budget" | "invoice", number: unknown, documentId: string): string {
  const safeNumber = String(number ?? documentId).replace(/[^a-zA-Z0-9-]/g, "-") || documentId;
  const suffix = documentId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) || "document";
  return `${type === "budget" ? "presupuesto" : "factura"}-${safeNumber}-${suffix}.pdf`;
}
