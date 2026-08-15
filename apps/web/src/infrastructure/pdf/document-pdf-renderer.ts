const React = __non_webpack_require__("react") as typeof import("react");
import { renderToBuffer } from "@react-pdf/renderer";
import { BudgetRepository } from "@/application/outbound/budget-repository";
import { InvoiceRepository } from "@/application/outbound/invoice-repository";
import { JobItemRepository } from "@/application/outbound/job-item-repository";
import { DocumentPdfRenderer } from "@/application/outbound/backup-export-ports";
import { mapBudgetToResponse } from "@/api/mappers/budget-mapper";
import { mapInvoiceToResponse } from "@/api/mappers/invoice-mapper";
import { mapJobItemToResponse } from "@/api/mappers/job-item-mapper";
import { BudgetDocument } from "@/presentation/components/pdf/BudgetDocument";
import { InvoiceDocument } from "@/presentation/components/pdf/InvoiceDocument";
import { getPdfLabels } from "@/presentation/i18n/pdf-translations";

export interface DocumentPdfRendererDependencies {
  budgetRepository: Pick<BudgetRepository, "getById">;
  invoiceRepository: Pick<InvoiceRepository, "getById">;
  jobItemRepository: Pick<JobItemRepository, "findByDocumentId">;
}

export function createDocumentPdfRenderer(
  dependencies: DocumentPdfRendererDependencies
): DocumentPdfRenderer {
  return {
    async getBudgetNumber(documentId) {
      const budget = await dependencies.budgetRepository.getById(documentId);
      return budget.number;
    },
    async getInvoiceNumber(documentId) {
      const invoice = await dependencies.invoiceRepository.getById(documentId);
      return invoice.number;
    },
    async renderBudgetPdf(documentId, locale) {
      const [budget, items] = await Promise.all([
        dependencies.budgetRepository.getById(documentId),
        dependencies.jobItemRepository.findByDocumentId(documentId)
      ]);
      const buffer = await renderToBuffer(
        React.createElement(BudgetDocument, {
          budget: mapBudgetToResponse(budget),
          items: items.map(mapJobItemToResponse),
          labels: getPdfLabels(locale)
        }) as React.ReactElement
      );
      return new Uint8Array(buffer);
    },
    async renderInvoicePdf(documentId, locale) {
      const [invoice, items] = await Promise.all([
        dependencies.invoiceRepository.getById(documentId),
        dependencies.jobItemRepository.findByDocumentId(documentId)
      ]);
      const buffer = await renderToBuffer(
        React.createElement(InvoiceDocument, {
          invoice: mapInvoiceToResponse(invoice),
          items: items.map(mapJobItemToResponse),
          labels: getPdfLabels(locale)
        }) as React.ReactElement
      );
      return new Uint8Array(buffer);
    }
  };
}
