import { Injectable } from "@nestjs/common";
import { Client } from "pg";
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";

type CheckResult = { ok: boolean; detail: string };

export type ConnectivityReport = {
  status: "ok" | "degraded";
  checks: {
    postgres: CheckResult;
    objectStorage: CheckResult;
  };
};

@Injectable()
export class ConnectivityService {
  async checkPostgres(): Promise<CheckResult> {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return { ok: false, detail: "DATABASE_URL is not set" };
    }

    const client = new Client({ connectionString });

    try {
      await client.connect();
      await client.query("SELECT 1");
      return { ok: true, detail: "PostgreSQL reachable" };
    } catch (error) {
      return {
        ok: false,
        detail: `PostgreSQL error: ${error instanceof Error ? error.message : String(error)}`
      };
    } finally {
      await client.end().catch(() => undefined);
    }
  }

  async checkObjectStorage(): Promise<CheckResult> {
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION ?? "eu-west-1";
    const accessKeyId = process.env.S3_ACCESS_KEY;
    const secretAccessKey = process.env.S3_SECRET_KEY;
    const forcePathStyle = process.env.S3_FORCE_PATH_STYLE !== "false";

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      return { ok: false, detail: "S3_ENDPOINT/S3_ACCESS_KEY/S3_SECRET_KEY are required" };
    }

    const client = new S3Client({
      endpoint,
      region,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle
    });

    try {
      await client.send(new ListBucketsCommand({}));
      return { ok: true, detail: "Object storage reachable" };
    } catch (error) {
      return {
        ok: false,
        detail: `Object storage error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  async runChecks(): Promise<ConnectivityReport> {
    const [postgres, objectStorage] = await Promise.all([
      this.checkPostgres(),
      this.checkObjectStorage()
    ]);

    const allOk = postgres.ok && objectStorage.ok;

    return {
      status: allOk ? "ok" : "degraded",
      checks: { postgres, objectStorage }
    };
  }
}
