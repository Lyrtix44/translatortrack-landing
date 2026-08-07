// components/shell/ProfileDropdown.tsx
"use client"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  LayoutDashboard,
  Languages,
  Receipt,
  Users,
  User,
  Palette,
  CreditCard,
  HelpCircle,
  MessageSquare,
  Sparkles,
  LogOut,
  type LucideIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ProfileDropdownProps {
  user: { name: string; email: string; plan: string; avatarInitial: string }
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Close on outside click or Escape — the two behaviors explicitly required
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const firstName = user.name.split(" ")[0]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full hover:bg-paper-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center text-white text-xs font-semibold shrink-0">
          {user.avatarInitial}
        </div>
        <span className="hidden sm:block text-sm font-medium text-ink">{firstName}</span>
        <ChevronDown
          size={16}
          className={`text-slate-mid transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-72 bg-white rounded-lg border border-border shadow-dropdown overflow-hidden z-50"
        >
          {/* Header block */}
          <div className="px-4 py-4 flex items-center gap-3 border-b border-border">
            <div className="w-11 h-11 rounded-full bg-ink flex items-center justify-center text-white text-base font-semibold shrink-0">
              {user.avatarInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
              <p className="text-xs text-slate-mid truncate">{user.email}</p>
            </div>
          </div>
          <div className="px-4 py-2.5 border-b border-border">
            <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-light text-amber-hover">
              {user.plan}
            </span>
          </div>

          {/* Quick Links */}
          <div className="py-1.5 border-b border-border">
            <DropdownLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" onNavigate={() => setIsOpen(false)} />
            <DropdownLink href="/projects" icon={Languages} label="My Projects" onNavigate={() => setIsOpen(false)} />
            <DropdownLink href="/invoices" icon={Receipt} label="My Invoices" onNavigate={() => setIsOpen(false)} />
            <DropdownLink href="/clients" icon={Users} label="My Clients" onNavigate={() => setIsOpen(false)} />
          </div>

          {/* Settings */}
          <div className="py-1.5 border-b border-border">
            <DropdownLink href="/settings/account" icon={User} label="Account Settings" onNavigate={() => setIsOpen(false)} />
            <DropdownLink href="/settings/branding" icon={Palette} label="Invoice Branding" onNavigate={() => setIsOpen(false)} />
            <DropdownLink href="/settings/billing" icon={CreditCard} label="Billing & Plan" onNavigate={() => setIsOpen(false)} />
          </div>

          {/* Help */}
          <div className="py-1.5 border-b border-border">
            <DropdownLink href="/help" icon={HelpCircle} label="Help Center" onNavigate={() => setIsOpen(false)} />
            <DropdownLink href="/feedback" icon={MessageSquare} label="Send Feedback" onNavigate={() => setIsOpen(false)} />
            <DropdownLink href="/whats-new" icon={Sparkles} label="What's New" onNavigate={() => setIsOpen(false)} />
          </div>

          {/* Sign out — danger style */}
          <div className="py-1.5">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-danger-light transition-colors"
              role="menuitem"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function DropdownLink({
  href,
  icon: Icon,
  label,
  onNavigate,
}: {
  href: string
  icon: LucideIcon
  label: string
  onNavigate: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-paper-dark transition-colors"
      role="menuitem"
    >
      <Icon size={16} className="text-slate-mid" />
      {label}
    </Link>
  )
}