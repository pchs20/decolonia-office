"use client";

import { useEffect, useState } from "react";

type HealthResponse = {
  status: string;
  timestamp: string;
};

type ConnectivityResponse = {
  status: string;
  checks: Record<string, { ok: boolean; detail: string }>;
};

type FetchResult<T> = {
  data: T | null;
  error: string | null;
};

async function fetchJson<T>(url: string): Promise<FetchResult<T>> {
  try {
    const res = await fetch(url, { cache: "no-store", credentials: "include" });

    if (!res.ok) {
      return {
        data: null,
        error: `${res.status} ${res.statusText} from ${url}`
      };
    }

    return {
      data: (await res.json()) as T,
      error: null
    };
  } catch {
    return {
      data: null,
      error: `Request failed for ${url}`
    };
  }
}

export default function AppStatusPage() {
  const [healthResult, setHealthResult] = useState<FetchResult<HealthResponse>>({
    data: null,
    error: null
  });
  const [connectivityResult, setConnectivityResult] = useState<FetchResult<ConnectivityResponse>>({
    data: null,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    async function runChecks() {
      const health = await fetchJson<HealthResponse>("/api/health");
      const connectivity = await fetchJson<ConnectivityResponse>("/api/health/connectivity");

      if (cancelled) return;

      setHealthResult(health);
      setConnectivityResult(connectivity);
    }

    void runChecks();

    return () => {
      cancelled = true;
    };
  }, []);

  const health = healthResult.data;
  const connectivity = connectivityResult.data;
  const apiUp = Boolean(health && health.status === "ok");
  const connectivityUp = Boolean(connectivity && connectivity.status === "ok");

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">App Status</h1>
      <p className="text-gray-600">API and infrastructure connectivity checks.</p>
      <p><strong>API base URL:</strong> same origin</p>

      <section className="border rounded-lg p-4 space-y-2">
        <h2 className="text-xl font-semibold">API Health</h2>
        <p className={apiUp ? "text-green-700" : "text-red-600"}>
          {apiUp ? "API reachable" : "API not reachable"}
        </p>
        {healthResult.error ? <pre className="text-sm text-red-600">{healthResult.error}</pre> : null}
      </section>

      <section className="border rounded-lg p-4 space-y-2">
        <h2 className="text-xl font-semibold">Infrastructure Connectivity</h2>
        <p className={connectivityUp ? "text-green-700" : "text-red-600"}>
          {connectivityUp ? "API can reach Postgres" : "Connectivity checks failed"}
        </p>
        {connectivityResult.error ? <pre className="text-sm text-red-600">{connectivityResult.error}</pre> : null}
        {connectivity ? <pre className="text-sm">{JSON.stringify(connectivity, null, 2)}</pre> : null}
      </section>
    </main>
  );
}
