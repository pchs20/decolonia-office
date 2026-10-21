/** @jsxImportSource . */
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { DocumentPartySchema } from "@/api/schemas/commercial-document-schema";

const styles = StyleSheet.create({
  block: {
    marginBottom: 16
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
}

export function ClientBlock({ client }: ClientBlockProps) {
  return (
    <View style={styles.block}>
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
      {client.phone ? <Text style={styles.line}>{client.phone}</Text> : null}
      {client.email ? <Text style={styles.line}>{client.email}</Text> : null}
    </View>
  );
}
