import { EntityNotFoundError } from "@/domain/exceptions";
import { createWorkersUseCases } from "@/application/use-cases/workers/workers-service";
import { WorkerRepository } from "@/application/outbound/worker-repository";

describe("workers-service CRUD", () => {
  const repository: jest.Mocked<WorkerRepository> = {
    create: jest.fn(),
    getById: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  const { createWorker, deleteWorker, getWorkerById, listWorkers, updateWorker } =
    createWorkersUseCases(repository);

  beforeEach(() => {
    repository.create.mockReset();
    repository.getById.mockReset();
    repository.list.mockReset();
    repository.update.mockReset();
    repository.delete.mockReset();
  });

  it("creates and maps a worker", async () => {
    repository.create.mockImplementation(async worker => ({
      ...worker,
      id: "w-1"
    }));

    const worker = await createWorker({
      name: "Worker A",
      street: "Carrer 1",
      city: "Barcelona",
      postalCode: "08001",
      taxId: "12345678X"
    });

    expect(worker.name).toBe("Worker A");
    expect(worker.workAddress.city).toBe("Barcelona");
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it("retrieves worker by id and throws 404 when missing", async () => {
    repository.getById.mockResolvedValueOnce({
      id: "w-1",
      name: "Worker A",
      workAddress: { street: "Carrer 1", city: "Barcelona", postalCode: "08001" },
      billingAddress: { street: "Carrer 1", city: "Barcelona", postalCode: "08001" },
      taxId: "12345678X",
      phone: null,
      email: null,
      isActive: true,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z")
    });

    const worker = await getWorkerById("w-1");
    expect(worker.id).toBe("w-1");

    repository.getById.mockRejectedValueOnce(new EntityNotFoundError("Worker not found"));
    await expect(getWorkerById("missing")).rejects.toThrow(EntityNotFoundError);
  });

  it("lists workers with pagination and optional search", async () => {
    repository.list.mockResolvedValueOnce({
      workers: [
        {
          id: "w-1",
          name: "Worker A",
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

    const result = await listWorkers(1, 10, "Worker");
    expect(result.total).toBe(1);
    expect(result.workers[0].name).toBe("Worker A");
  });

  it("updates worker and keeps billing aligned when work changes", async () => {
    repository.getById.mockResolvedValueOnce({
      id: "w-1",
      name: "Worker A",
      workAddress: { street: "Old St", city: "Barcelona", postalCode: "08001" },
      billingAddress: { street: "Old St", city: "Barcelona", postalCode: "08001" },
      taxId: "12345678X",
      phone: null,
      email: null,
      isActive: true,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z")
    });
    repository.update.mockImplementation(async worker => ({
      ...worker,
      updatedAt: new Date("2026-01-02T00:00:00.000Z")
    }));

    const updated = await updateWorker("w-1", { street: "New St" });
    expect(repository.update).toHaveBeenCalledTimes(1);
    expect(repository.update.mock.calls[0][0].billingAddress.street).toBe("New St");
    expect(updated.workAddress.street).toBe("New St");
    expect(updated.billingAddress.street).toBe("New St");
  });

  it("archives worker and throws 404 when already missing", async () => {
    repository.delete.mockResolvedValueOnce(undefined);
    await expect(deleteWorker("w-1")).resolves.toBeUndefined();

    repository.delete.mockRejectedValueOnce(new EntityNotFoundError("Worker not found"));
    await expect(deleteWorker("missing")).rejects.toThrow(EntityNotFoundError);
  });
});