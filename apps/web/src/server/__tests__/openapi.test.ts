import { getOpenApiDocument } from "@/server/openapi";

describe("OpenAPI document", () => {
  it("includes client REST endpoints", () => {
    const doc = getOpenApiDocument();

    expect(doc.paths["/api/clients"]).toBeDefined();
    expect(doc.paths["/api/clients/{id}"]).toBeDefined();
  });

  it("documents supported methods and success status codes", () => {
    const doc = getOpenApiDocument();

    expect(doc.paths["/api/clients"].get.responses["200"]).toBeDefined();
    expect(doc.paths["/api/clients"].post.responses["201"]).toBeDefined();
    expect(doc.paths["/api/clients/{id}"].get.responses["200"]).toBeDefined();
    expect(doc.paths["/api/clients/{id}"].patch.responses["200"]).toBeDefined();
    expect(doc.paths["/api/clients/{id}"].delete.responses["204"]).toBeDefined();
  });
});
