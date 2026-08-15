import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const callbackUrl = new URL("/settings/catalog?tab=backup", request.nextUrl.origin);
  const signInUrl = new URL("/api/auth/signin/google", request.nextUrl.origin);
  signInUrl.searchParams.set("callbackUrl", callbackUrl.toString());
  return NextResponse.redirect(signInUrl);
}