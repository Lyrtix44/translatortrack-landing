// app/dashboard/page.tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="pt-32 px-6 pb-20 min-h-screen bg-paper">
      <h1 className="font-display text-3xl text-ink">
        Welcome, {user.user_metadata?.full_name?.split(" ")[0] || "translator"}.
      </h1>
      <p className="text-slate-mid mt-2">
        This is your protected dashboard. If you can see this, authentication is working.
      </p>
    </div>
  )
}