// app/(app)/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server"
import { getProjects, getDashboardStats, getRevenueByClient } from "@/lib/db/projects"
import { getOutstandingPayments } from "@/lib/db/invoices"
import { FileText, DollarSign, Clock, Languages } from "lucide-react"
import { StatCard } from "@/components/dashboard/StatCard"
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines"
import { RevenueByClientChart } from "@/components/dashboard/RevenueByClientChart"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { FloatingActionButton } from "@/components/dashboard/FloatingActionButton"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [stats, projects, revenueByClient, outstanding] = await Promise.all([
    getDashboardStats(),
    getProjects(),
    getRevenueByClient(),
    getOutstandingPayments(),
  ])

  const upcomingDeadlines = projects
    .filter((p) => p.deadline && p.status !== "paid" && p.status !== "delivered")
    .slice(0, 5)

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there"

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink mb-1">Dashboard</h1>
        <p className="text-slate-mid text-sm">Welcome back, {firstName}.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Words This Month"
          value={stats.wordsThisMonth.toLocaleString()}
          icon={FileText}
          trend={
            stats.wordsChange !== null
              ? { direction: stats.wordsChange >= 0 ? "up" : "down", value: `${Math.abs(stats.wordsChange)}% vs last month` }
              : undefined
          }
        />
        <StatCard
          label="Revenue This Month"
          value={`$${stats.revenueThisMonth.toLocaleString()}`}
          icon={DollarSign}
          trend={
            stats.revenueChange !== null
              ? { direction: stats.revenueChange >= 0 ? "up" : "down", value: `${Math.abs(stats.revenueChange)}% vs last month` }
              : undefined
          }
        />
        <StatCard
          label="Outstanding Payments"
          value={`$${outstanding.total.toLocaleString()}`}
          icon={Clock}
          meta={{
            text: `${outstanding.count} unpaid invoice${outstanding.count === 1 ? "" : "s"}`,
            tone: outstanding.count > 0 ? "warning" : "neutral",
          }}
        />
        <StatCard
          label="Active Projects"
          value={String(stats.activeProjects)}
          icon={Languages}
          meta={{
            text: `${stats.overdueProjects} overdue`,
            tone: stats.overdueProjects > 0 ? "danger" : "neutral",
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <UpcomingDeadlines projects={upcomingDeadlines} />
        <RevenueByClientChart data={revenueByClient} />
      </div>

      <QuickActions />
      <FloatingActionButton />
    </div>
  )
}