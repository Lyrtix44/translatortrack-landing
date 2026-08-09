// components/invoices/GenerateInvoiceList.tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateInvoiceAction } from "@/app/actions/invoices"
import type { Project } from "@/lib/db/projects"

export function GenerateInvoiceList({ projects }: { projects: Project[] }) {
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const router = useRouter()

  async function handleGenerate(projectId: string) {
    setGeneratingId(projectId)
    const { invoice, error } = await generateInvoiceAction(projectId)
    setGeneratingId(null)

    if (error || !invoice) {
      toast.error(error || "Couldn't generate the invoice.")
      return
    }
    toast.success(`${invoice.invoice_number} created as a draft.`)
    router.push("/invoices")
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-lg bg-white">
        <FileText size={32} className="text-slate-mid/40 mx-auto mb-3" />
        <p className="text-slate-mid text-sm">
          No delivered projects waiting to be invoiced. Mark a project &ldquo;Delivered&rdquo; from the
          Projects page first.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-w-2xl">
      {projects.map((p) => (
        <Card key={p.id} className="p-4 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-ink font-medium text-sm truncate">{p.title}</p>
            <p className="text-xs text-slate-mid">
              {p.clients?.name} · {p.word_count.toLocaleString()} words · ${p.invoice_total.toFixed(2)}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleGenerate(p.id)}
            disabled={generatingId === p.id}
            className="shrink-0 ml-3"
          >
            {generatingId === p.id ? "Generating..." : "Generate"}
          </Button>
        </Card>
      ))}
    </div>
  )
}