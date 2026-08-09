// components/shell/DashboardChrome.tsx
"use client"
import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"

interface DashboardChromeProps {
  children: React.ReactNode
  user: { name: string; email: string; plan: string; avatarInitial: string }
  projectCount: number  // <-- ADD THIS
}

export function DashboardChrome({ children, user, projectCount }: DashboardChromeProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-paper">
      <Sidebar isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} projectCount={projectCount} />
      <Topbar onMenuClick={() => setMobileNavOpen(true)} user={user} />
      <main className="lg:pl-sidebar pt-topbar min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}