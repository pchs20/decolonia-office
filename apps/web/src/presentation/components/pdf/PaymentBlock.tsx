/** @jsxImportSource . */
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { PdfLabels } from "@/presentation/i18n/pdf-translations";

const styles = StyleSheet.create({
  block: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd"
  },
  label: {
    fontSize: 9,
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 4
  },
  method: {
    fontSize: 10,
    color: "#555",
    marginBottom: 2
  },
  account: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5
  }
});

interface PaymentBlockProps {
  bankAccount: string;
  labels: Pick<PdfLabels, "paymentMethod" | "bankTransfer">;
}

export function PaymentBlock({ bankAccount, labels }: PaymentBlockProps) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{labels.paymentMethod}</Text>
      <Text style={styles.method}>{labels.bankTransfer}</Text>
      <Text style={styles.account}>{bankAccount}</Text>
    </View>
  );
}
