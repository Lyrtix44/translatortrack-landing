// components/shell/Topbar.tsx
"use client"
import { Menu, Search, Bell } from "lucide-react"
import { ProfileDropdown } from "./ProfileDropdown"

interface TopbarUser {
  name: string
  email: string
  plan: string
  avatarInitial: string
}

export function Topbar({
  onMenuClick,
  user,
  hasUnreadNotifications = true,
}: {
  onMenuClick: () => void
  user: TopbarUser
  hasUnreadNotifications?: boolean
}) {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-sidebar h-topbar bg-white border-b border-border z-30 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-ink p-1.5 -ml-1.5 rounded hover:bg-paper-dark transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Search — hidden on small screens per spec */}
        <div className="hidden md:flex items-center bg-paper border border-border rounded-lg px-3 py-2 max-w-xs w-full">
          <Search size={16} className="text-slate-mid shrink-0" />
          <input
            type="text"
            placeholder="Search projects, clients, invoices..."
            className="bg-transparent border-none outline-none text-sm text-ink placeholder-slate-mid/70 ml-2 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          className="relative p-2 rounded-full hover:bg-paper-dark transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-ink" />
          {hasUnreadNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
          )}
        </button>

        <ProfileDropdown user={user} />
      </div>
    </header>
  )
}