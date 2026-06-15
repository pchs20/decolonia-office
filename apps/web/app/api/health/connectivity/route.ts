import { NextResponse } from "next/server";
import { getDbPool } from "@/server/db";

export async function GET() {
  try {
    await getDbPool().query("SELECT 1");

    return NextResponse.json(
      {
        status: "ok",
        checks: {
          postgres: {
            ok: true,
            detail: "PostgreSQL reachable"
          }
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "degraded",
        checks: {
          postgres: {
            ok: false,
            detail: `PostgreSQL error: ${error instanceof Error ? error.message : String(error)}`
          }
        }
      },
      { status: 200 }
    );
  }
}
