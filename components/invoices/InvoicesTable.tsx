// components/invoices/InvoicesTable.tsx
"use client"
import { useState, useMemo, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Send, CheckCircle2, Plus, Download } from "lucide-react"  // added Download
import { Button } from "@/components/ui/button"
import { Badge, INVOICE_STATUS_BADGE } from "@/components/ui/badge"
import { markInvoiceSentAction, markInvoicePaidAction } from "@/app/actions/invoices"
import type { Invoice, InvoiceStatus } from "@/lib/db/invoices"

type InvoiceWithClient = Invoice & { clientName: string }

const STATUS_TABS: { key: InvoiceStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "sent", label: "Sent" },
  { key: "paid", label: "Paid" },
  { key: "overdue", label: "Overdue" },
]

// InvoiceActions now includes a download button for every invoice
function InvoiceActions({ invoice, size = "sm" }: { invoice: Invoice; size?: "sm" | "md" }) {
  const [isPending, startTransition] = useTransition()

  function handleSend() {
    startTransition(async () => {
      const ok = await markInvoiceSentAction(invoice.id)
      if (ok) toast.success(`${invoice.invoice_number} marked as sent.`)
      else toast.error("Couldn't update the invoice.")
    })
  }

  function handleMarkPaid() {
    startTransition(async () => {
      const ok = await markInvoicePaidAction(invoice.id)
      if (ok) toast.success(`${invoice.invoice_number} marked as paid.`)
      else toast.error("Couldn't update the invoice.")
    })
  }

  // Download button is always shown
  const downloadButton = (
    <Button
      variant="ghost"
      size={size}
      onClick={() => window.open(`/api/invoices/${invoice.id}/pdf`, "_blank")}
    >
      <Download size={14} />
    </Button>
  )

  // Status-specific action button
  let statusButton = null
  if (invoice.status === "draft") {
    statusButton = (
      <Button variant="ghost" size={size} onClick={handleSend} disabled={isPending}>
        <Send size={14} /> Send
      </Button>
    )
  } else if (invoice.status === "sent" || invoice.status === "overdue") {
    statusButton = (
      <Button variant="ghost" size={size} onClick={handleMarkPaid} disabled={isPending}>
        <CheckCircle2 size={14} /> Mark paid
      </Button>
    )
  }

  // Return both buttons in a flex container
  return (
    <div className="flex items-center gap-1 justify-end">
      {downloadButton}
      {statusButton}
    </div>
  )
}

export function InvoicesTable({ invoices }: { invoices: InvoiceWithClient[] }) {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all")

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: invoices.length }
    for (const inv of invoices) c[inv.status] = (c[inv.status] ?? 0) + 1
    return c
  }, [invoices])

  const filtered = statusFilter === "all" ? invoices : invoices.filter((inv) => inv.status === statusFilter)

  return (
    <div>
      <div className="flex items-center gap-1 mb-4 border-b border-border overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              statusFilter === tab.key ? "border-amber text-ink" : "border-transparent text-slate-mid hover:text-ink"
            }`}
          >
            {tab.label} <span className="text-xs text-slate-mid/70">{counts[tab.key] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <Link href="/invoices/new">
          <Button variant="primary" size="md">
            <Plus size={16} />
            Generate invoice
          </Button>
        </Link>
      </div>

      <div className="hidden md:block bg-white border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-paper">
              <th className="text-left font-medium text-slate-mid px-4 py-3">Invoice</th>
              <th className="text-left font-medium text-slate-mid px-4 py-3">Client</th>
              <th className="text-left font-medium text-slate-mid px-4 py-3">Amount</th>
              <th className="text-left font-medium text-slate-mid px-4 py-3">Status</th>
              <th className="text-left font-medium text-slate-mid px-4 py-3">Due</th>
              <th className="text-right font-medium text-slate-mid px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => {
              const badge = INVOICE_STATUS_BADGE[inv.status]
              return (
                <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-paper/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-ink">{inv.invoice_number}</td>
                  <td className="px-4 py-3 text-ink">{inv.clientName}</td>
                  <td className="px-4 py-3 text-ink font-medium">${inv.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-mid">
                    {inv.due_at
                      ? new Date(inv.due_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <InvoiceActions invoice={inv} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-mid text-sm">No invoices here.</div>}
      </div>

      <div className="md:hidden space-y-2">
        {filtered.map((inv) => {
          const badge = INVOICE_STATUS_BADGE[inv.status]
          return (
            <div key={inv.id} className="bg-white border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-1">
                <p className="font-medium text-ink text-sm">{inv.invoice_number}</p>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
              <p className="text-xs text-slate-mid">{inv.clientName}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-ink font-medium text-sm">${inv.amount.toFixed(2)}</span>
                <InvoiceActions invoice={inv} />
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <div className="text-center py-12 text-slate-mid text-sm">No invoices here.</div>}
      </div>
    </div>
  )
}