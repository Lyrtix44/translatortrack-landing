// app/(app)/projects/[id]/edit/page.tsx
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProject } from "@/lib/db/projects"
import { getClients } from "@/lib/db/clients"
import { EditProjectForm } from "@/components/projects/EditProjectForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const project = await getProject(id)
  if (!project) notFound()

  const clients = await getClients()

  return (
    <div className="max-w-2xl">
      <Link
        href={`/projects/${id}`}
        className="inline-flex items-center gap-1 text-sm text-slate-mid hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to project
      </Link>

      <h1 className="font-display text-3xl text-ink mb-2">Edit Project</h1>
      <p className="text-slate-mid text-sm mb-8">
        Update the project details below.
      </p>

      <EditProjectForm project={project} clients={clients} />
    </div>
  )
}