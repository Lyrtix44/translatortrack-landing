// app/(app)/clients/[id]/edit/page.tsx
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getClient } from "@/lib/db/clients"
import { EditClientForm } from "@/components/clients/EditClientForm"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const client = await getClient(id)
  if (!client) notFound()

  return (
    <div className="max-w-2xl">
      <Link
        href="/clients"
        className="inline-flex items-center gap-1 text-sm text-slate-mid hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to clients
      </Link>

      <h1 className="font-display text-3xl text-ink mb-2">Edit Client</h1>
      <p className="text-slate-mid text-sm mb-8">
        Update client details below.
      </p>

      <EditClientForm client={client} />
    </div>
  )
}