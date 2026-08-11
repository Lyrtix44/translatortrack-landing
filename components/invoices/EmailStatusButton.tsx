// components/invoices/EmailStatusButton.tsx
"use client"
import { useTransition } from "react"
import { toast } from "sonner"
import { Mail, MailCheck, Loader2 } from "lucide-react"
import { sendInvoiceAction } from "@/app/actions/invoices"
import type { Invoice } from "@/lib/db/invoices"

interface EmailStatusButtonProps {
  invoice: Invoice
  clientEmail?: string | null
}

export function EmailStatusButton({ invoice, clientEmail }: EmailStatusButtonProps) {
  const [isPending, startTransition] = useTransition()

  // Check if email has been sent (email_sent_at is not null)
  const isSent = !!invoice.email_sent_at

  async function handleSend() {
    if (!clientEmail) {
      toast.error("Client has no email address.")
      return
    }

    startTransition(async () => {
      const result = await sendInvoiceAction(invoice.id)
      if (result.success) {
        toast.success(`Invoice sent to ${clientEmail}`)
      } else {
        toast.error(result.error || "Failed to send email.")
      }
    })
  }

  // If already sent, show a green "Sent" label with a checkmark
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

  // Otherwise, show a mail icon button
  return (
    <button
      onClick={handleSend}
      disabled={isPending}
      className="text-slate-mid hover:text-ink transition-colors disabled:opacity-50"
      title="Send invoice email"
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
    </button>
  )
}