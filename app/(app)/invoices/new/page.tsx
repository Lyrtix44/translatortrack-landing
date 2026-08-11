// app/(app)/invoices/new/page.tsx
// app/(app)/invoices/new/page.tsx
import { getProjects } from "@/lib/db/projects"
import { GenerateInvoiceList } from "@/components/invoices/GenerateInvoiceList"

export default async function NewInvoicePage() {
  const projects = await getProjects({ status: "delivered" })
  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-2">Generate invoice</h1>
      <p className="text-slate-mid text-sm mb-8">
        Pick a delivered project — the invoice pre-fills from its details.
      </p>
      <GenerateInvoiceList projects={projects} />
    </div>
  )
}