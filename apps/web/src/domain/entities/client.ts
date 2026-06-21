import { Profile } from "@/domain/entities/profile";

export type ClientType = "individual" | "company";

export interface Client extends Profile {
  type: ClientType;
}
