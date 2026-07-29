"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/AuthProvider"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function NavAuthButtons() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return <div className="w-24 h-9 bg-paper-dark rounded-lg animate-pulse" />
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-sm text-ink font-medium hidden md:block">
          {user.user_metadata?.full_name?.split(" ")[0] || "Dashboard"}
        </Link>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="text-slate-mid hover:text-ink text-sm"
        >
          Sign out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="hidden md:inline-flex text-slate-mid hover:text-ink text-sm font-medium bg-transparent border-none cursor-pointer"
      >
        Sign in
      </button>
      <button
        type="button"
        onClick={() => router.push("/signup")}
        className="bg-ink hover:bg-ink-light text-white font-semibold text-sm px-5 py-2 rounded-lg border-none cursor-pointer"
      >
        Get started →
      </button>
    </div>
  )
}