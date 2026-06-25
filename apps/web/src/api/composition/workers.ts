import { createWorkersUseCases } from "@/application/use-cases/workers/workers-service";
import { postgresWorkerRepository } from "@/infrastructure/persistence/postgres/repositories/worker-repository";

export const workerUseCases = createWorkersUseCases(postgresWorkerRepository);
