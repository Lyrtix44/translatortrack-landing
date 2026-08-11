"use client"
import { useTransition } from "react"
import { toast } from "sonner"
import { Mail, MailCheck, Loader2 } from "lucide-react"
import { markInvoiceSentAndEmailAction } from "@/app/actions/invoices"
import type { Invoice } from "@/lib/db/invoices"

interface EmailStatusButtonProps {
  invoice: Invoice
  clientName?: string | null
  clientEmail?: string | null
}

export function EmailStatusButton({ invoice, clientName, clientEmail }: EmailStatusButtonProps) {
  const [isPending, startTransition] = useTransition()

  const isSent = !!invoice.email_sent_at

  function handleSendViaMailto() {
    if (!clientEmail) {
      toast.error("Client has no email address.")
      return
    }

    // Build mailto link
    const subject = encodeURIComponent(`Invoice ${invoice.invoice_number}`)
    const pdfLink = `${window.location.origin}/api/invoices/${invoice.id}/pdf`
    const body = encodeURIComponent(
      `Dear ${clientName || "Client"},\n\n` +
      `Please find your invoice ${invoice.invoice_number} attached.\n\n` +
      `You can download it here: ${pdfLink}\n\n` +
      `If you have any questions, please reply to this email.\n\n` +
      `Thank you,\nTranslatorTrack`
    )
    const mailtoLink = `mailto:${clientEmail}?subject=${subject}&body=${body}`

    // Open mail client
    window.open(mailtoLink, "_blank")

    // Mark invoice as sent (optimistic update)
    startTransition(async () => {
      const result = await markInvoiceSentAndEmailAction(invoice.id)
      if (result.success) {
        toast.success(`Invoice ${invoice.invoice_number} marked as sent.`)
      } else {
        toast.error(result.error || "Failed to mark as sent.")
      }
    })
  }

  if (isSent) {
    const sentDate = invoice.email_sent_at
      ? new Date(invoice.email_sent_at).toLocaleDateString()
      : ""

    return (
      <span
        className="text-success flex items-center gap-1 text-sm font-medium"
        title={sentDate ? `Sent on ${sentDate}` : "Sent"}
      >
        <MailCheck size={16} /> Sent
      </span>
    )
  }

  return (
    <button
      onClick={handleSendViaMailto}
      disabled={isPending}
      className="text-slate-mid hover:text-ink transition-colors disabled:opacity-50"
      title="Send invoice email via your default email client"
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
    </button>
  )
}