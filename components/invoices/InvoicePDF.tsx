// components/invoices/InvoicePDF.tsx
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"
import type { Invoice } from "@/lib/db/invoices"

// Register a font (optional but helps with consistency)
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7W0Q5n-wU.woff2" },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Inter",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "1px solid #e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E3A5F",
  },
  subtitle: {
    fontSize: 10,
    color: "#6b7280",
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E3A5F",
    textAlign: "right",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E3A5F",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottom: "1px solid #f3f4f6",
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottom: "1px solid #1E3A5F",
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 10,
    borderTop: "2px solid #1E3A5F",
    fontWeight: "bold",
    fontSize: 14,
  },
  clientSection: {
    marginBottom: 20,
  },
  clientName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E3A5F",
  },
  clientDetail: {
    fontSize: 10,
    color: "#6b7280",
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: "1px solid #e5e7eb",
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
  },
  paymentInstructions: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
    fontSize: 10,
    color: "#374151",
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: "bold",
    padding: "4px 12px",
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    alignSelf: "flex-start",
  },
  statusPaid: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },
  statusSent: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  statusDraft: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  statusOverdue: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
})

interface InvoicePDFProps {
  invoice: Invoice & { clientName: string }
  businessName?: string | null
  businessAddress?: string | null
  paymentInstructions?: string | null
}

export function InvoicePDF({
  invoice,
  businessName,
  businessAddress,
  paymentInstructions,
}: InvoicePDFProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoice.currency || "USD",
    }).format(amount)

  const getStatusStyle = () => {
    switch (invoice.status) {
      case "paid":
        return styles.statusPaid
      case "sent":
        return styles.statusSent
      case "overdue":
        return styles.statusOverdue
      case "draft":
      default:
        return styles.statusDraft
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{businessName || "TranslatorTrack"}</Text>
            {businessAddress && (
              <Text style={styles.subtitle}>{businessAddress}</Text>
            )}
          </View>
          <View>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
            <Text style={styles.subtitle}>Issued: {invoice.issued_at
              ? new Date(invoice.issued_at).toLocaleDateString()
              : "Not issued yet"}</Text>
            <Text style={[styles.subtitle, { marginTop: 2 }]}>
              Due: {invoice.due_at
                ? new Date(invoice.due_at).toLocaleDateString()
                : "—"}
            </Text>
            <View style={[styles.statusBadge, getStatusStyle()]}>
              <Text>{invoice.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <Text style={styles.clientName}>{invoice.clientName}</Text>
        </View>

        {/* Invoice Items */}
        <View style={styles.section}>
          <View style={styles.rowHeader}>
            <Text style={{ flex: 2 }}>Description</Text>
            <Text style={{ flex: 1, textAlign: "right" }}>Amount</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ flex: 2 }}>
              Translation project #{invoice.project_id.slice(0, 8)}
            </Text>
            <Text style={{ flex: 1, textAlign: "right" }}>
              {formatCurrency(invoice.amount)}
            </Text>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalRow}>
          <Text>Total</Text>
          <Text>{formatCurrency(invoice.amount)}</Text>
        </View>

        {/* Payment Instructions */}
        {paymentInstructions && (
          <View style={styles.paymentInstructions}>
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>Payment Instructions</Text>
            <Text>{paymentInstructions}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business.</Text>
          <Text style={{ marginTop: 4 }}>
            Invoice generated on {new Date().toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  )
}