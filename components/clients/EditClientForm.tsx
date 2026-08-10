// components/clients/EditClientForm.tsx
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { updateClientAction } from "@/app/actions/clients"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import type { Client } from "@/lib/db/clients"

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"]

interface EditClientFormProps {
  client: Client
}

export function EditClientForm({ client }: EditClientFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const result = await updateClientAction(client.id, formData)
    setSubmitting(false)

    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Client updated successfully.")
    router.push("/clients")
    router.refresh()
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
            Client name *
          </label>
          <Input
            name="name"
            required
            defaultValue={client.name}
            placeholder="Client name"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
            Email
          </label>
          <Input
            name="email"
            type="email"
            defaultValue={client.email || ""}
            placeholder="client@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
            Default rate (per word)
          </label>
          <Input
            name="default_rate"
            type="number"
            step="0.01"
            defaultValue={client.default_rate ?? ""}
            placeholder="0.10"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
            Currency
          </label>
          <select
            name="currency"
            defaultValue={client.currency || "USD"}
            className="w-full border border-border rounded px-4 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            variant="primary"
            size="lg"
            className="flex-1"
          >
            {submitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  )
}