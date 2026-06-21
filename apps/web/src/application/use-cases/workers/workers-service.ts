import { randomUUID } from "crypto";
import { Worker } from "@/domain/entities/worker";
import {
  CreateWorkerParams,
  UpdateWorkerParams
} from "@/application/use-cases/workers/worker-params";
import { WorkerRepository } from "@/application/outbound/worker-repository";
function toNullable(value?: string): string | null {
  return value ?? null;
}

function buildWorkerForCreate(params: CreateWorkerParams): Worker {
  const now = new Date();
  const workAddress = {
    street: params.street,
    city: params.city,
    postalCode: params.postalCode
  };

  const billingAddress = {
    street: params.billingStreet ?? params.street,
    city: params.billingCity ?? params.city,
    postalCode: params.billingPostalCode ?? params.postalCode
  };

  return {
    id: randomUUID(),
    name: params.name,
    workAddress,
    billingAddress,
    taxId: params.taxId,
    phone: toNullable(params.phone),
    email: toNullable(params.email),
    isActive: true,
    createdAt: now,
    updatedAt: now
  };
}

function mergeWorkerUpdate(current: Worker, params: UpdateWorkerParams): Worker {
  const workAddress = {
    street: params.street ?? current.workAddress.street,
    city: params.city ?? current.workAddress.city,
    postalCode: params.postalCode ?? current.workAddress.postalCode
  };

  const hasBillingPatch =
    params.billingStreet !== undefined ||
    params.billingCity !== undefined ||
    params.billingPostalCode !== undefined;
  const hasWorkPatch =
    params.street !== undefined || params.city !== undefined || params.postalCode !== undefined;

  const billingAddress = hasBillingPatch
    ? {
        street: params.billingStreet ?? current.billingAddress.street,
        city: params.billingCity ?? current.billingAddress.city,
        postalCode: params.billingPostalCode ?? current.billingAddress.postalCode
      }
    : hasWorkPatch
      ? workAddress
      : current.billingAddress;

  return {
    ...current,
    name: params.name ?? current.name,
    workAddress,
    billingAddress,
    taxId: params.taxId ?? current.taxId,
    phone: params.phone !== undefined ? toNullable(params.phone) : current.phone,
    email: params.email !== undefined ? toNullable(params.email) : current.email,
    updatedAt: new Date()
  };
}

export function createWorkersUseCases(repository: WorkerRepository) {
  return {
    async createWorker(params: CreateWorkerParams): Promise<Worker> {
      return repository.create(buildWorkerForCreate(params));
    },

    async getWorkerById(id: string): Promise<Worker> {
      return repository.getById(id);
    },

    async listWorkers(page: number, limit: number, search?: string): Promise<{
      workers: Worker[];
      total: number;
      page: number;
      limit: number;
    }> {
      return repository.list(page, limit, search);
    },

    async updateWorker(id: string, params: UpdateWorkerParams): Promise<Worker> {
      const current = await repository.getById(id);
      return repository.update(mergeWorkerUpdate(current, params));
    },

    async deleteWorker(id: string): Promise<void> {
      return repository.delete(id);
    }
  };
}