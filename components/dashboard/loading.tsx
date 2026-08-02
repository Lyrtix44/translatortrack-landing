import { ProjectListSkeleton } from "@/components/dashboard/ProjectListSkeleton"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-paper pt-28 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="h-9 w-64 bg-paper-dark rounded animate-pulse mb-8" />

        <ProjectListSkeleton />
      </div>
    </div>
  )
}
