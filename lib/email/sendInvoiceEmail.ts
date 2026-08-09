// lib/email/sendInvoiceEmail.ts
import { resend, FROM_EMAIL } from "./resend"
import type { Invoice } from "@/lib/db/invoices"

interface SendInvoiceEmailProps {
  invoice: Invoice & { clientName: string }
  clientEmail: string
  pdfBuffer: Buffer
  businessName?: string | null
}

export async function sendInvoiceEmail({
  invoice,
  clientEmail,
  pdfBuffer,
  businessName,
}: SendInvoiceEmailProps) {
  if (!clientEmail) {
    throw new Error("Client email is required.")
  }

  const dueDate = invoice.due_at
    ? new Date(invoice.due_at).toLocaleDateString()
    : "Not set"

  const subject = `Invoice ${invoice.invoice_number} from ${businessName || "TranslatorTrack"}`

  const html = `
    <h2>Invoice ${invoice.invoice_number}</h2>
    <p>Dear ${invoice.clientName},</p>
    <p>Please find attached invoice ${invoice.invoice_number} for translation services.</p>
    <p><strong>Amount:</strong> ${invoice.currency || "USD"} ${invoice.amount.toFixed(2)}</p>
    <p><strong>Due date:</strong> ${dueDate}</p>
    <p>If you have any questions, please reply to this email.</p>
    <p>Thank you,<br/>${businessName || "TranslatorTrack"}</p>
  `

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: clientEmail,
    subject,
    html,
    attachments: [
      {
        filename: `${invoice.invoice_number}.pdf`,
        content: pdfBuffer.toString("base64"),
        contentType: "application/pdf",
      },
    ],
  })

  if (error) {
    console.error("Resend error:", error)
    throw new Error("Failed to send email.")
  }

  return data
}