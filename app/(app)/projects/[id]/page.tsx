// app/(app)/projects/[id]/page.tsx
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getProject } from "@/lib/db/projects"
import { getInvoicesByProject } from "@/lib/db/invoices"
import { ProjectStatusBadge } from "@/components/projects/ProjectStatusBadge"
import { Card } from "@/components/ui/card"
import { Badge, INVOICE_STATUS_BADGE } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, FileText, DollarSign, ArrowLeft } from "lucide-react"

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const project = await getProject(params.id)
  if (!project) notFound()

  const invoices = await getInvoicesByProject(params.id)

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: project.currency || "USD",
    }).format(amount)

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-sm text-slate-mid hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to projects
      </Link>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink mb-1">{project.title}</h1>
          <div className="flex items-center gap-3 text-sm text-slate-mid">
            <span>{project.source_language} → {project.target_language}</span>
            <span>•</span>
            <span>{project.word_count.toLocaleString()} words</span>
          </div>
        </div>
        <ProjectStatusBadge projectId={project.id} status={project.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-ink text-sm mb-4">Project Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-mid">Rate per word</span>
                <span className="text-ink font-medium">{formatCurrency(project.rate_per_word)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-mid">Total invoice</span>
                <span className="text-ink font-medium">{formatCurrency(project.invoice_total)}</span>
              </div>
              {project.deadline && (
                <div className="flex justify-between">
                  <span className="text-slate-mid">Deadline</span>
                  <span className="text-ink font-medium">
                    {new Date(project.deadline).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-mid">Created</span>
                <span className="text-ink font-medium">
                  {new Date(project.created_at).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </Card>

          {/* Invoices */}
          {invoices.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-ink text-sm mb-4">Invoices</h3>
              <div className="space-y-2">
                {invoices.map((inv) => {
                  const badge = INVOICE_STATUS_BADGE[inv.status]
                  return (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between p-3 bg-paper rounded border border-border"
                    >
                      <div>
                        <p className="text-sm font-medium text-ink">{inv.invoice_number}</p>
                        <p className="text-xs text-slate-mid">
                          {new Date(inv.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-ink">
                          {formatCurrency(inv.amount)}
                        </span>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar: Client info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-ink text-sm mb-4">Client</h3>
            {project.clients ? (
              <div className="space-y-2 text-sm">
                <p className="font-medium text-ink">{project.clients.name}</p>
                {project.clients.email && (
                  <p className="text-slate-mid">{project.clients.email}</p>
                )}
                {project.clients.contact_name && (
                  <p className="text-slate-mid">Contact: {project.clients.contact_name}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-mid">No client information</p>
            )}
          </Card>

          {/* Quick actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-ink text-sm mb-4">Actions</h3>
            <div className="space-y-2">
              {project.status === "delivered" && (
                <Link href={`/invoices/new`} className="block">
                  <Button variant="primary" size="sm" className="w-full">
                    <FileText size={16} />
                    Generate invoice
                  </Button>
                </Link>
              )}
              <Link href={`/projects/${project.id}/edit`} className="block">
                <Button variant="secondary" size="sm" className="w-full">
                  Edit project
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}