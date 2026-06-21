import { NextResponse } from "next/server";
import { getOpenApiDocument } from "@/api/openapi/openapi";

export function GET() {
  return NextResponse.json(getOpenApiDocument(), { status: 200 });
}
