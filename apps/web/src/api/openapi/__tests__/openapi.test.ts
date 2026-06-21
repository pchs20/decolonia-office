import { getOpenApiDocument } from "@/api/openapi/openapi";

describe("OpenAPI document", () => {
  it("includes client and worker REST endpoints", () => {
    const doc = getOpenApiDocument();

    expect(doc.paths["/api/clients"]).toBeDefined();
    expect(doc.paths["/api/clients/{id}"]).toBeDefined();
    expect(doc.paths["/api/workers"]).toBeDefined();
    expect(doc.paths["/api/workers/{id}"]).toBeDefined();
  });

  it("documents supported methods and success status codes", () => {
    const doc = getOpenApiDocument();

    expect(doc.paths["/api/clients"].get.responses["200"]).toBeDefined();
    expect(doc.paths["/api/clients"].post.responses["201"]).toBeDefined();
    expect(doc.paths["/api/clients/{id}"].get.responses["200"]).toBeDefined();
    expect(doc.paths["/api/clients/{id}"].patch.responses["200"]).toBeDefined();
    expect(doc.paths["/api/clients/{id}"].delete.responses["204"]).toBeDefined();

    expect(doc.paths["/api/workers"].get.responses["200"]).toBeDefined();
    expect(doc.paths["/api/workers"].post.responses["201"]).toBeDefined();
    expect(doc.paths["/api/workers/{id}"].get.responses["200"]).toBeDefined();
    expect(doc.paths["/api/workers/{id}"].patch.responses["200"]).toBeDefined();
    expect(doc.paths["/api/workers/{id}"].delete.responses["204"]).toBeDefined();
  });
});
