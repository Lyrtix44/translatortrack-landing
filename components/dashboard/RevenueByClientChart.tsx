// components/dashboard/RevenueByClientChart.tsx
import { Card } from "@/components/ui/card"

interface RevenueRow {
  clientName: string
  revenue: number
}

export function RevenueByClientChart({ data }: { data: RevenueRow[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1)

  return (
    <Card className="p-5">
      <p className="text-xs font-semibold text-slate-mid uppercase tracking-wider mb-4">
        Revenue by Client
      </p>
      {data.length === 0 ? (
        <p className="text-sm text-slate-mid py-6 text-center">No revenue yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map((d) => (
            <div key={d.clientName}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-ink font-medium truncate">{d.clientName}</span>
                <span className="text-xs text-slate-mid shrink-0 ml-2">
                  ${d.revenue.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-paper-dark rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(d.revenue / max) * 100}%`,
                    background: "linear-gradient(90deg, #1E3A5F 0%, #F59E0B 100%)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}