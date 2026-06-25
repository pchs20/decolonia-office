import { TFunction } from "i18next";

export type CommercialDocumentType = "budget" | "invoice";

export function formatDocumentNumber(
  number: string,
  type: CommercialDocumentType,
  t: TFunction
): string {
  const label = type === "budget"
    ? t("catalog.numbering.documentTypes.budget")
    : t("catalog.numbering.documentTypes.invoice");

  return `${label} #${number}`;
}
