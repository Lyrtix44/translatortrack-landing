// components/shell/DashboardChrome.tsx
"use client"
import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"

interface DashboardChromeProps {
  children: React.ReactNode
  user: { name: string; email: string; plan: string; avatarInitial: string }
}

export function DashboardChrome({ children, user }: DashboardChromeProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-paper">
      <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <Topbar onMenuClick={() => setMobileNavOpen(true)} user={user} />
      <main className="lg:pl-sidebar pt-topbar min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}