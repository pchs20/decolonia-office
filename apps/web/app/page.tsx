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

export default function HomePage() {
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
    <main>
      <h1>Decolonia Office Bootstrap</h1>
      <p>Frontend is running and checking API + infrastructure connectivity.</p>
      <p><strong>API base URL:</strong> same origin</p>

      <section className="card">
        <h2>API Health</h2>
        <p className={apiUp ? "ok" : "fail"}>{apiUp ? "API reachable" : "API not reachable"}</p>
        {healthResult.error ? <pre>{healthResult.error}</pre> : null}
      </section>

      <section className="card">
        <h2>Infrastructure Connectivity</h2>
        <p className={connectivityUp ? "ok" : "fail"}>
          {connectivityUp ? "API can reach Postgres" : "Connectivity checks failed"}
        </p>
        {connectivityResult.error ? <pre>{connectivityResult.error}</pre> : null}
        {connectivity ? <pre>{JSON.stringify(connectivity, null, 2)}</pre> : null}
      </section>
    </main>
  );
}
