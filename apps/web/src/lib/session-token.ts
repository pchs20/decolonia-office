import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

function isSecureRequest(request: NextRequest): boolean {
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",", 1)[0]?.trim();
  const protocol = forwardedProtocol ?? request.nextUrl.protocol.replace(":", "");
  return protocol === "https";
}

export function readSessionToken(request: NextRequest) {
  const secureCookie = isSecureRequest(request);
  const cookieName = secureCookie
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  return getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie,
    cookieName,
    salt: cookieName
  });
}