import { NextRequest, NextResponse } from "next/server";
import { getCloudSyncAuthorizationStatus } from "@/api/composition/backup-export";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return NextResponse.json(await getCloudSyncAuthorizationStatus(request));
}
