"use client"
import { useOptimistic, useTransition } from "react"
import { toast } from "sonner"
import { INVOICE_STATUS_BADGE } from "@/components/ui/badge"
import { updateInvoiceStatusAction } from "@/app/actions/invoices"
import type { Invoice, InvoiceStatus } from "@/lib/db/invoices"

interface InvoiceStatusDropdownProps {
  invoice: Invoice
  clientEmail?: string | null
}

export function InvoiceStatusDropdown({ invoice, clientEmail }: InvoiceStatusDropdownProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    invoice.status,
    (_current, newStatus: InvoiceStatus) => newStatus
  )

  const badge = INVOICE_STATUS_BADGE[optimisticStatus]

  const getColorClasses = (variant: string) => {
    switch (variant) {
      case "success": return "bg-success-light text-success"
      case "warning": return "bg-warning-light text-warning"
      case "info": return "bg-info-light text-info"
      case "danger": return "bg-danger-light text-danger"
      default: return "bg-paper-dark text-slate-mid"
    }
  }

  async function handleChange(newStatus: InvoiceStatus) {
    // If changing to "sent" and no email, ask for confirmation
    if (newStatus === "sent" && !clientEmail) {
      const shouldProceed = window.confirm(
        "This client has no email address. Mark as sent anyway?"
      )
      if (!shouldProceed) return
    }

    startTransition(async () => {
      setOptimisticStatus(newStatus)

      // Just update the status – email sending is handled by the Email column
      const ok = await updateInvoiceStatusAction(invoice.id, newStatus)
      if (!ok) {
        toast.error("Couldn't update status.")
        setOptimisticStatus(invoice.status)
        return
      }
      toast.success(`Invoice marked as ${newStatus}.`)
    })
  }

  // Determine if "Draft" should be disabled: when email has been sent
  const isDraftDisabled = !!invoice.email_sent_at

  return (
    <select
      value={optimisticStatus}
      onChange={(e) => handleChange(e.target.value as InvoiceStatus)}
      disabled={isPending}
      className={`
        text-xs font-semibold pl-2.5 pr-1.5 py-1 rounded-full border-0 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-amber disabled:opacity-60
        ${getColorClasses(badge.variant)}
      `}
    >
      {Object.entries(INVOICE_STATUS_BADGE).map(([key, value]) => {
        const isDisabled = key === "draft" && isDraftDisabled
        return (
          <option key={key} value={key} disabled={isDisabled}>
            {value.label} {isDisabled ? "(locked)" : ""}
          </option>
        )
      })}
    </select>
  )
}