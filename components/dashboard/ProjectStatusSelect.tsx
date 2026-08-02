"use server"

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