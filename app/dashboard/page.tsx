// app/dashboard/page.tsx — replaces the Week 6 placeholder for good
import { createClient } from "@/lib/supabase/server"
import { getProjects } from "@/lib/db/projects"
import { getClients } from "@/lib/db/clients"
import { ProjectStatusSelect } from "@/components/dashboard/ProjectStatusSelect.server"
import { EmptyProjectsState } from "@/components/dashboard/EmptyProjectsState"
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [projects, clients] = await Promise.all([getProjects(), getClients()])

  const checklistItems = [
    { label: "Add your first client", done: clients.length > 0, href: "/clients" },
    { label: "Create your first project", done: projects.length > 0, href: "/projects/new" },
    {
      label: "Send your first invoice",
      done: projects.some((p) => p.status === "invoiced" || p.status === "paid"),
      href: "/dashboard",
    },
  ]

  return (
    <div className="min-h-screen bg-paper pt-28 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-ink">
            Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "translator"}.
          </h1>
          <Link
            href="/projects/new"
            className="bg-ink hover:bg-ink-light text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            + New project
          </Link>
        </div>

        <OnboardingChecklist items={checklistItems} />

        {projects.length === 0 ? (
          <EmptyProjectsState />
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-border rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-ink font-medium text-sm">{project.title}</p>
                  <p className="text-slate-mid text-xs mt-0.5">
                    {project.clients?.name} · {project.word_count.toLocaleString()} words · $
                    {project.invoice_total.toFixed(2)}
                  </p>
                </div>
                <ProjectStatusSelect projectId={project.id} status={project.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}