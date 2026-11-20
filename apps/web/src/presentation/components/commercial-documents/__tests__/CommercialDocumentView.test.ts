import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: { language: "es" },
    t: (key: string) => ({
      "budgets.fields.createdAt": "Created",
      "budgets.fields.deliveredAt": "Delivered",
      "invoices.fields.issuedAt": "Issued"
    }[key] ?? key)
  })
}));

jest.mock("@/presentation/components/commercial-documents/JobItemsTable", () => ({
  JobItemsTable: () => React.createElement("div", null, "items")
}));

import { CommercialDocumentView } from "@/presentation/components/commercial-documents/CommercialDocumentView";

const party = {
  id: "party-1",
  name: "Party",
  taxId: "TAX",
  workAddress: { street: "Work", city: "City", postalCode: "123" },
  billingAddress: { street: "Billing", city: "City", postalCode: "123" }
};

function renderView(deliveredAt?: string) {
  return renderToStaticMarkup(React.createElement(CommercialDocumentView, {
    documentType: "budget",
    number: "1",
    client: party,
    worker: party,
    createdAt: "2026-11-20T00:00:00.000Z",
    deliveredAt,
    items: []
  }));
}

describe("CommercialDocumentView dates", () => {
  it("shows created and delivered dates separately", () => {
    const markup = renderView("2026-11-22T00:00:00.000Z");
    expect(markup).toContain("Created");
    expect(markup).toContain("Delivered");
    expect(markup).toContain("20/11/2026");
    expect(markup).toContain("22/11/2026");
  });

});
