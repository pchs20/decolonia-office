import { Client } from "@/domain/entities/client";
import {
  ClientListResponseSchema,
  ClientSchema
} from "@/api/schemas/client-schema";

export function toClientSchema(client: Client): ClientSchema {
  return {
    id: client.id,
    name: client.name,
    type: client.type,
    street: client.workAddress.street,
    city: client.workAddress.city,
    postalCode: client.workAddress.postalCode,
    billingStreet: client.billingAddress.street,
    billingCity: client.billingAddress.city,
    billingPostalCode: client.billingAddress.postalCode,
    taxId: client.taxId,
    phone: client.phone,
    email: client.email,
    isActive: client.isActive,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString()
  };
}

export function toClientListResponseSchema(data: {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
}): ClientListResponseSchema {
  return {
    clients: data.clients.map(toClientSchema),
    total: data.total,
    page: data.page,
    limit: data.limit
  };
}
