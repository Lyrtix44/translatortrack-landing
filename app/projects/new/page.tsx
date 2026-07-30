// app/projects/new/page.tsx
import { getClients } from "@/lib/db/clients"
import { NewProjectForm } from "@/components/projects/NewProjectForm"

export default async function NewProjectPage() {
  const clients = await getClients()

  return (
    <div className="min-h-screen bg-slate-50 pt-28 px-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">New project</h1>
        <p className="text-slate-600 text-sm mb-8">
          Paste a client message to auto-fill, or enter details manually.
        </p>
        <NewProjectForm clients={clients} />
      </div>
    </div>
  )
}