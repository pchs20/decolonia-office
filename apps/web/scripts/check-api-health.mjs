const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

async function check(endpoint) {
  const response = await fetch(`${apiBaseUrl}${endpoint}`);
  if (!response.ok) {
    throw new Error(`${endpoint} returned ${response.status}`);
  }
  return response.json();
}

try {
  const health = await check("/api/health");
  const connectivity = await check("/api/health/connectivity");

  console.log("Health:", JSON.stringify(health));
  console.log("Connectivity:", JSON.stringify(connectivity));

  if (connectivity.status !== "ok") {
    console.error("Connectivity check failed");
    process.exit(1);
  }
} catch (error) {
  console.error("API health check failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
