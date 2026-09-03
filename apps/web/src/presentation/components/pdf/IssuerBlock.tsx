/** @jsxImportSource . */
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import { DocumentPartySchema } from "@/api/schemas/commercial-document-schema";

const styles = StyleSheet.create({
  block: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16
  },
  image: {
    width: 110,
    height: 67,
    objectFit: "contain",
    marginLeft: 12
  },
  details: {
    flex: 1
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
  imageSource: string;
}

export function IssuerBlock({ worker, imageSource }: IssuerBlockProps) {
  return (
    <View style={styles.block}>
      <View style={styles.details}>
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
        {worker.phone || worker.email ? (
          <View style={{ flexDirection: "row" }}>
            {worker.phone ? <Text style={styles.line}>{worker.phone}</Text> : null}
            {worker.phone && worker.email ? <Text style={styles.line}> | </Text> : null}
            {worker.email ? <Text style={styles.line}>{worker.email}</Text> : null}
          </View>
        ) : null}
      </View>
      <Image src={imageSource} style={styles.image} />
    </View>
  );
}
