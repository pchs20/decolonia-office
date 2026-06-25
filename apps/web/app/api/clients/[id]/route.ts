import { NextRequest, NextResponse } from "next/server";
import { clientUseCases } from "@/api/composition/clients";
import { getErrorResponse } from "@/api/errors/api-errors";
import { validateClientUpdatePayload } from "@/api/schemas/client-validator";
import { toClientSchema } from "@/api/mappers/client-mapper";

const { deleteClient, getClientById, updateClient } = clientUseCases;

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const client = await getClientById(id);

    return NextResponse.json(toClientSchema(client), { status: 200 });
  } catch (error) {
    console.error("GET /api/clients/:id failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const input = validateClientUpdatePayload(payload);
    const client = await updateClient(id, input);

    return NextResponse.json(toClientSchema(client), { status: 200 });
  } catch (error) {
    console.error("PATCH /api/clients/:id failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await deleteClient(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/clients/:id failed", error);
    const mapped = getErrorResponse(error);
    return NextResponse.json(mapped.body, { status: mapped.status });
  }
}
