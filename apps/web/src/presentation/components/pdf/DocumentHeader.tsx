/** @jsxImportSource . */
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import { DocumentPartySchema } from "@/api/schemas/commercial-document-schema";
import { IssuerBlock } from "@/presentation/components/pdf/IssuerBlock";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    marginBottom: 24
  },
  issuer: {
    flex: 1
  },
  document: {
    width: 150,
    alignItems: "flex-end"
  },
  documentContent: {
    width: 110
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "right"
  },
  image: {
    width: 110,
    height: 67,
    objectFit: "contain",
    marginBottom: 8
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "baseline",
    width: 110
  },
  metaLabel: {
    fontSize: 9,
    color: "#888",
    marginRight: 4
  },
  metaValue: {
    fontSize: 9,
    flex: 1,
    textAlign: "right"
  }
});

interface DocumentHeaderProps {
  worker: DocumentPartySchema & { id: string };
  title: string;
  number: string;
  date: string;
  numberLabel: string;
  dateLabel: string;
  imageSource: string;
}

export function DocumentHeader({
  worker,
  title,
  number,
  date,
  numberLabel,
  dateLabel,
  imageSource
}: DocumentHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.issuer}>
        <IssuerBlock worker={worker} />
      </View>
      <View style={styles.document}>
        <View style={styles.documentContent}>
          <Text style={styles.title}>{title}</Text>
          <Image src={imageSource} style={styles.image} />
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>{numberLabel}:</Text>
            <Text style={styles.metaValue}>{number}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>{dateLabel}:</Text>
            <Text style={styles.metaValue}>{date}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
