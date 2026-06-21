import { ProfileSchema, CreateProfileInput, UpdateProfileInput } from "@/api/schemas/profile-schema";

export interface WorkerSchema extends ProfileSchema {}

export interface CreateWorkerInput extends CreateProfileInput {}

export interface UpdateWorkerInput extends UpdateProfileInput {}

export interface WorkerListResponseSchema {
  workers: WorkerSchema[];
  total: number;
  page: number;
  limit: number;
}
