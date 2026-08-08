// components/projects/ProjectStatusBadge.tsx — a colored <select>, not a static Badge
"use client"
import { useOptimistic, useTransition } from "react"
import { toast } from "sonner"
import { updateProjectStatusAction } from "@/app/actions/projects"
import { PROJECT_STATUS_BADGE } from "@/components/ui/badge"
import type { ProjectStatus } from "@/lib/db/projects"

const TONE_CLASSES: Record<string, string> = {
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  info: "bg-info-light text-info",
  danger: "bg-danger-light text-danger",
  neutral: "bg-paper-dark text-slate-mid",
}

export function ProjectStatusBadge({
  projectId,
  status,
}: {
  projectId: string
  status: ProjectStatus
}) {
  const [isPending, startTransition] = useTransition()
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status, (_c, n: ProjectStatus) => n)
  const badge = PROJECT_STATUS_BADGE[optimisticStatus]

  function handleChange(newStatus: ProjectStatus) {
    startTransition(async () => {
      setOptimisticStatus(newStatus)
      const { success } = await updateProjectStatusAction(projectId, newStatus)
      if (!success) toast.error("Couldn't update status.")
    })
  }

  return (
    <select
      value={optimisticStatus}
      onChange={(e) => handleChange(e.target.value as ProjectStatus)}
      disabled={isPending}
      className={`text-[11px] font-semibold pl-2.5 pr-1.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber disabled:opacity-60 ${TONE_CLASSES[badge.variant]}`}
    >
      {Object.entries(PROJECT_STATUS_BADGE).map(([key, v]) => (
        <option key={key} value={key}>
          {v.label}
        </option>
      ))}
    </select>
  )
}