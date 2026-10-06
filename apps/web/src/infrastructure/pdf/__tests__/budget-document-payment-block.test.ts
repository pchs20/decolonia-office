import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

jest.mock("@react-pdf/renderer", () => ({
  Document: "div",
  Image: "img",
  Page: "div",
  StyleSheet: { create: <T,>(styles: T): T => styles },
  Text: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement("span", props, children),
  View: "div"
}));

const testGlobal = globalThis as typeof globalThis & {
  __non_webpack_require__: typeof require;
};
testGlobal.__non_webpack_require__ = require;

const { BudgetDocument } = require("@/presentation/components/pdf/BudgetDocument") as typeof import("@/presentation/components/pdf/BudgetDocument");
const { InvoiceDocument } = require("@/presentation/components/pdf/InvoiceDocument") as typeof import("@/presentation/components/pdf/InvoiceDocument");

const labels = {
  budget: "Presupuesto",
  invoice: "FACTURA",
  number: "Número",
  date: "Fecha",
  client: "Cliente",
  description: "Descripción",
  quantity: "Cant.",
  unitPrice: "Precio unit.",
  totalPrice: "Total",
  subtotal: "Subtotal",
  noTax: "Impuestos no incluidos",
  total: "Total",
  paymentMethod: "Forma de pago",
  bankTransfer: "Transferencia bancaria",
  disclaimer: "Seguro de responsabilidad civil ámbito de construcción"
};

const localizedLabels = [
  labels,
  { ...labels, disclaimer: "Assegurança de responsabilitat civil en l'àmbit de la construcció" },
  { ...labels, disclaimer: "Construction-sector public liability insurance" }
];

function createBudget(bankAccount: string | null) {
  return {
    id: "budget-1",
    number: "30",
    identifierSource: "automatic" as const,
    pricingMode: "computed" as const,
    manualSubtotalAmount: null,
    client: {
      id: "client-1",
      name: "Client",
      taxId: "12345678A",
      phone: null,
      email: null,
      bankAccount: null,
      workAddress: { street: "Client Street", city: "Barcelona", postalCode: "08001" },
      billingAddress: { street: "Client Street", city: "Barcelona", postalCode: "08001" }
    },
    worker: {
      id: "worker-1",
      name: "Worker",
      taxId: "87654321B",
      phone: "600000000",
      email: "worker@example.com",
      bankAccount,
      workAddress: { street: "Work Street", city: "Barcelona", postalCode: "08002" },
      billingAddress: { street: "Work Street", city: "Barcelona", postalCode: "08002" }
    },
    notes: null,
    tax: null,
    subtotalAmount: 100,
    taxAmount: 0,
    totalAmount: 100,
    deliveredAt: null,
    createdAt: new Date("2026-10-04T00:00:00.000Z"),
    updatedAt: new Date("2026-10-04T00:00:00.000Z")
  };
}

function renderBudget(bankAccount: string | null, pdfLabels = labels): string {
  return renderToStaticMarkup(
    React.createElement(BudgetDocument, {
      budget: createBudget(bankAccount),
      items: [],
      labels: pdfLabels,
      imageSource: "image-source"
    })
  );
}

function renderInvoice(pdfLabels = labels): string {
  const budget = createBudget("ES1234567890");

  return renderToStaticMarkup(
    React.createElement(InvoiceDocument, {
      invoice: { ...budget, issuedAt: null, sourceBudgetId: null },
      items: [],
      labels: pdfLabels,
      imageSource: "image-source"
    })
  );
}

function renderedText(value: string): string {
  return value.replaceAll("'", "&#x27;");
}

describe("BudgetDocument payment block", () => {
  test("renders the invoice-style payment block when a bank account is configured", () => {
    const markup = renderBudget("ES1234567890");

    expect(markup.indexOf("100.00 €")).toBeLessThan(markup.indexOf(labels.disclaimer));
    expect(markup).toContain("Forma de pago");
    expect(markup).toContain("Transferencia bancaria");
    expect(markup).toContain("ES1234567890");
    expect(markup).toContain(labels.disclaimer);
    expect(markup.indexOf(labels.disclaimer)).toBeLessThan(markup.indexOf("Forma de pago"));
  });

  test("omits the payment block when no bank account is configured", () => {
    const markup = renderBudget(null);

    expect(markup).not.toContain("Forma de pago");
    expect(markup).not.toContain("Transferencia bancaria");
    expect(markup).toContain(labels.disclaimer);
  });

  test.each(localizedLabels)("renders the localized disclaimer in a budget PDF", pdfLabels => {
    expect(renderBudget(null, pdfLabels)).toContain(renderedText(pdfLabels.disclaimer));
  });

  test.each(localizedLabels)("does not render the disclaimer in an invoice PDF", pdfLabels => {
    expect(renderInvoice(pdfLabels)).not.toContain(pdfLabels.disclaimer);
  });
});
