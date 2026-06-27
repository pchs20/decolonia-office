import { Worker } from "@/domain/entities/worker";
import {
  WorkerListResponseSchema,
  WorkerSchema
} from "@/api/schemas/worker-schema";

export function toWorkerSchema(worker: Worker): WorkerSchema {
  return {
    id: worker.id,
    name: worker.name,
    street: worker.workAddress.street,
    city: worker.workAddress.city,
    postalCode: worker.workAddress.postalCode,
    billingStreet: worker.billingAddress.street,
    billingCity: worker.billingAddress.city,
    billingPostalCode: worker.billingAddress.postalCode,
    taxId: worker.taxId,
    phone: worker.phone,
    email: worker.email,
    bankAccount: worker.bankAccount,
    isActive: worker.isActive,
    createdAt: worker.createdAt.toISOString(),
    updatedAt: worker.updatedAt.toISOString()
  };
}

export function toWorkerListResponseSchema(data: {
  workers: Worker[];
  total: number;
  page: number;
  limit: number;
}): WorkerListResponseSchema {
  return {
    workers: data.workers.map(toWorkerSchema),
    total: data.total,
    page: data.page,
    limit: data.limit
  };
}
