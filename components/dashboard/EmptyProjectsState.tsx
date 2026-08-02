// components/dashboard/EmptyProjectsState.tsx

import Link from "next/link"

export function EmptyProjectsState() {
  return (
    <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-white">
      <p className="text-4xl mb-4">📋</p>

      <h3 className="font-display text-xl text-ink mb-2">
        No projects yet
      </h3>

      <p className="text-slate-mid text-sm mb-6 max-w-sm mx-auto">
        Create your first project — or paste a client's email and let AI fill
        in the details.
      </p>

      <Link
        href="/projects/new"
        className="inline-block bg-ink hover:bg-ink-light text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
      >
        Create your first project →
      </Link>
    </div>
  )
}