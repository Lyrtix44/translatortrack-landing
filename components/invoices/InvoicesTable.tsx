"use client"
import { useState, useMemo } from "react"
import Link from "next/link"
import { Plus, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InvoiceStatusDropdown } from "./InvoiceStatusDropdown"
import { EmailStatusButton } from "./EmailStatusButton"
import type { Invoice, InvoiceStatus } from "@/lib/db/invoices"

type InvoiceWithClient = Invoice & { clientName: string; clients?: { email: string | null } | null }

const STATUS_TABS: { key: InvoiceStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "draft", label: "Draft" },
  { key: "sent", label: "Sent" },
  { key: "paid", label: "Paid" },
  { key: "overdue", label: "Overdue" },
]

function DownloadButton({ invoice }: { invoice: Invoice }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => window.open(`/api/invoices/${invoice.id}/pdf`, "_blank")}
      title="Download PDF"
    >
      <Download size={14} />
    </Button>
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
              <th className="text-center font-medium text-slate-mid px-4 py-3">Email</th>
              <th className="text-center font-medium text-slate-mid px-4 py-3">PDF</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-paper/50 transition-colors">
                <td className="px-4 py-3 font-medium text-ink">{inv.invoice_number}</td>
                <td className="px-4 py-3 text-ink">{inv.clientName}</td>
                <td className="px-4 py-3 text-ink font-medium">${inv.amount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <InvoiceStatusDropdown
                    invoice={inv}
                    clientEmail={inv.clients?.email ?? null}
                  />
                </td>
                <td className="px-4 py-3 text-slate-mid">
                  {inv.due_at
                    ? new Date(inv.due_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                    : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <EmailStatusButton
                    invoice={inv}
                    clientName={inv.clientName}
                    clientEmail={inv.clients?.email ?? null}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <DownloadButton invoice={inv} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-mid text-sm">No invoices here.</div>
        )}
      </div>

      <div className="md:hidden space-y-2">
        {filtered.map((inv) => (
          <Card key={inv.id} className="p-4">
            <div className="flex items-start justify-between mb-1">
              <p className="font-medium text-ink text-sm">{inv.invoice_number}</p>
              <InvoiceStatusDropdown
                invoice={inv}
                clientEmail={inv.clients?.email ?? null}
              />
            </div>
            <p className="text-xs text-slate-mid">{inv.clientName}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-ink font-medium text-sm">${inv.amount.toFixed(2)}</span>
              <div className="flex items-center gap-2">
                <EmailStatusButton
                  invoice={inv}
                  clientName={inv.clientName}
                  clientEmail={inv.clients?.email ?? null}
                />
                <DownloadButton invoice={inv} />
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-mid text-sm">No invoices here.</div>
        )}
      </div>
    </div>
  )
}