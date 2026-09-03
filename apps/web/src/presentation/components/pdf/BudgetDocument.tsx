/** @jsxImportSource . */
import { Document, Page, StyleSheet, View } from "@react-pdf/renderer";
import { BudgetResponse } from "@/api/schemas/budget-schemas";
import { JobItemResponse } from "@/api/schemas/job-item-schemas";
import { DocumentHeader } from "@/presentation/components/pdf/DocumentHeader";
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
  imageSource: string;
}

export function BudgetDocument({ budget, items, labels, imageSource }: BudgetDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />
        <DocumentHeader
          worker={budget.worker}
          title={labels.budget.toUpperCase()}
          number={budget.number}
          date={formatDate(budget.deliveredAt ?? budget.createdAt)}
          numberLabel={labels.number}
          dateLabel={labels.date}
          imageSource={imageSource}
        />

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
