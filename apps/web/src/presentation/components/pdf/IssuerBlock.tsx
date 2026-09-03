/** @jsxImportSource . */
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { DocumentPartySchema } from "@/api/schemas/commercial-document-schema";

const styles = StyleSheet.create({
  block: {
    marginBottom: 16
  },
  name: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2
  },
  line: {
    fontSize: 10,
    color: "#444"
  }
});

interface IssuerBlockProps {
  worker: DocumentPartySchema & { id: string };
}

export function IssuerBlock({ worker }: IssuerBlockProps) {
  return (
    <View style={styles.block}>
      <Text style={styles.name}>{worker.name}</Text>
      {worker.taxId ? <Text style={styles.line}>{worker.taxId}</Text> : null}
      {worker.billingAddress ? (
        <View>
          <Text style={styles.line}>{worker.billingAddress.street}</Text>
          <Text style={styles.line}>
            {worker.billingAddress.postalCode} {worker.billingAddress.city}
          </Text>
        </View>
      ) : null}
      {worker.phone ? <Text style={styles.line}>{worker.phone}</Text> : null}
      {worker.email ? <Text style={styles.line}>{worker.email}</Text> : null}
    </View>
  );
}
