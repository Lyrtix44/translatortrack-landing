// components/invoices/InvoicePDF.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer"
import type { Invoice } from "@/lib/db/invoices"

// Register a clean, modern font
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7W0Q5n-wU.woff2" },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: "Inter",
    backgroundColor: "#ffffff",
    color: "#1e293b",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: "2px solid #f1f5f9",
  },
  companyName: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  companyAddress: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 4,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: 600,
    color: "#0f172a",
    textAlign: "right",
  },
  invoiceMeta: {
    fontSize: 9,
    color: "#64748b",
    textAlign: "right",
    marginTop: 4,
  },
  statusBadge: {
    alignSelf: "flex-end",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    fontSize: 9,
    fontWeight: 600,
    marginTop: 6,
  },
  statusPaid: { backgroundColor: "#d1fae5", color: "#065f46" },
  statusSent: { backgroundColor: "#dbeafe", color: "#1e40af" },
  statusDraft: { backgroundColor: "#fef3c7", color: "#92400e" },
  statusOverdue: { backgroundColor: "#fee2e2", color: "#991b1b" },

  // Client section
  clientSection: {
    marginBottom: 25,
  },
  clientLabel: {
    fontSize: 9,
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  clientName: {
    fontSize: 13,
    fontWeight: 600,
    color: "#0f172a",
  },
  clientDetail: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
  },

  // Table
  table: {
    marginVertical: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottom: "2px solid #e2e8f0",
    fontWeight: 600,
    fontSize: 9,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottom: "1px solid #f1f5f9",
  },
  colDescription: { flex: 3 },
  colQuantity: { flex: 1, textAlign: "center" },
  colRate: { flex: 1, textAlign: "right" },
  colAmount: { flex: 1, textAlign: "right" },

  // Totals
  totals: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: "2px solid #e2e8f0",
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 3,
    width: "40%",
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: "#475569",
    marginRight: 20,
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 600,
    color: "#0f172a",
    textAlign: "right",
    width: 80,
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 6,
    width: "40%",
    borderTop: "2px solid #0f172a",
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    marginRight: 20,
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    textAlign: "right",
    width: 80,
  },

  // Payment & footer
  paymentSection: {
    marginTop: 30,
    padding: 14,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    fontSize: 9,
    color: "#334155",
  },
  paymentTitle: {
    fontWeight: 600,
    color: "#0f172a",
    marginBottom: 4,
  },
  footer: {
    marginTop: 40,
    paddingTop: 16,
    borderTop: "1px solid #f1f5f9",
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
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
      default:
        return styles.statusDraft
    }
  }

  // For a real invoice, you'd have line items. Here we assume a single line.
  // You can expand this to pass items from a database.
  const lineItems = [
    {
      description: `Translation project #${invoice.project_id.slice(0, 8)}`,
      quantity: 1,
      rate: invoice.amount,
      amount: invoice.amount,
    },
  ]

  const subtotal = invoice.amount
  const tax = 0 // No tax for simplicity – add if needed
  const total = subtotal + tax

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>
              {businessName || "TranslatorTrack"}
            </Text>
            {businessAddress && (
              <Text style={styles.companyAddress}>{businessAddress}</Text>
            )}
          </View>
          <View>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
            <Text style={styles.invoiceMeta}>
              Issued:{" "}
              {invoice.issued_at
                ? new Date(invoice.issued_at).toLocaleDateString()
                : "Not issued yet"}
            </Text>
            <Text style={styles.invoiceMeta}>
              Due:{" "}
              {invoice.due_at
                ? new Date(invoice.due_at).toLocaleDateString()
                : "—"}
            </Text>
            <Text
              style={[styles.statusBadge, getStatusStyle()]}
            >
              {invoice.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.clientSection}>
          <Text style={styles.clientLabel}>Bill To</Text>
          <Text style={styles.clientName}>{invoice.clientName}</Text>
        </View>

        {/* Invoice Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDescription}>Description</Text>
            <Text style={styles.colQuantity}>Qty</Text>
            <Text style={styles.colRate}>Rate</Text>
            <Text style={styles.colAmount}>Amount</Text>
          </View>
          {lineItems.map((item, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.colDescription}>{item.description}</Text>
              <Text style={styles.colQuantity}>{item.quantity}</Text>
              <Text style={styles.colRate}>
                {formatCurrency(item.rate)}
              </Text>
              <Text style={styles.colAmount}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          {tax > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>{formatCurrency(tax)}</Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        {/* Payment Instructions */}
        {paymentInstructions && (
          <View style={styles.paymentSection}>
            <Text style={styles.paymentTitle}>Payment Instructions</Text>
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