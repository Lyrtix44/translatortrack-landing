// components/dashboard/UpcomingDeadlines.tsx
"use client"
import { useState, useTransition } from "react"
import { Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { updateProjectStatusAction } from "@/app/actions/projects"
import type { Project } from "@/lib/db/projects"

export function UpcomingDeadlines({ projects }: { projects: Project[] }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold text-slate-mid uppercase tracking-wider mb-4">
        Upcoming Deadlines
      </p>
      {projects.length === 0 ? (
        <p className="text-sm text-slate-mid py-6 text-center">Nothing due soon.</p>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <DeadlineRow key={p.id} project={p} />
          ))}
        </div>
      )}
    </Card>
  )
}

function DeadlineRow({ project }: { project: Project }) {
  const [justCompleted, setJustCompleted] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleMarkDone() {
    setJustCompleted(true)
    startTransition(async () => {
      await updateProjectStatusAction(project.id, "delivered")
    })
  }

  return (
    <div
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors duration-500 ${
        justCompleted ? "bg-success-light border-success/20" : "bg-paper border-border"
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink truncate">{project.title}</p>
        <p className="text-xs text-slate-mid flex items-center gap-1 mt-0.5">
          <Calendar size={11} />
          {project.deadline
            ? new Date(project.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" })
            : "No deadline"}
        </p>
      </div>
      <Button
        variant={justCompleted ? "secondary" : "ghost"}
        size="sm"
        onClick={handleMarkDone}
        disabled={justCompleted || isPending}
        className="shrink-0 ml-2"
      >
        {justCompleted ? "Done ✓" : "Mark Done"}
      </Button>
    </div>
  )
}