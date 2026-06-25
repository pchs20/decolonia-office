export interface CommercialDocumentSettingsResponse {
  defaultBudgetPricingMode: "computed" | "manual-subtotal";
  defaultInvoicePricingMode: "computed" | "manual-subtotal";
}

export interface CommercialDocumentSettingsUpdateRequest {
  defaultBudgetPricingMode: "computed" | "manual-subtotal";
  defaultInvoicePricingMode: "computed" | "manual-subtotal";
}
