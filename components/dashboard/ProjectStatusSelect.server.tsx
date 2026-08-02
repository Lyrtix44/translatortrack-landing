"use server"

import { requireAuth } from "@/lib/auth"
import { updateProjectStatus } from "@/lib/db/projects"
import { revalidatePath } from "next/cache"

type ProjectStatus = "draft" | "in_progress" | "delivered" | "invoiced" | "paid"

export async function updateProjectStatusAction(
  projectId: string,
  status: ProjectStatus
) {
  await requireAuth()

  const success = await updateProjectStatus(projectId, status)

  if (success) {
    revalidatePath("/dashboard")
  }

  return { success }
}