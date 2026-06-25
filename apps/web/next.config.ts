import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/api/**": ["./src/infrastructure/persistence/postgres/migrations/*.sql"]
  }
};

export default nextConfig;
