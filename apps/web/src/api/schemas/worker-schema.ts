import { ProfileSchema, CreateProfileInput, UpdateProfileInput } from "@/api/schemas/profile-schema";

export interface WorkerSchema extends ProfileSchema {
  bankAccount: string | null;
  isPrimary: boolean;
}

export interface CreateWorkerInput extends CreateProfileInput {
  bankAccount?: string;
}

export interface UpdateWorkerInput extends UpdateProfileInput {
  bankAccount?: string;
  isPrimary?: boolean;
}

export interface WorkerListResponseSchema {
  workers: WorkerSchema[];
  total: number;
  page: number;
  limit: number;
}
