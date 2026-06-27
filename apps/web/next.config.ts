import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@react-pdf/renderer"],
  webpack(config) {
    config.module.rules.push({
      test: /\.sql$/,
      type: "asset/source"
    });
    return config;
  }
};

export default nextConfig;
