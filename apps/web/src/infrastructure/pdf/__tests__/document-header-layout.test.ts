import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

jest.mock("@react-pdf/renderer", () => ({
  Image: "img",
  StyleSheet: { create: <T,>(styles: T): T => styles },
  Text: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement("span", props, children),
  View: "div"
}));

const worker = {
  id: "worker-1",
  name: "Max David Ramirez Arenas",
  taxId: "3334343434N",
  phone: "618181818",
  email: "decolonia@hotmail.com",
  workAddress: { street: "C/ Joan Prim", city: "Premia de Mar", postalCode: "08320" },
  billingAddress: { street: "C/ Joan Prim", city: "Premia de Mar", postalCode: "08320" }
};

const client = {
  ...worker,
  id: "client-1",
  name: "Fundació Privada Casa Pairal",
  phone: "600000001",
  email: "client@example.com"
};

const phoneLabels = {
  es: "Tel.",
  ca: "Tel.",
  en: "Tel."
} as const;

const testGlobal = globalThis as typeof globalThis & {
  __non_webpack_require__: typeof require;
};
testGlobal.__non_webpack_require__ = require;
const { DocumentHeader } = require("@/presentation/components/pdf/DocumentHeader") as typeof import("@/presentation/components/pdf/DocumentHeader");

function renderHeader(title: string): string {
  return renderToStaticMarkup(
    React.createElement(DocumentHeader, {
      worker,
      client,
      title,
      number: "30",
      date: "3/10/2026",
      numberLabel: "Número",
      dateLabel: "Fecha",
      phoneLabel: phoneLabels.es,
      imageSource: "image-source"
    })
  );
}

describe("DocumentHeader title layout", () => {
  test.each([
    ["PRESUPUESTO", "Spanish budget"],
    ["FACTURA", "Spanish invoice"],
    ["PRESSUPOST", "Catalan budget"],
    ["FACTURA", "Catalan invoice"],
    ["QUOTE", "English budget"],
    ["INVOICE", "English invoice"]
  ])("keeps the %s title intact for the %s", (title, _documentType) => {
    const markup = renderHeader(title);

    expect(markup).toContain(`>${title}<`);
    expect(markup).toContain(">Fundació Privada Casa Pairal<");
    expect(markup).not.toContain(">Cliente<");
    expect(markup).toContain(">Tel. 618181818<");
    expect(markup).toContain(">Tel. 600000001<");
    expect(markup).toContain(">client@example.com<");
    expect(markup).toContain('font-size:14px');
    expect(markup).toContain('font-size:11px');
    expect(markup).toContain(">30<");
    expect(markup).toContain(">3/10/2026<");
  });

  test.each(Object.entries(phoneLabels))("renders the localized phone label for %s", (_locale, phoneLabel) => {
    const markup = renderToStaticMarkup(
      React.createElement(DocumentHeader, {
        worker,
        client,
        title: "INVOICE",
        number: "30",
        date: "3/10/2026",
        numberLabel: "Number",
        dateLabel: "Date",
        phoneLabel,
        imageSource: "image-source"
      })
    );

    expect(markup).toContain(`>${phoneLabel} 618181818<`);
    expect(markup).toContain(`>${phoneLabel} 600000001<`);
  });

  test("omits phone labels when phone numbers are absent", () => {
    const markup = renderToStaticMarkup(
      React.createElement(DocumentHeader, {
        worker: { ...worker, phone: null },
        client: { ...client, phone: null },
        title: "INVOICE",
        number: "30",
        date: "3/10/2026",
        numberLabel: "Number",
        dateLabel: "Date",
        phoneLabel: phoneLabels.en,
        imageSource: "image-source"
      })
    );

    expect(markup).not.toContain("Tel.");
    expect(markup).toContain(">client@example.com<");
  });
});
