import {
  archiveTax,
  createTax,
  deactivateTax,
  updateTax
} from "@/application/use-cases/tax-use-cases";
import { TaxRepository } from "@/application/outbound/tax-repository";

describe("tax use-cases", () => {
  const taxRepo: jest.Mocked<TaxRepository> = {
    create: jest.fn(),
    getById: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    archive: jest.fn()
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("creates tax definition with default behavior and active flag", async () => {
    taxRepo.create.mockImplementation(async tax => tax);

    const created = await createTax("IVA", 21, taxRepo);

    expect(created.behavior).toBe("added");
    expect(created.isActive).toBe(true);
    expect(created.name).toBe("IVA");
  });

  it("updates and deactivates a tax definition", async () => {
    taxRepo.getById.mockResolvedValueOnce({
      id: "t-1",
      name: "Old",
      rate: 10,
      behavior: "added",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    taxRepo.update.mockImplementation(async tax => tax);

    const updated = await updateTax("t-1", "New", 15, taxRepo);
    expect(updated.name).toBe("New");
    expect(updated.rate).toBe(15);

    taxRepo.getById.mockResolvedValueOnce(updated);
    const deactivated = await deactivateTax("t-1", taxRepo);
    expect(deactivated.isActive).toBe(false);
  });

  it("archives tax definition", async () => {
    taxRepo.archive.mockResolvedValueOnce(undefined);
    await expect(archiveTax("t-1", taxRepo)).resolves.toBeUndefined();
  });
});
