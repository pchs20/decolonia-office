import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { readSessionToken } from "@/lib/session-token";

const secret = "test-auth-secret";

jest.mock("next-auth/jwt", () => ({ getToken: jest.fn() }));

const mockedGetToken = getToken as jest.MockedFunction<typeof getToken>;

describe("session token cookie resolution", () => {
  beforeEach(() => {
    process.env.AUTH_SECRET = secret;
    mockedGetToken.mockResolvedValue({ googleRefreshToken: "refresh" } as never);
  });

  it("reads the secure session cookie on HTTPS requests", async () => {
    const request = new NextRequest("https://example.com/api/backup/cloud");

    await expect(readSessionToken(request)).resolves.toMatchObject({ googleRefreshToken: "refresh" });
    expect(mockedGetToken).toHaveBeenCalledWith({
      req: request,
      secret,
      secureCookie: true,
      cookieName: "__Secure-authjs.session-token",
      salt: "__Secure-authjs.session-token"
    });
  });

  it("reads the unprefixed session cookie on HTTP requests", async () => {
    const request = new NextRequest("http://localhost/api/backup/cloud");

    await expect(readSessionToken(request)).resolves.toMatchObject({ googleRefreshToken: "refresh" });
    expect(mockedGetToken).toHaveBeenCalledWith({
      req: request,
      secret,
      secureCookie: false,
      cookieName: "authjs.session-token",
      salt: "authjs.session-token"
    });
  });

  it("uses the forwarded HTTPS scheme behind a proxy", async () => {
    const request = new NextRequest("http://example.com/api/backup/cloud", {
      headers: { "x-forwarded-proto": "https, http" }
    });

    await readSessionToken(request);

    expect(mockedGetToken).toHaveBeenCalledWith(expect.objectContaining({
      secureCookie: true,
      cookieName: "__Secure-authjs.session-token",
      salt: "__Secure-authjs.session-token"
    }));
  });
});