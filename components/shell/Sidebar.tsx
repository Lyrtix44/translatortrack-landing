// components/shell/Sidebar.tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Languages, Receipt, Users, Settings, HelpCircle, X } from "lucide-react"

type NavItem = {
  href: string
  label: string
  icon: any
  badge?: number  // badge is now a number, not a boolean
}

const BASE_NAV_ITEMS: Omit<NavItem, "badge">[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: Languages },
  { href: "/invoices", label: "Invoices", icon: Receipt },
  { href: "/clients", label: "Clients", icon: Users },
]

export function Sidebar({
  isOpen,
  onClose,
  projectCount,
}: {
  isOpen: boolean
  onClose: () => void
  projectCount: number
}) {
  const pathname = usePathname()

  // Build nav items with dynamic badge
  const NAV_ITEMS: NavItem[] = BASE_NAV_ITEMS.map((item) => {
    if (item.label === "Projects") {
      return { ...item, badge: projectCount > 0 ? projectCount : undefined }
    }
    return { ...item, badge: undefined }
  })

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-sidebar bg-ink flex flex-col z-50 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <Link href="/dashboard" className="font-display text-lg text-white tracking-tight">
            Translator<span className="text-amber">Track</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-sidebar-text hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded text-sm font-medium transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-sidebar-text hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-amber rounded-r-full" />
                  )}
                  <Icon size={18} strokeWidth={isActive ? 2.25 : 1.75} />
                  {item.label}
                </span>
                {item.badge !== undefined && (
                  <span className="text-[11px] font-semibold bg-white/10 text-white px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-3 border-t border-white/10 shrink-0">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-sidebar-text hover:bg-white/5 hover:text-white transition-colors"
          >
            <Settings size={18} strokeWidth={1.75} />
            Settings
          </Link>
        </div>

        <div className="px-3 py-3 border-t border-white/10 shrink-0">
          <Link
            href="/help"
            className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-sidebar-text hover:bg-white/5 hover:text-white transition-colors"
          >
            <HelpCircle size={18} strokeWidth={1.75} />
            Help &amp; FAQ
          </Link>
        </div>
      </aside>
    </>
  )
}