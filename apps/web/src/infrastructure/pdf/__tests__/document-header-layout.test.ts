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

const testGlobal = globalThis as typeof globalThis & {
  __non_webpack_require__: typeof require;
};
testGlobal.__non_webpack_require__ = require;
const { DocumentHeader } = require("@/presentation/components/pdf/DocumentHeader") as typeof import("@/presentation/components/pdf/DocumentHeader");

function renderHeader(title: string): string {
  return renderToStaticMarkup(
    React.createElement(DocumentHeader, {
      worker,
      title,
      number: "30",
      date: "3/10/2026",
      numberLabel: "Número",
      dateLabel: "Fecha",
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
    expect(markup).toContain('font-size:14px');
    expect(markup).toContain(">30<");
    expect(markup).toContain(">3/10/2026<");
  });
});
