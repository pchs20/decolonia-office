import { EntityNotFoundError } from "@/domain/exceptions";
import { createClientsUseCases } from "@/application/use-cases/clients/clients-service";
import { ClientRepository } from "@/application/outbound/client-repository";

describe("clients-service CRUD", () => {
  const repository: jest.Mocked<ClientRepository> = {
    create: jest.fn(),
    getById: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  const { createClient, deleteClient, getClientById, listClients, updateClient } =
    createClientsUseCases(repository);

  beforeEach(() => {
    repository.create.mockReset();
    repository.getById.mockReset();
    repository.list.mockReset();
    repository.update.mockReset();
    repository.delete.mockReset();
  });

  it("creates and maps a client", async () => {
    repository.create.mockImplementation(async client => ({
      ...client,
      id: "c-1"
    }));

    const client = await createClient({
      name: "Client A",
      type: "individual",
      street: "Carrer 1",
      city: "Barcelona",
      postalCode: "08001",
      taxId: "12345678X"
    });

    expect(client.name).toBe("Client A");
    expect(client.type).toBe("individual");
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it("retrieves client by id and throws 404 when missing", async () => {
    repository.getById.mockResolvedValueOnce({
      id: "c-1",
      name: "Client A",
      type: "company",
      workAddress: { street: "Carrer 1", city: "Barcelona", postalCode: "08001" },
      billingAddress: { street: "Carrer 1", city: "Barcelona", postalCode: "08001" },
      taxId: "12345678X",
      phone: null,
      email: null,
      isActive: true,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z")
    });

    const client = await getClientById("c-1");
    expect(client.id).toBe("c-1");

    repository.getById.mockRejectedValueOnce(new EntityNotFoundError("Client not found"));
    await expect(getClientById("missing")).rejects.toThrow(EntityNotFoundError);
  });

  it("lists clients with pagination and optional search", async () => {
    repository.list.mockResolvedValueOnce({
      clients: [
        {
          id: "c-1",
          name: "Client A",
          type: "individual",
          workAddress: { street: "Carrer 1", city: "Barcelona", postalCode: "08001" },
          billingAddress: { street: "Carrer 1", city: "Barcelona", postalCode: "08001" },
          taxId: "12345678X",
          phone: null,
          email: null,
          isActive: true,
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          updatedAt: new Date("2026-01-01T00:00:00.000Z")
        }
      ],
      total: 1,
      page: 1,
      limit: 10
    });

    const result = await listClients(1, 10, "Client");
    expect(result.total).toBe(1);
    expect(result.clients[0].name).toBe("Client A");
  });

  it("updates client and keeps billing aligned when work changes", async () => {
    repository.getById.mockResolvedValueOnce({
      id: "c-1",
      name: "Client A",
      type: "company",
      workAddress: { street: "Old St", city: "Barcelona", postalCode: "08001" },
      billingAddress: { street: "Old St", city: "Barcelona", postalCode: "08001" },
      taxId: "12345678X",
      phone: null,
      email: null,
      isActive: true,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z")
    });
    repository.update.mockImplementation(async client => ({
      ...client,
      updatedAt: new Date("2026-01-02T00:00:00.000Z")
    }));

    const updated = await updateClient("c-1", { street: "New St" });
    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update.mock.calls[0][0].billingAddress.street).toBe("New St");
    expect(updated.workAddress.street).toBe("New St");
    expect(updated.billingAddress.street).toBe("New St");
  });

  it("archives client and throws 404 when already missing", async () => {
    repository.delete.mockResolvedValueOnce(undefined);
    await expect(deleteClient("c-1")).resolves.toBeUndefined();

    repository.delete.mockRejectedValueOnce(new EntityNotFoundError("Client not found"));
    await expect(deleteClient("missing")).rejects.toThrow(EntityNotFoundError);
  });
});