import { createCommercialDocumentsUseCases } from "@/application/use-cases/commercial-documents/commercial-documents-service";
import { postgresBudgetRepository } from "@/infrastructure/persistence/postgres/repositories/budget-repository";
import { postgresInvoiceRepository } from "@/infrastructure/persistence/postgres/repositories/invoice-repository";
import { postgresJobItemRepository } from "@/infrastructure/persistence/postgres/repositories/job-item-repository";
import { postgresClientRepository } from "@/infrastructure/persistence/postgres/repositories/client-repository";
import { postgresWorkerRepository } from "@/infrastructure/persistence/postgres/repositories/worker-repository";
import { postgresTaxRepository } from "@/infrastructure/persistence/postgres/repositories/tax-repository";
import { postgresWorkTemplateRepository } from "@/infrastructure/persistence/postgres/repositories/work-template-repository";
import { postgresCommercialDocumentSettingsRepository } from "@/infrastructure/persistence/postgres/repositories/commercial-document-settings-repository";

export const commercialDocumentsUseCases = createCommercialDocumentsUseCases({
  budgetRepository: postgresBudgetRepository,
  invoiceRepository: postgresInvoiceRepository,
  jobItemRepository: postgresJobItemRepository,
  clientRepository: postgresClientRepository,
  workerRepository: postgresWorkerRepository,
  taxRepository: postgresTaxRepository,
  templateRepository: postgresWorkTemplateRepository,
  settingsRepository: postgresCommercialDocumentSettingsRepository
});
