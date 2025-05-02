import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f6f8fa",
    padding: 32,
    fontSize: 12,
    color: "#222",
  },
  header: {
    backgroundColor: "#1a73e8",
    color: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  table: {
    display: "table",
    width: "auto",
    marginVertical: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #eee",
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#e3f0fb",
    fontWeight: 700,
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: "center",
    fontSize: 12,
  },
  totalRow: {
    backgroundColor: "#f1f8e9",
    fontWeight: 700,
  },
  footer: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 10,
    color: "#888",
  },
});

const InvoicePDF = ({ products, billDate }) => {
  const total = products.reduce(
    (sum, p) => sum + (Number(p.mrp) - Number(p.discount)) * Number(p.quantity),
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>xAbleKart</Text>
          <Text style={styles.subtitle}>Dharmavaram, Andhra Pradesh</Text>
          <Text style={styles.subtitle}>Contact: 9908971155</Text>
        </View>

        <View>
          <Text>Date: {billDate}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Product</Text>
            <Text style={styles.tableCell}>MRP</Text>
            <Text style={styles.tableCell}>Discount</Text>
            <Text style={styles.tableCell}>Weight</Text>
            <Text style={styles.tableCell}>Qty</Text>
            <Text style={styles.tableCell}>Amount</Text>
          </View>
          {products.map((p, idx) => (
            <View style={styles.tableRow} key={p.code}>
              <Text style={styles.tableCell}>{p.productName}</Text>
              <Text style={styles.tableCell}>Rs. {p.mrp}</Text>
              <Text style={styles.tableCell}>Rs. {p.discount}</Text>
              <Text style={styles.tableCell}>{p.weight}</Text>
              <Text style={styles.tableCell}>{p.quantity}</Text>
              <Text style={styles.tableCell}>
                Rs.{" "}
                {(
                  (Number(p.mrp) - Number(p.discount)) *
                  Number(p.quantity)
                ).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={[styles.tableRow, styles.totalRow]}>
            <Text style={styles.tableCell} colSpan={5}>
              Total
            </Text>
            <Text style={styles.tableCell}>Rs. {total.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Thank you for shopping with xAbleKart!
        </Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
