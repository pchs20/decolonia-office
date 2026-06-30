/** @jsxImportSource . */
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { BudgetResponse } from "@/api/schemas/budget-schemas";
import { JobItemResponse } from "@/api/schemas/job-item-schemas";
import { IssuerBlock } from "@/presentation/components/pdf/IssuerBlock";
import { ClientBlock } from "@/presentation/components/pdf/ClientBlock";
import { JobItemsTable } from "@/presentation/components/pdf/JobItemsTable";
import { TotalsBlock } from "@/presentation/components/pdf/TotalsBlock";
import { PdfLabels } from "@/presentation/i18n/pdf-translations";
import { brandColors } from "@/lib/brand-colors";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 48,
    color: "#222"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24
  },
  docMeta: {
    alignItems: "flex-end"
  },
  docTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 180
  },
  metaLabel: {
    fontSize: 9,
    color: "#888"
  },
  metaValue: {
    fontSize: 9
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 16
  },
  accentBar: {
    height: 6,
    backgroundColor: brandColors.budgets.DEFAULT,
    marginTop: -40,
    marginLeft: -48,
    marginRight: -48,
    marginBottom: 34
  }
});

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-ES");
}

interface BudgetDocumentProps {
  budget: BudgetResponse;
  items: JobItemResponse[];
  labels: PdfLabels;
}

export function BudgetDocument({ budget, items, labels }: BudgetDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />
        <View style={styles.header}>
          <IssuerBlock worker={budget.worker} />
          <View style={styles.docMeta}>
            <Text style={styles.docTitle}>{labels.budget.toUpperCase()}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>{labels.number}</Text>
              <Text style={styles.metaValue}>{budget.number}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>{labels.date}</Text>
              <Text style={styles.metaValue}>{formatDate(budget.deliveredAt ?? budget.createdAt)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <ClientBlock client={budget.client} labels={labels} />

        <View style={styles.divider} />

        <JobItemsTable items={items} labels={labels} />

        <TotalsBlock
          subtotalAmount={budget.subtotalAmount}
          taxAmount={budget.taxAmount}
          totalAmount={budget.totalAmount}
          tax={budget.tax}
          labels={labels}
        />
      </Page>
    </Document>
  );
}

