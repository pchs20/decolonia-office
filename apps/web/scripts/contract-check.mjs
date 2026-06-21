const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

async function request(path, init) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  return { response, body };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const suffix = Math.random().toString(36).slice(2, 8);

  const createPayload = {
    name: `Contract ${suffix}`,
    type: "individual",
    street: "Carrer Test 1",
    city: "Barcelona",
    postalCode: "08001",
    taxId: `TEST${suffix}`,
    phone: "+34 600000000",
    email: `contract.${suffix}@example.com`
  };

  const created = await request("/api/clients", {
    method: "POST",
    body: JSON.stringify(createPayload)
  });

  assert(created.response.status === 201, `Expected 201 on create, got ${created.response.status}`);
  assert(created.body?.id, "Expected created client id");

  const id = created.body.id;

  const fetched = await request(`/api/clients/${id}`);
  assert(fetched.response.status === 200, `Expected 200 on getById, got ${fetched.response.status}`);
  assert(fetched.body?.name === createPayload.name, "Fetched client name mismatch");

  const listed = await request("/api/clients?page=1&limit=10&search=Contract");
  assert(listed.response.status === 200, `Expected 200 on list, got ${listed.response.status}`);
  assert(Array.isArray(listed.body?.clients), "Expected clients array in list response");

  const updated = await request(`/api/clients/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name: `Updated ${suffix}` })
  });
  assert(updated.response.status === 200, `Expected 200 on update, got ${updated.response.status}`);
  assert(updated.body?.name === `Updated ${suffix}`, "Updated client name mismatch");

  const deleted = await request(`/api/clients/${id}`, { method: "DELETE" });
  assert(deleted.response.status === 204, `Expected 204 on delete, got ${deleted.response.status}`);

  const missing = await request(`/api/clients/${id}`);
  assert(missing.response.status === 404, `Expected 404 after delete, got ${missing.response.status}`);

  const workerCreatePayload = {
    name: `Worker ${suffix}`,
    street: "Carrer Worker 1",
    city: "Barcelona",
    postalCode: "08002",
    taxId: `WKR${suffix}`,
    phone: "+34 611111111",
    email: `worker.${suffix}@example.com`
  };

  const workerCreated = await request("/api/workers", {
    method: "POST",
    body: JSON.stringify(workerCreatePayload)
  });
  assert(workerCreated.response.status === 201, `Expected 201 on worker create, got ${workerCreated.response.status}`);
  assert(workerCreated.body?.id, "Expected created worker id");
  assert(workerCreated.body?.billingStreet === workerCreatePayload.street, "Expected worker billing street default to work street");
  assert(workerCreated.body?.billingCity === workerCreatePayload.city, "Expected worker billing city default to work city");
  assert(
    workerCreated.body?.billingPostalCode === workerCreatePayload.postalCode,
    "Expected worker billing postal code default to work postal code"
  );

  const workerId = workerCreated.body.id;

  const workerFetched = await request(`/api/workers/${workerId}`);
  assert(workerFetched.response.status === 200, `Expected 200 on worker getById, got ${workerFetched.response.status}`);
  assert(workerFetched.body?.name === workerCreatePayload.name, "Fetched worker name mismatch");

  const workerListed = await request(`/api/workers?page=1&limit=10&search=${encodeURIComponent(`Worker ${suffix}`)}`);
  assert(workerListed.response.status === 200, `Expected 200 on worker list, got ${workerListed.response.status}`);
  assert(Array.isArray(workerListed.body?.workers), "Expected workers array in worker list response");
  assert(workerListed.body?.workers?.some(worker => worker.id === workerId), "Expected listed workers to include created worker");

  const workerBadPatch = await request(`/api/workers/${workerId}`, {
    method: "PATCH",
    body: JSON.stringify({ billingCity: "Girona" })
  });
  assert(workerBadPatch.response.status === 400, `Expected 400 on partial worker billing patch, got ${workerBadPatch.response.status}`);

  const workerUpdated = await request(`/api/workers/${workerId}`, {
    method: "PATCH",
    body: JSON.stringify({ name: `Worker Updated ${suffix}` })
  });
  assert(workerUpdated.response.status === 200, `Expected 200 on worker update, got ${workerUpdated.response.status}`);
  assert(workerUpdated.body?.name === `Worker Updated ${suffix}`, "Updated worker name mismatch");

  const workerDeleted = await request(`/api/workers/${workerId}`, { method: "DELETE" });
  assert(workerDeleted.response.status === 204, `Expected 204 on worker delete, got ${workerDeleted.response.status}`);

  const workerMissing = await request(`/api/workers/${workerId}`);
  assert(workerMissing.response.status === 404, `Expected 404 after worker delete, got ${workerMissing.response.status}`);

  console.log("Contract checks passed");
}

main().catch((error) => {
  console.error("Contract checks failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
