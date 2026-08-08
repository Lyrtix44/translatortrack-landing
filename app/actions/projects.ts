"use server"

import {
  createProject,
  getProjects,
  type CreateProjectInput,
  type Project,
  type ProjectStatus,
} from "@/lib/db/projects"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const FREE_PROJECT_LIMIT = 5

interface CreateProjectResult {
  project: Project | null
  error: string | null
}

export async function createProjectAction(
  input: CreateProjectInput
): Promise<CreateProjectResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      project: null,
      error: "Not authenticated.",
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single()

  if (profile?.plan === "free") {
    const existingProjects = await getProjects()

    if (existingProjects.length >= FREE_PROJECT_LIMIT) {
      return {
        project: null,
        error: `Free plan is limited to ${FREE_PROJECT_LIMIT} active projects. Upgrade to Pro for unlimited projects.`,
      }
    }
  }

  const project = await createProject(input)

  if (project) {
    revalidatePath("/dashboard")
  }

  return {
    project,
    error: project ? null : "Couldn't create the project.",
  }
}

export async function updateProjectStatusAction(projectId: string, status: ProjectStatus) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false }
  }

  const { error } = await supabase
    .from("projects")
    .update({ status })
    .eq("id", projectId)

  if (error) {
    console.error("Failed to update project status:", error.message)
    return { success: false }
  }

  revalidatePath("/projects")
  revalidatePath("/dashboard")
  return { success: true }
}