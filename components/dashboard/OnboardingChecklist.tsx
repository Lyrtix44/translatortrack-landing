// components/dashboard/OnboardingChecklist.tsx

import Link from "next/link"

interface ChecklistItem {
  label: string
  done: boolean
  href: string
}

export function OnboardingChecklist({
  items,
}: {
  items: ChecklistItem[]
}) {
  // Hide the checklist once every item is complete
  if (items.every((i) => i.done)) return null

  return (
    <div className="bg-amber-50 border border-amber/30 rounded-2xl p-6 mb-8">
      <h3 className="font-semibold text-ink text-sm mb-4">
        Get set up
      </h3>

      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 text-sm group"
          >
            <span
              className={
                item.done
                  ? "text-green-600"
                  : "text-slate-mid/40"
              }
            >
              {item.done ? "✓" : "○"}
            </span>

            <span
              className={
                item.done
                  ? "text-slate-mid line-through"
                  : "text-ink group-hover:text-amber transition-colors"
              }
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}