/** @jsxImportSource . */
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { DocumentTaxSchema } from "@/api/schemas/commercial-document-schema";
import { PdfLabels } from "@/presentation/i18n/pdf-translations";

const styles = StyleSheet.create({
  totals: {
    marginLeft: "auto",
    width: "50%",
    marginBottom: 16
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3
  },
  label: {
    fontSize: 10,
    color: "#555"
  },
  value: {
    fontSize: 10
  },
  noTaxLabel: {
    fontSize: 10,
    color: "#aaa",
    fontStyle: "italic"
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#333",
    marginTop: 4
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "bold"
  },
  totalValue: {
    fontSize: 11,
    fontWeight: "bold"
  }
});

function formatCurrency(value: number): string {
  return `${value.toFixed(2)} €`;
}

interface TotalsBlockProps {
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  tax: DocumentTaxSchema | null;
  labels: Pick<PdfLabels, "subtotal" | "noTax" | "total">;
}

export function TotalsBlock({ subtotalAmount, taxAmount, totalAmount, tax, labels }: TotalsBlockProps) {
  return (
    <View style={styles.totals}>
      <View style={styles.row}>
        <Text style={styles.label}>{labels.subtotal}</Text>
        <Text style={styles.value}>{formatCurrency(subtotalAmount)}</Text>
      </View>
      {tax ? (
        <View style={styles.row}>
          <Text style={styles.label}>
            {tax.name} ({tax.rate}%)
          </Text>
          <Text style={styles.value}>{formatCurrency(taxAmount)}</Text>
        </View>
      ) : (
        <View style={styles.row}>
          <Text style={styles.noTaxLabel}>{labels.noTax}</Text>
        </View>
      )}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{labels.total}</Text>
        <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
      </View>
    </View>
  );
}
