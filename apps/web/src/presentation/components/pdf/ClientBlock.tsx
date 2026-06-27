/** @jsxImportSource . */
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { DocumentPartySchema } from "@/api/schemas/commercial-document-schema";
import { PdfLabels } from "@/presentation/i18n/pdf-translations";

const styles = StyleSheet.create({
  block: {
    marginBottom: 16
  },
  label: {
    fontSize: 9,
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 2
  },
  name: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 2
  },
  line: {
    fontSize: 10,
    color: "#444"
  }
});

interface ClientBlockProps {
  client: DocumentPartySchema & { id: string };
  labels: Pick<PdfLabels, "client">;
}

export function ClientBlock({ client, labels }: ClientBlockProps) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{labels.client}</Text>
      <Text style={styles.name}>{client.name}</Text>
      {client.taxId ? <Text style={styles.line}>{client.taxId}</Text> : null}
      {client.billingAddress ? (
        <View>
          <Text style={styles.line}>{client.billingAddress.street}</Text>
          <Text style={styles.line}>
            {client.billingAddress.postalCode} {client.billingAddress.city}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
