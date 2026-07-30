// app/actions/projects.ts
"use server"

import { createProject, type CreateProjectInput } from "@/lib/db/projects"
import { revalidatePath } from "next/cache"

export async function createProjectAction(input: CreateProjectInput) {
  const project = await createProject(input)
  if (project) {
    revalidatePath("/dashboard")
  }
  return project
}