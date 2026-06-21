import { randomUUID } from "crypto";
import { Client } from "@/domain/entities/client";
import {
  CreateClientParams,
  UpdateClientParams
} from "@/application/use-cases/clients/client-params";
import { ClientRepository } from "@/application/outbound/client-repository";
function toNullable(value?: string): string | null {
  return value ?? null;
}

function buildClientForCreate(params: CreateClientParams): Client {
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
    type: params.type,
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

function mergeClientUpdate(current: Client, params: UpdateClientParams): Client {
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
    type: params.type ?? current.type,
    workAddress,
    billingAddress,
    taxId: params.taxId ?? current.taxId,
    phone: params.phone !== undefined ? toNullable(params.phone) : current.phone,
    email: params.email !== undefined ? toNullable(params.email) : current.email,
    updatedAt: new Date()
  };
}

export function createClientsUseCases(repository: ClientRepository) {
  return {
    async createClient(params: CreateClientParams): Promise<Client> {
      return repository.create(buildClientForCreate(params));
    },

    async getClientById(id: string): Promise<Client> {
      return repository.getById(id);
    },

    async listClients(page: number, limit: number, search?: string): Promise<{
      clients: Client[];
      total: number;
      page: number;
      limit: number;
    }> {
      return repository.list(page, limit, search);
    },

    async updateClient(id: string, params: UpdateClientParams): Promise<Client> {
      const current = await repository.getById(id);
      return repository.update(mergeClientUpdate(current, params));
    },

    async deleteClient(id: string): Promise<void> {
      return repository.delete(id);
    }
  };
}