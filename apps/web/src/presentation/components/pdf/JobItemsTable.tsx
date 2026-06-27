/** @jsxImportSource . */
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { JobItemResponse } from "@/api/schemas/job-item-schemas";
import { PdfLabels } from "@/presentation/i18n/pdf-translations";

const styles = StyleSheet.create({
  table: {
    marginBottom: 16
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 4,
    marginBottom: 4
  },
  row: {
    flexDirection: "row",
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0"
  },
  colQty: {
    width: "10%",
    fontSize: 9,
    textAlign: "right"
  },
  colUnitPrice: {
    width: "20%",
    fontSize: 9,
    textAlign: "right"
  },
  colTotal: {
    width: "20%",
    fontSize: 9,
    textAlign: "right"
  },
  headerText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333"
  }
});

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "";
  return `${value.toFixed(2)} €`;
}

function formatQuantity(value: number | null | undefined): string {
  if (value == null) return "";
  return value % 1 === 0 ? value.toString() : value.toFixed(2);
}

interface JobItemsTableProps {
  items: JobItemResponse[];
  labels: Pick<PdfLabels, "description" | "quantity" | "unitPrice" | "totalPrice">;
}

export function JobItemsTable({ items, labels }: JobItemsTableProps) {
  const showQuantity = items.some(i => i.quantity != null);
  const showUnitPrice = items.some(i => i.unitPrice != null);
  const showTotal = items.some(i => i.totalPrice != null || i.unitPrice != null);

  // Remaining width after optional numeric columns goes to description
  const numericWidth =
    (showQuantity ? 10 : 0) + (showUnitPrice ? 20 : 0) + (showTotal ? 20 : 0);
  const descWidth = `${100 - numericWidth}%`;

  if (!showQuantity && !showUnitPrice && !showTotal) {
    return (
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerText, { width: "100%", fontSize: 9 }]}>{labels.description}</Text>
        </View>
        {items.map(item => (
          <View key={item.id} style={styles.row}>
            <View style={{ width: "100%" }}>
              <Text style={{ fontSize: 9, fontWeight: "bold" }}>{item.title}</Text>
              {item.description ? (
                <Text style={{ fontSize: 8, color: "#666" }}>{item.description}</Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerText, { width: descWidth, fontSize: 9 }]}>{labels.description}</Text>
        {showQuantity ? (
          <Text style={[styles.colQty, styles.headerText]}>{labels.quantity}</Text>
        ) : null}
        {showUnitPrice ? (
          <Text style={[styles.colUnitPrice, styles.headerText]}>{labels.unitPrice}</Text>
        ) : null}
        {showTotal ? (
          <Text style={[styles.colTotal, styles.headerText]}>{labels.totalPrice}</Text>
        ) : null}
      </View>
      {items.map(item => (
        <View key={item.id} style={styles.row}>
          <View style={{ width: descWidth }}>
            <Text style={{ fontSize: 9, fontWeight: "bold" }}>{item.title}</Text>
            {item.description ? (
              <Text style={{ fontSize: 8, color: "#666" }}>{item.description}</Text>
            ) : null}
          </View>
          {showQuantity ? (
            <Text style={styles.colQty}>{formatQuantity(item.quantity)}</Text>
          ) : null}
          {showUnitPrice ? (
            <Text style={styles.colUnitPrice}>{formatCurrency(item.unitPrice)}</Text>
          ) : null}
          {showTotal ? (
            <Text style={styles.colTotal}>{formatCurrency(item.totalPrice ?? item.unitPrice)}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}
