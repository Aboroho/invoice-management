"use client";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import { numberToWords } from "@/lib/utils";

// Styles similar to your Tailwind classes but for react-pdf
const styles = StyleSheet.create({
  borderTop: {
    borderTop: "1px solid #000",
    paddingTop: "4",
  },

  borderBottom: {
    borderBottom: "1px solid #000",
  },
  fontSmall: {
    fontSize: 12,
  },
  page: {
    padding: 20,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid black",
    paddingBottom: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: "#16a34a",
    fontWeight: "bold",
  },
  schoolInfo: {
    color: "#4b5563",
    fontSize: 12,
    fontWeight: "bold",
  },

  receiptDetails: {
    fontSize: 12,
    color: "#4b5563",
  },
  section: {
    marginBottom: 20,

    paddingBottom: 10,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    padding: 10,
    fontSize: 10,
    border: "1px solid black",
  },
  feeDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  total: {
    fontSize: 12,
    textAlign: "right",
    fontWeight: "bold",
  },
  signatureSection: {
    position: "absolute",
    bottom: 35,
    width: "90%",

    flexDirection: "row",
    justifyContent: "space-between",

    textAlign: "center",
    fontSize: 12,
  },

  spacedElement: {
    display: "flex",
    flexDirection: "column",
    gap: "4",
  },
});

// Font for text number to words conversion (optional)
Font.register({
  family: "Roboto",
  src: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
});

type Props = {
  invoiceID: string;

  forMonth: string;
  forYear: string;
  name: string;
  studentClass: string;
  studentID: string;
  mobile: string;
  fees: { feeAmount: number; feeDetails: string; _id?: string }[];
  total: number;
  dateToday: string;
};
const InvoicePDF = ({
  invoiceID,
  forMonth,
  forYear,
  name,
  studentClass,
  studentID,
  mobile,
  fees,
  total,
  dateToday,
}: Props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Albab Academy</Text>
            <Text style={styles.schoolInfo}>
              House no 51, M A Bari Road (Air Club)
            </Text>
            <Text style={styles.schoolInfo}>Sonadanga, Khulna, Bangladesh</Text>
          </View>
          <View style={[{ paddingTop: 5 }, styles.spacedElement]}>
            <Text style={styles.receiptDetails}>Receipt ID: {invoiceID}</Text>
            <Text style={{ fontSize: 12, color: "#000" }}>
              Payment Date: <Text>{dateToday}</Text>
            </Text>
          </View>
        </View>

        {/* Month Info */}
        <View style={[styles.section, styles.borderBottom]}>
          <Text>
            <Text style={styles.schoolInfo}>For Month: </Text>
            <Text style={{ fontSize: 12 }}>{`${forMonth}, ${forYear}`}</Text>
          </Text>
        </View>

        {/* Student Info */}
        <View style={styles.section}>
          <View style={styles.feeDetails}>
            <View style={styles.spacedElement}>
              <Text>
                <Text style={styles.schoolInfo}>Student Name: </Text>
                <Text style={styles.fontSmall}>{name}</Text>
              </Text>
              <Text>
                <Text style={styles.schoolInfo}>Class: </Text>
                <Text style={styles.fontSmall}>{studentClass}</Text>
              </Text>
              <Text>
                <Text style={styles.schoolInfo}>Student ID: </Text>
                <Text style={styles.fontSmall}>{studentID}</Text>
              </Text>
            </View>
            <View>
              <Text>
                <Text style={styles.schoolInfo}>Phone: </Text>
                <Text style={styles.fontSmall}>{mobile}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Fees Table */}
        <View style={[styles.section]}>
          <Text style={{ fontSize: 14, paddingBottom: 10 }}>Summary</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  { flex: 1, fontWeight: "bold", fontSize: 12 },
                ]}
              >
                Fee Details
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  { flex: 1, fontWeight: "bold", fontSize: 12 },
                ]}
              >
                Amount (TK)
              </Text>
            </View>
            {/* Table Rows */}
            {fees.map((fee) => (
              <View style={styles.tableRow} key={fee._id || fee.feeDetails}>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {fee.feeDetails}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {fee.feeAmount.toFixed(2)} Taka
                  {fee.feeAmount > 0 && (
                    <Text style={{ color: "#6b7280", fontSize: 10 }}>
                      ({numberToWords(fee.feeAmount)} Taka Only)
                    </Text>
                  )}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Total Section */}
        <View style={styles.total}>
          <View
            style={{
              display: "flex",
              justifyContent: "flex-end",

              flexDirection: "row",
            }}
          >
            <Text
              style={{
                border: "1px solid #000",
                padding: "4 10",
                borderRight: "0",
              }}
            >
              Total
            </Text>
            <Text style={{ border: "1px solid #000", padding: "4 10" }}>
              {total.toFixed(2)} Taka
            </Text>
          </View>
          {total > 0 && (
            <Text style={{ fontSize: 10, paddingTop: 6 }}>
              {numberToWords(total)} Taka Only
            </Text>
          )}
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <Text style={styles.borderTop}>Depositor's Signature and Mobile</Text>
          <Text style={styles.borderTop}>Officer</Text>
          <Text style={styles.borderTop}>Authorised Officer</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
