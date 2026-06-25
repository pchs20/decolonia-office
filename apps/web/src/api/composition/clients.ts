import { createClientsUseCases } from "@/application/use-cases/clients/clients-service";
import { postgresClientRepository } from "@/infrastructure/persistence/postgres/repositories/client-repository";

export const clientUseCases = createClientsUseCases(postgresClientRepository);
