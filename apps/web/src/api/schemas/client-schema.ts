import { ProfileSchema, CreateProfileInput, UpdateProfileInput } from "@/api/schemas/profile-schema";

export type ClientType = "individual" | "company";

export interface ClientSchema extends ProfileSchema {
  type: ClientType;
}

export interface CreateClientInput extends CreateProfileInput {
  type: ClientType;
}

export interface UpdateClientInput extends UpdateProfileInput {
  type?: ClientType;
}

export interface ClientListResponseSchema {
  clients: ClientSchema[];
  total: number;
  page: number;
  limit: number;
}
