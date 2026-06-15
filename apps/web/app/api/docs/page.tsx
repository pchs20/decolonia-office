"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const swaggerUiBundle = "https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js";
const swaggerUiCss = "https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css";

type SwaggerWindow = Window & {
  SwaggerUIBundle?: (config: { url: string; dom_id: string }) => unknown;
};

export default function ApiDocsPage() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded) {
      return;
    }

    const win = window as SwaggerWindow;
    if (typeof win.SwaggerUIBundle === "function") {
      win.SwaggerUIBundle({
        url: "/api/docs/openapi",
        dom_id: "#swagger-ui"
      });
    }
  }, [scriptLoaded]);

  return (
    <main style={{ background: "#fff", minHeight: "100vh" }}>
      <link rel="stylesheet" href={swaggerUiCss} />
      <Script src={swaggerUiBundle} strategy="afterInteractive" onLoad={() => setScriptLoaded(true)} />
      <div id="swagger-ui" />
    </main>
  );
}
