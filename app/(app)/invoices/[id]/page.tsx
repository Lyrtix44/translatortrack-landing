// app/(app)/invoices/[id]/page.tsx
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getInvoiceById } from "@/lib/db/invoices"
import { getProject } from "@/lib/db/projects"
import { Card } from "@/components/ui/card"
import { Badge, INVOICE_STATUS_BADGE } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { InvoiceDetailActions } from "@/components/invoices/InvoiceDetailActions"

// Helper to format currency
const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const invoice = await getInvoiceById(id)
  if (!invoice) notFound()

  const project = await getProject(invoice.project_id)

  const badge = INVOICE_STATUS_BADGE[invoice.status]
  const isOverdue = invoice.status === "overdue"
  const statusOrder = ["draft", "sent", "paid", "overdue"]
  const currentIndex = statusOrder.indexOf(invoice.status)
  const progress = currentIndex >= 0 ? (currentIndex / (statusOrder.length - 1)) * 100 : 0

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/invoices"
        className="inline-flex items-center gap-1 text-sm text-slate-mid hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to invoices
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink mb-1">{invoice.invoice_number}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-mid">
            <span>Issued: {invoice.issued_at ? new Date(invoice.issued_at).toLocaleDateString() : "Not issued"}</span>
            <span>•</span>
            <span>Due: {invoice.due_at ? new Date(invoice.due_at).toLocaleDateString() : "—"}</span>
          </div>
        </div>
        <Badge variant={badge.variant} className="text-sm px-3 py-1">
          {badge.label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">Client</p>
          <p className="text-ink font-medium">{invoice.clientName}</p>
          {invoice.clients?.email && (
            <p className="text-slate-mid text-sm">{invoice.clients.email}</p>
          )}
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">Total</p>
          <p className="font-display text-3xl text-ink">
            {formatCurrency(invoice.amount, invoice.currency)}
          </p>
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h3 className="font-semibold text-ink text-sm mb-4">Invoice Items</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-mid">Translation project</span>
            <span className="text-ink font-medium">{formatCurrency(invoice.amount, invoice.currency)}</span>
          </div>
          {project && (
            <>
              <div className="flex justify-between text-sm text-slate-mid">
                <span>Words: {project.word_count.toLocaleString()}</span>
                <span>Rate: {formatCurrency(project.rate_per_word, invoice.currency)} / word</span>
              </div>
              {project.deadline && (
                <div className="flex justify-between text-sm text-slate-mid">
                  <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </>
          )}
          <div className="h-px bg-border/70 my-2"></div>
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatCurrency(invoice.amount, invoice.currency)}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h3 className="font-semibold text-ink text-sm mb-4">Payment Status</h3>
        <div className="relative flex items-center justify-between px-2">
          <div className="absolute top-3 left-0 right-0 h-[2px] bg-border" />
          <div
            className="absolute top-3 left-0 h-[2px] bg-success transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                currentIndex >= 0
                  ? "bg-success border-success ring-2 ring-success/20"
                  : "bg-white border-slate-mid"
              }`}
            />
            <span className={`text-xs mt-1 ${currentIndex >= 0 ? "text-success font-semibold" : "text-slate-mid"}`}>
              Draft
            </span>
          </div>
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                currentIndex >= 1
                  ? "bg-success border-success ring-2 ring-success/20"
                  : "bg-white border-slate-mid"
              }`}
            />
            <span className={`text-xs mt-1 ${currentIndex >= 1 ? "text-success font-semibold" : "text-slate-mid"}`}>
              Sent
            </span>
          </div>
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                currentIndex >= 2
                  ? "bg-success border-success ring-2 ring-success/20"
                  : "bg-white border-slate-mid"
              }`}
            />
            <span className={`text-xs mt-1 ${currentIndex >= 2 ? "text-success font-semibold" : "text-slate-mid"}`}>
              Paid
            </span>
          </div>
          <div className="flex flex-col items-center z-10">
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                isOverdue
                  ? "bg-danger border-danger ring-2 ring-danger/20"
                  : "bg-white border-slate-mid"
              }`}
            />
            <span className={`text-xs mt-1 ${isOverdue ? "text-danger font-semibold" : "text-slate-mid"}`}>
              {isOverdue ? "Overdue" : "Due"}
            </span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-ink text-sm mb-4">Actions</h3>
        <InvoiceDetailActions invoice={invoice} />
      </Card>
    </div>
  )
}