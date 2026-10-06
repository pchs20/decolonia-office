export function exportFolderName(type: "budget" | "invoice"): "Presupuestos" | "Facturas" {
  return type === "budget" ? "Presupuestos" : "Facturas";
}
