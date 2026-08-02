"use client"

import { updateProjectStatusAction } from "@/components/dashboard/ProjectStatusSelect.server"
import type { ProjectStatus } from "@/lib/db/projects"

type Props = {
  projectId: string
  status: ProjectStatus
}

export function ProjectStatusSelect({ projectId, status }: Props) {
  return (
    <select
      value={status}
      onChange={async (e) => {
        const newStatus = e.target.value as ProjectStatus
        await updateProjectStatusAction(projectId, newStatus)
      }}
      className="border border-border rounded-lg px-3 py-1.5 text-sm bg-white"
    >
      <option value="in_progress">In Progress</option>
      <option value="delivered">Delivered</option>
      <option value="invoiced">Invoiced</option>
      <option value="paid">Paid</option>
    </select>
  )
}