import { Injectable } from "@nestjs/common";
import { Client } from "pg";

type CheckResult = { ok: boolean; detail: string };

export type ConnectivityReport = {
  status: "ok" | "degraded";
  checks: {
    postgres: CheckResult;
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

  async runChecks(): Promise<ConnectivityReport> {
    const postgres = await this.checkPostgres();

    const allOk = postgres.ok;

    return {
      status: allOk ? "ok" : "degraded",
      checks: { postgres }
    };
  }
}
