/** @jsxImportSource . */
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { InvoiceResponse } from "@/api/schemas/invoice-schemas";
import { JobItemResponse } from "@/api/schemas/job-item-schemas";
import { IssuerBlock } from "@/presentation/components/pdf/IssuerBlock";
import { ClientBlock } from "@/presentation/components/pdf/ClientBlock";
import { JobItemsTable } from "@/presentation/components/pdf/JobItemsTable";
import { TotalsBlock } from "@/presentation/components/pdf/TotalsBlock";
import { PaymentBlock } from "@/presentation/components/pdf/PaymentBlock";
import { PdfLabels } from "@/presentation/i18n/pdf-translations";

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
    backgroundColor: "#2E7D32",
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

interface InvoiceDocumentProps {
  invoice: InvoiceResponse;
  items: JobItemResponse[];
  labels: PdfLabels;
}

export function InvoiceDocument({ invoice, items, labels }: InvoiceDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />
        <View style={styles.header}>
          <IssuerBlock worker={invoice.worker} />
          <View style={styles.docMeta}>
            <Text style={styles.docTitle}>{labels.invoice}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>{labels.number}</Text>
              <Text style={styles.metaValue}>{invoice.number}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>{labels.date}</Text>
              <Text style={styles.metaValue}>{formatDate(invoice.issuedAt ?? invoice.createdAt)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <ClientBlock client={invoice.client} labels={labels} />

        <View style={styles.divider} />

        <JobItemsTable items={items} labels={labels} />

        <TotalsBlock
          subtotalAmount={invoice.subtotalAmount}
          taxAmount={invoice.taxAmount}
          totalAmount={invoice.totalAmount}
          tax={invoice.tax}
          labels={labels}
        />

        {invoice.worker.bankAccount ? (
          <PaymentBlock bankAccount={invoice.worker.bankAccount} labels={labels} />
        ) : null}
      </Page>
    </Document>
  );
}
