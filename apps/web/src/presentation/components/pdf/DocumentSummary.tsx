/** @jsxImportSource . */
import { StyleSheet, View } from "@react-pdf/renderer";
import { PdfLabels } from "@/presentation/i18n/pdf-translations";
import { PaymentBlock } from "@/presentation/components/pdf/PaymentBlock";
import { TotalsBlock } from "@/presentation/components/pdf/TotalsBlock";
import { DocumentTaxSchema } from "@/api/schemas/commercial-document-schema";

const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 12,
    marginTop: 8
  },
  payment: {
    flex: 1,
    paddingRight: 24,
    paddingTop: 3
  },
  totals: {
    width: "50%"
  }
});

interface DocumentSummaryProps {
  bankAccount?: string | null;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  tax: DocumentTaxSchema | null;
  labels: Pick<PdfLabels, "paymentMethod" | "bankTransfer" | "subtotal" | "noTax" | "total">;
}

export function DocumentSummary({
  bankAccount,
  subtotalAmount,
  taxAmount,
  totalAmount,
  tax,
  labels
}: DocumentSummaryProps) {
  return (
    <View style={styles.summary}>
      <View style={styles.payment}>
        {bankAccount ? <PaymentBlock bankAccount={bankAccount} labels={labels} /> : null}
      </View>
      <View style={styles.totals}>
        <TotalsBlock
          subtotalAmount={subtotalAmount}
          taxAmount={taxAmount}
          totalAmount={totalAmount}
          tax={tax}
          labels={labels}
        />
      </View>
    </View>
  );
}
