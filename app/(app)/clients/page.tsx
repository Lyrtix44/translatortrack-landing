// app/(app)/clients/page.tsx
import { Users } from "lucide-react"
import { getClients } from "@/lib/db/clients"
import { getProjects } from "@/lib/db/projects"
import { AddClientForm } from "@/components/clients/AddClientForm"
import { Card } from "@/components/ui/card"

export default async function ClientsPage() {
  const [clients, projects] = await Promise.all([getClients(), getProjects()])

  const projectCountByClient = new Map<string, number>()
  for (const p of projects) {
    projectCountByClient.set(p.client_id, (projectCountByClient.get(p.client_id) ?? 0) + 1)
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Clients</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1 h-fit">
          <h3 className="font-semibold text-ink text-sm mb-4">Add a client</h3>
          <AddClientForm />
        </Card>

        <div className="lg:col-span-2">
          {clients.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-lg bg-white">
              <Users size={32} className="text-slate-mid/40 mx-auto mb-3" />
              <p className="text-slate-mid text-sm">No clients yet — add your first one.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {clients.map((c) => {
                const count = projectCountByClient.get(c.id) ?? 0
                return (
                  <Card key={c.id} hoverable className="p-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-ink font-medium text-sm truncate">{c.name}</p>
                      {c.email && <p className="text-slate-mid text-xs truncate">{c.email}</p>}
                    </div>
                    <span className="text-xs text-slate-mid shrink-0 ml-3">
                      {count} {count === 1 ? "project" : "projects"}
                    </span>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}