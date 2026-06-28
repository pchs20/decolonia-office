import { Profile } from "@/domain/entities/profile";

export interface Worker extends Profile {
  bankAccount: string | null;
  isPrimary: boolean;
}