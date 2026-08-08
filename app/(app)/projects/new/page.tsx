// app/(app)/projects/new/page.tsx
import { getClients } from "@/lib/db/clients"
import { NewProjectForm } from "@/components/projects/NewProjectForm"

export default async function NewProjectPage() {
  const clients = await getClients()
  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-2">New project</h1>
      <p className="text-slate-mid text-sm mb-8">
        Paste a client message to auto-fill, or enter details manually.
      </p>
      <NewProjectForm clients={clients} />
    </div>
  )
}