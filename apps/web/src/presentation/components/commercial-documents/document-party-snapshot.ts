import { ClientSchema } from "@/api/schemas/client-schema";
import { WorkerSchema } from "@/api/schemas/worker-schema";

export interface DocumentPartySnapshotFormData {
  name: string;
  taxId: string;
  phone: string;
  email: string;
  bankAccount: string;
  workAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
  billingAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
}

export type DocumentPartySnapshotField =
  | "name"
  | "taxId"
  | "phone"
  | "email"
  | "bankAccount"
  | "workStreet"
  | "workCity"
  | "workPostalCode"
  | "billingStreet"
  | "billingCity"
  | "billingPostalCode";

export const SNAPSHOT_FIELDS: DocumentPartySnapshotField[] = [
  "name",
  "taxId",
  "phone",
  "email",
  "bankAccount",
  "workStreet",
  "workCity",
  "workPostalCode",
  "billingStreet",
  "billingCity",
  "billingPostalCode"
];

export function emptyDocumentPartySnapshot(): DocumentPartySnapshotFormData {
  return {
    name: "",
    taxId: "",
    phone: "",
    email: "",
    bankAccount: "",
    workAddress: { street: "", city: "", postalCode: "" },
    billingAddress: { street: "", city: "", postalCode: "" }
  };
}

export function mapClientToDocumentPartySnapshot(client: ClientSchema): DocumentPartySnapshotFormData {
  return {
    name: client.name,
    taxId: client.taxId,
    phone: client.phone || "",
    email: client.email || "",
    bankAccount: "",
    workAddress: {
      street: client.street,
      city: client.city,
      postalCode: client.postalCode
    },
    billingAddress: {
      street: client.billingStreet || client.street,
      city: client.billingCity || client.city,
      postalCode: client.billingPostalCode || client.postalCode
    }
  };
}

export function mapWorkerToDocumentPartySnapshot(worker: WorkerSchema): DocumentPartySnapshotFormData {
  return {
    name: worker.name,
    taxId: worker.taxId,
    phone: worker.phone || "",
    email: worker.email || "",
    bankAccount: worker.bankAccount || "",
    workAddress: {
      street: worker.street,
      city: worker.city,
      postalCode: worker.postalCode
    },
    billingAddress: {
      street: worker.billingStreet || worker.street,
      city: worker.billingCity || worker.city,
      postalCode: worker.billingPostalCode || worker.postalCode
    }
  };
}

export function mapDocumentPartySnapshot(
  party: { name: string; taxId: string; phone?: string | null; email?: string | null; bankAccount?: string | null; workAddress: { street: string; city: string; postalCode: string }; billingAddress: { street: string; city: string; postalCode: string } }
): DocumentPartySnapshotFormData {
  return {
    name: party.name,
    taxId: party.taxId,
    phone: party.phone || "",
    email: party.email || "",
    bankAccount: party.bankAccount || "",
    workAddress: { ...party.workAddress },
    billingAddress: { ...party.billingAddress }
  };
}

function fieldValue(snapshot: DocumentPartySnapshotFormData, field: DocumentPartySnapshotField): string {
  switch (field) {
    case "workStreet": return snapshot.workAddress.street;
    case "workCity": return snapshot.workAddress.city;
    case "workPostalCode": return snapshot.workAddress.postalCode;
    case "billingStreet": return snapshot.billingAddress.street;
    case "billingCity": return snapshot.billingAddress.city;
    case "billingPostalCode": return snapshot.billingAddress.postalCode;
    default: return snapshot[field];
  }
}

export function normalizeDocumentPartySnapshot(snapshot: DocumentPartySnapshotFormData): DocumentPartySnapshotFormData {
  return {
    ...snapshot,
    name: snapshot.name.trim(),
    taxId: snapshot.taxId.trim(),
    phone: snapshot.phone.trim(),
    email: snapshot.email.trim(),
    bankAccount: snapshot.bankAccount.trim(),
    workAddress: {
      street: snapshot.workAddress.street.trim(),
      city: snapshot.workAddress.city.trim(),
      postalCode: snapshot.workAddress.postalCode.trim()
    },
    billingAddress: {
      street: snapshot.billingAddress.street.trim(),
      city: snapshot.billingAddress.city.trim(),
      postalCode: snapshot.billingAddress.postalCode.trim()
    }
  };
}

export function getChangedSnapshotFields(
  current: DocumentPartySnapshotFormData,
  source: DocumentPartySnapshotFormData
): DocumentPartySnapshotField[] {
  const normalizedCurrent = normalizeDocumentPartySnapshot(current);
  const normalizedSource = normalizeDocumentPartySnapshot(source);
  return SNAPSHOT_FIELDS.filter(field => fieldValue(normalizedCurrent, field) !== fieldValue(normalizedSource, field));
}

export function toDocumentPartySnapshotPayload(snapshot: DocumentPartySnapshotFormData) {
  const normalized = normalizeDocumentPartySnapshot(snapshot);
  return {
    name: normalized.name,
    taxId: normalized.taxId,
    phone: normalized.phone || null,
    email: normalized.email || null,
    bankAccount: normalized.bankAccount || null,
    workAddress: normalized.workAddress,
    billingAddress: normalized.billingAddress
  };
}
