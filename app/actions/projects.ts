// app/actions/projects.ts
"use server"

import {
  createProject,
  getProjects,
  updateProject,
  updateProjectStatus,
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
  console.log("🔍 createProjectAction input:", JSON.stringify(input, null, 2))

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("🔍 createProjectAction – user:", user?.id)

  if (!user) {
    console.error("❌ createProjectAction – No user found")
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

  console.log("🔍 createProjectAction – plan:", profile?.plan)

  // 🔥 FIX: Treat null as 'free'
  const plan = profile?.plan ?? "free"

  if (plan === "free") {
    // 🔥 FIX: Direct count from Supabase instead of getProjects()
    const { count, error: countError } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    console.log("🔍 createProjectAction – direct project count:", count)

    if (countError) {
      console.error("❌ createProjectAction – Count error:", countError)
      // Fallback to getProjects if count fails
      const existingProjects = await getProjects()
      console.log("🔍 createProjectAction – fallback projects count:", existingProjects.length)
      if (existingProjects.length >= FREE_PROJECT_LIMIT) {
        console.log("❌ createProjectAction – Free plan limit reached (fallback)")
        return {
          project: null,
          error: `Free plan is limited to ${FREE_PROJECT_LIMIT} active projects. Upgrade to Pro for unlimited projects.`,
        }
      }
    } else if ((count ?? 0) >= FREE_PROJECT_LIMIT) {
      console.log("❌ createProjectAction – Free plan limit reached")
      return {
        project: null,
        error: `Free plan is limited to ${FREE_PROJECT_LIMIT} active projects. Upgrade to Pro for unlimited projects.`,
      }
    }
  }

  console.log("🔍 createProjectAction – Calling createProject...")
  const project = await createProject(input)
  console.log("🔍 createProjectAction – createProject result:", project ? "Success" : "Failed")

  if (project) {
    revalidatePath("/dashboard")
    revalidatePath("/projects")
  }

  return {
    project,
    error: project ? null : "Couldn't create the project.",
  }
}

export async function updateProjectStatusAction(
  projectId: string,
  status: ProjectStatus
): Promise<{ success: boolean }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false }
  }

  const success = await updateProjectStatus(projectId, status)

  if (success) {
    revalidatePath("/projects")
    revalidatePath("/dashboard")
    revalidatePath(`/projects/${projectId}`)
  }

  return { success }
}

export async function updateProjectAction(
  projectId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Not authenticated." }
  }

  const client_id = formData.get("client_id") as string
  const title = (formData.get("title") as string)?.trim()
  const source_language = (formData.get("source_language") as string)?.toUpperCase()
  const target_language = (formData.get("target_language") as string)?.toUpperCase()
  const word_count = parseInt(formData.get("word_count") as string)
  const rate_per_word = parseFloat(formData.get("rate_per_word") as string)
  const currency = formData.get("currency") as string
  const deadline = formData.get("deadline") as string

  if (!title || title.length < 2) {
    return { success: false, error: "Please enter a project title." }
  }
  if (!client_id) {
    return { success: false, error: "Please select a client." }
  }
  if (isNaN(word_count) || word_count <= 0) {
    return { success: false, error: "Please enter a valid word count." }
  }
  if (isNaN(rate_per_word) || rate_per_word <= 0) {
    return { success: false, error: "Please enter a valid rate." }
  }

  const project = await updateProject(projectId, {
    client_id,
    title,
    source_language,
    target_language,
    word_count,
    rate_per_word,
    currency,
    deadline: deadline || null,
  })

  if (!project) {
    return { success: false, error: "Couldn't update the project." }
  }

  revalidatePath(`/projects/${projectId}`)
  revalidatePath("/projects")
  revalidatePath("/dashboard")

  return { success: true }
}