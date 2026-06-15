import { NextRequest, NextResponse } from "next/server";
import { createClient, listClients, validateCreateInput } from "@/server/clients-service";
import { getErrorResponse } from "@/server/api-errors";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");
    const search = searchParams.get("search") ?? undefined;

    const data = await listClients(page, limit, search);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET /api/clients failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const input = validateCreateInput(payload);
    const client = await createClient(input);

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("POST /api/clients failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
