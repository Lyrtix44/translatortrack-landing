// app/(app)/layout.tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardChrome } from "@/components/shell/DashboardChrome"
import { getProjects } from "@/lib/db/projects"  // <-- ADD THIS IMPORT

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, plan")
    .eq("id", user.id)
    .single()

  // ADD THIS BLOCK — fetch projects and count them
  const projects = await getProjects()
  const projectCount = projects.length

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Translator"
  const planLabel = profile?.plan
    ? `${profile.plan.charAt(0).toUpperCase()}${profile.plan.slice(1)} Plan`
    : "Free Plan"

  return (
    <DashboardChrome
      user={{
        name: displayName,
        email: user.email || "",
        plan: planLabel,
        avatarInitial: displayName.charAt(0).toUpperCase(),
      }}
      projectCount={projectCount}  // <-- ADD THIS PROP
    >
      {children}
    </DashboardChrome>
  )
}