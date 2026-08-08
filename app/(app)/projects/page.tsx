// app/(app)/projects/page.tsx
import { getProjects } from "@/lib/db/projects"
import { ProjectsTable } from "@/components/projects/ProjectsTable"

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-6">Projects</h1>
      <ProjectsTable projects={projects} />
    </div>
  )
}