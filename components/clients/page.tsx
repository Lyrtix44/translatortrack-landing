// app/clients/page.tsx — the first real client-creation UI in the app
import { getClients } from "@/lib/db/clients"
import { AddClientForm } from "@/components/clients/AddClientForm"

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="min-h-screen bg-paper pt-28 px-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl text-ink mb-8">Clients</h1>

        <div className="bg-white border border-border rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-ink text-sm mb-4">Add a client</h3>
          <AddClientForm />
        </div>

        {clients.length === 0 ? (
          <p className="text-slate-mid text-sm text-center py-8">
            No clients yet — add your first one above.
          </p>
        ) : (
          <div className="space-y-2">
            {clients.map((c) => (
              <div key={c.id} className="bg-white border border-border rounded-xl p-4">
                <p className="text-ink font-medium text-sm">{c.name}</p>
                {c.email && <p className="text-slate-mid text-xs">{c.email}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}