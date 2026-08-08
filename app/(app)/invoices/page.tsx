// app/(app)/invoices/page.tsx
import { getInvoices } from "@/lib/db/invoices"
import { InvoicesTable } from "@/components/invoices/InvoicesTable"

export default async function InvoicesPage() {
  const invoices = await getInvoices()
  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-6">Invoices</h1>
      <InvoicesTable invoices={invoices} />
    </div>
  )
}