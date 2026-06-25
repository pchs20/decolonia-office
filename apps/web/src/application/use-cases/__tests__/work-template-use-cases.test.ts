import {
  archiveWorkTemplate,
  createWorkTemplate,
  deactivateWorkTemplate,
  updateWorkTemplate
} from "@/application/use-cases/work-template-use-cases";
import { WorkTemplateRepository } from "@/application/outbound/work-template-repository";

describe("work-template use-cases", () => {
  const templateRepo: jest.Mocked<WorkTemplateRepository> = {
    create: jest.fn(),
    getById: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    archive: jest.fn()
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("creates work template as active", async () => {
    templateRepo.create.mockImplementation(async tpl => tpl);

    const created = await createWorkTemplate("Paint walls", "2 coats", 25, templateRepo);

    expect(created.title).toBe("Paint walls");
    expect(created.isActive).toBe(true);
  });

  it("updates and deactivates template", async () => {
    templateRepo.getById.mockResolvedValueOnce({
      id: "wt-1",
      title: "Old",
      description: null,
      defaultUnitPrice: 20,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    templateRepo.update.mockImplementation(async tpl => tpl);

    const updated = await updateWorkTemplate("wt-1", "New", "desc", 30, templateRepo);
    expect(updated.title).toBe("New");
    expect(updated.defaultUnitPrice).toBe(30);

    templateRepo.getById.mockResolvedValueOnce(updated);
    const deactivated = await deactivateWorkTemplate("wt-1", templateRepo);
    expect(deactivated.isActive).toBe(false);
  });

  it("archives template", async () => {
    templateRepo.archive.mockResolvedValueOnce(undefined);
    await expect(archiveWorkTemplate("wt-1", templateRepo)).resolves.toBeUndefined();
  });
});
