import { NextResponse } from "next/server";
import { getOpenApiDocument } from "@/server/openapi";

export function GET() {
  return NextResponse.json(getOpenApiDocument(), { status: 200 });
}
