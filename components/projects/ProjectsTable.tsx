// components/projects/ProjectsTable.tsx
"use client"
import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ArrowUpDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectStatusBadge } from "./ProjectStatusBadge"
import type { Project, ProjectStatus } from "@/lib/db/projects"

type SortKey = "deadline" | "invoice_total"

const STATUS_TABS: { key: ProjectStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in_progress", label: "In Progress" },
  { key: "delivered", label: "Delivered" },
  { key: "invoiced", label: "Invoiced" },
  { key: "paid", label: "Paid" },
]

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all")
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("deadline")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length }
    for (const p of projects) c[p.status] = (c[p.status] ?? 0) + 1
    return c
  }, [projects])

  const filtered = useMemo(() => {
    let result = projects
    if (statusFilter !== "all") result = result.filter((p) => p.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.clients?.name.toLowerCase().includes(q)
      )
    }
    return [...result].sort((a, b) => {
      const cmp =
        sortKey === "deadline"
          ? new Date(a.deadline ?? 0).getTime() - new Date(b.deadline ?? 0).getTime()
          : a.invoice_total - b.invoice_total
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [projects, statusFilter, search, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  return (
    <div>
      <div className="flex items-center gap-1 mb-4 border-b border-border overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              statusFilter === tab.key
                ? "border-amber text-ink"
                : "border-transparent text-slate-mid hover:text-ink"
            }`}
          >
            {tab.label} <span className="text-xs text-slate-mid/70">{counts[tab.key] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center bg-white border border-border rounded-lg px-3 py-2 flex-1 max-w-sm">
          <Search size={16} className="text-slate-mid shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or client..."
            className="bg-transparent border-none outline-none text-sm text-ink placeholder-slate-mid/70 ml-2 w-full"
          />
        </div>
        <Link href="/projects/new" className="ml-auto">
          <Button variant="primary" size="md">
            <Plus size={16} />
            New project
          </Button>
        </Link>
      </div>

      {/* Desktop: real table */}
      <div className="hidden md:block bg-white border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-paper">
              <th className="text-left font-medium text-slate-mid px-4 py-3">Project</th>
              <th className="text-left font-medium text-slate-mid px-4 py-3">Client</th>
              <th className="text-left font-medium text-slate-mid px-4 py-3">Words</th>
              <th
                className="text-left font-medium text-slate-mid px-4 py-3 cursor-pointer select-none"
                onClick={() => toggleSort("invoice_total")}
              >
                <span className="flex items-center gap-1">
                  Total <ArrowUpDown size={12} />
                </span>
              </th>
              <th className="text-left font-medium text-slate-mid px-4 py-3">Status</th>
              <th
                className="text-left font-medium text-slate-mid px-4 py-3 cursor-pointer select-none"
                onClick={() => toggleSort("deadline")}
              >
                <span className="flex items-center gap-1">
                  Deadline <ArrowUpDown size={12} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-paper/50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{p.title}</p>
                  <p className="text-xs text-slate-mid">
                    {p.source_language} → {p.target_language}
                  </p>
                </td>
                <td className="px-4 py-3 text-ink">{p.clients?.name ?? "—"}</td>
                <td className="px-4 py-3 text-slate-mid">{p.word_count.toLocaleString()}</td>
                <td className="px-4 py-3 text-ink font-medium">${p.invoice_total.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <ProjectStatusBadge projectId={p.id} status={p.status} />
                </td>
                <td className="px-4 py-3 text-slate-mid">
                  {p.deadline
                    ? new Date(p.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-mid text-sm">No projects match your filters.</div>
        )}
      </div>

      {/* Mobile: cards — same data, different shape, not a stripped-down version */}
      <div className="md:hidden space-y-2">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-1 gap-2">
              <p className="font-medium text-ink text-sm">{p.title}</p>
              <ProjectStatusBadge projectId={p.id} status={p.status} />
            </div>
            <p className="text-xs text-slate-mid">
              {p.clients?.name} · {p.source_language}→{p.target_language}
            </p>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className="text-slate-mid">{p.word_count.toLocaleString()} words</span>
              <span className="text-ink font-medium">${p.invoice_total.toFixed(2)}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-mid text-sm">No projects match your filters.</div>
        )}
      </div>
    </div>
  )
}