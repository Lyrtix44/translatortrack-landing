// components/dashboard/StatCard.tsx
import type { LucideIcon } from "lucide-react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { Card } from "@/components/ui/card"

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  trend?: { direction: "up" | "down"; value: string }
  meta?: { text: string; tone: "warning" | "danger" | "neutral" }
}

export function StatCard({ label, value, icon: Icon, trend, meta }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-slate-mid">{label}</p>
        <Icon size={18} className="text-slate-mid/50" />
      </div>
      <p className="font-display text-3xl text-ink mb-1.5">{value}</p>
      {trend && (
        <p
          className={`text-xs font-medium flex items-center gap-1 ${
            trend.direction === "up" ? "text-success" : "text-danger"
          }`}
        >
          {trend.direction === "up" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {trend.value}
        </p>
      )}
      {meta && (
        <p
          className={`text-xs font-medium ${
            meta.tone === "danger"
              ? "text-danger"
              : meta.tone === "warning"
              ? "text-warning"
              : "text-slate-mid"
          }`}
        >
          {meta.text}
        </p>
      )}
    </Card>
  )
}