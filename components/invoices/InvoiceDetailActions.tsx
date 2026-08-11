// components/invoices/InvoiceDetailActions.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download, Mail, CheckCircle2 } from "lucide-react"
import { markInvoicePaidFormAction } from "@/app/actions/invoices"

export function InvoiceDetailActions({ invoice }: { invoice: any }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="primary"
        size="sm"
        onClick={() => window.open(`/api/invoices/${invoice.id}/pdf`, "_blank")}
      >
        <Download size={16} className="mr-1.5" />
        Download PDF
      </Button>
      {invoice.status === "draft" && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            const clientEmail = invoice.clients?.email
            if (!clientEmail) {
              alert("Client has no email address.")
              return
            }
            const subject = encodeURIComponent(`Invoice ${invoice.invoice_number}`)
            const pdfLink = `${window.location.origin}/api/invoices/${invoice.id}/pdf`
            const body = encodeURIComponent(
              `Dear ${invoice.clientName},\n\n` +
              `Please find your invoice ${invoice.invoice_number} attached.\n\n` +
              `You can download it here: ${pdfLink}\n\n` +
              `Thank you,\nTranslatorTrack`
            )
            window.open(`mailto:${clientEmail}?subject=${subject}&body=${body}`, "_blank")
          }}
        >
          <Mail size={16} className="mr-1.5" />
          Send Email
        </Button>
      )}
      {(invoice.status === "sent" || invoice.status === "overdue") && (
        <form action={markInvoicePaidFormAction}>
          <input type="hidden" name="invoiceId" value={invoice.id} />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="bg-success hover:bg-success/90 text-white border-success"
          >
            <CheckCircle2 size={16} className="mr-1.5" />
            Mark as Paid
          </Button>
        </form>
      )}
      <Link href={`/projects/${invoice.project_id}`}>
        <Button variant="ghost" size="sm">View Project</Button>
      </Link>
    </div>
  )
}