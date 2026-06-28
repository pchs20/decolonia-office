jest.mock("@/auth", () => ({
  auth: (fn: Function) => fn,
}));

jest.mock("@/lib/allowed-emails", () => ({
  allowedEmails: ["allowed@example.com"],
}));

jest.mock("next/server", () => ({
  NextResponse: {
    next: jest.fn(() => ({ type: "next" })),
    redirect: jest.fn((url: URL) => ({ type: "redirect", url: url.toString() })),
    json: jest.fn((body: unknown, init?: { status?: number }) => ({
      type: "json",
      body,
      status: init?.status,
    })),
  },
}));

import { NextResponse } from "next/server";

// middleware.ts is at the root of apps/web, one level above src/
// eslint-disable-next-line @typescript-eslint/no-require-imports
const middleware = require("../../middleware").default;

function mockReq(pathname: string, auth: { user?: { email?: string } } | null = null) {
  return {
    auth,
    nextUrl: { pathname, origin: "http://localhost:3000" },
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("middleware — unauthenticated requests", () => {
  it("redirects web routes to /login", () => {
    middleware(mockReq("/clients"));
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ href: "http://localhost:3000/login" })
    );
  });

  it("returns 401 for API routes", () => {
    middleware(mockReq("/api/clients"));
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Unauthorized" },
      { status: 401 }
    );
  });

  it("returns 401 for nested API routes", () => {
    middleware(mockReq("/api/budgets/123"));
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Unauthorized" },
      { status: 401 }
    );
  });
});

describe("middleware — authenticated but not allowlisted", () => {
  it("returns 403 for API routes", () => {
    middleware(mockReq("/api/clients", { user: { email: "stranger@example.com" } }));
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Forbidden" },
      { status: 403 }
    );
  });

  it("redirects web routes to /login", () => {
    middleware(mockReq("/clients", { user: { email: "stranger@example.com" } }));
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ href: "http://localhost:3000/login" })
    );
  });

  it("blocks session with missing email", () => {
    middleware(mockReq("/api/clients", { user: {} }));
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "Forbidden" },
      { status: 403 }
    );
  });
});

describe("middleware — authenticated and allowlisted", () => {
  const auth = { user: { email: "allowed@example.com" } };

  it("passes through web routes", () => {
    middleware(mockReq("/clients", auth));
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it("passes through API routes", () => {
    middleware(mockReq("/api/clients", auth));
    expect(NextResponse.next).toHaveBeenCalled();
  });

  it("passes through nested routes", () => {
    middleware(mockReq("/budgets/123/edit", auth));
    expect(NextResponse.next).toHaveBeenCalled();
  });
});
