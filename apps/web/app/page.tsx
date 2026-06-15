type HealthResponse = {
  status: string;
  timestamp: string;
};

type ConnectivityResponse = {
  status: string;
  checks: Record<string, { ok: boolean; detail: string }>;
};

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  const health = await fetchJson<HealthResponse>(`${apiBaseUrl}/health`);
  const connectivity = await fetchJson<ConnectivityResponse>(`${apiBaseUrl}/health/connectivity`);

  const apiUp = Boolean(health && health.status === "ok");
  const connectivityUp = Boolean(connectivity && connectivity.status === "ok");

  return (
    <main>
      <h1>Decolonia Office Bootstrap</h1>
      <p>Frontend is running and checking API + infrastructure connectivity.</p>

      <section className="card">
        <h2>API Health</h2>
        <p className={apiUp ? "ok" : "fail"}>{apiUp ? "API reachable" : "API not reachable"}</p>
      </section>

      <section className="card">
        <h2>Infrastructure Connectivity</h2>
        <p className={connectivityUp ? "ok" : "fail"}>
          {connectivityUp ? "API can reach Postgres" : "Connectivity checks failed"}
        </p>
        {connectivity ? <pre>{JSON.stringify(connectivity, null, 2)}</pre> : null}
      </section>
    </main>
  );
}
