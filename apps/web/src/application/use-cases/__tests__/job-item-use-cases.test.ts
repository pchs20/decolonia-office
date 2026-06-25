import {
  addJobItem,
  removeJobItem,
  updateJobItem
} from "@/application/use-cases/job-item-use-cases";
import { JobItemRepository } from "@/application/outbound/job-item-repository";

describe("job-item use-cases", () => {
  const jobItemRepo: jest.Mocked<JobItemRepository> = {
    create: jest.fn(),
    findByDocumentId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("adds a new job item with next position", async () => {
    jobItemRepo.findByDocumentId.mockResolvedValueOnce([
      {
        id: "i-1",
        commercialDocumentId: "d-1",
        position: 2,
        title: "Existing",
        description: null,
        quantity: null,
        unitPrice: null,
        totalPrice: 10
      }
    ]);
    jobItemRepo.create.mockImplementation(async item => item);

    const created = await addJobItem(
      "d-1",
      "New item",
      null,
      1,
      20,
      null,
      jobItemRepo
    );

    expect(created.position).toBe(3);
    expect(created.commercialDocumentId).toBe("d-1");
  });

  it("updates an item payload and delegates to repository", async () => {
    jobItemRepo.update.mockImplementation(async item => ({
      ...item,
      commercialDocumentId: "d-1",
      position: 1
    }));

    const updated = await updateJobItem(
      "i-1",
      "Updated",
      "desc",
      2,
      15,
      30,
      jobItemRepo
    );

    expect(updated.id).toBe("i-1");
    expect(updated.title).toBe("Updated");
    expect(jobItemRepo.update).toHaveBeenCalledTimes(1);
  });

  it("removes an item", async () => {
    jobItemRepo.delete.mockResolvedValueOnce(undefined);
    await expect(removeJobItem("i-1", jobItemRepo)).resolves.toBeUndefined();
  });
});
