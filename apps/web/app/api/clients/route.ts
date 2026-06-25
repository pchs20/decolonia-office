import { NextRequest, NextResponse } from "next/server";
import { clientUseCases } from "@/api/composition/clients";
import { getErrorResponse } from "@/api/errors/api-errors";
import { validateClientCreatePayload } from "@/api/schemas/client-validator";
import { toClientListResponseSchema, toClientSchema } from "@/api/mappers/client-mapper";

const { createClient, listClients } = clientUseCases;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");
    const search = searchParams.get("search") ?? undefined;

    const data = await listClients(page, limit, search);
    return NextResponse.json(toClientListResponseSchema(data), { status: 200 });
  } catch (error) {
    console.error("GET /api/clients failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const input = validateClientCreatePayload(payload);
    const client = await createClient(input);

    return NextResponse.json(toClientSchema(client), { status: 201 });
  } catch (error) {
    console.error("POST /api/clients failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
