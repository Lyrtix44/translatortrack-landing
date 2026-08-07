import { cn } from "@/lib/utils"

export function Card({
  className,
  children,
  hoverable = false,
}: {
  className?: string
  children: React.ReactNode
  hoverable?: boolean
}) {
  return (
    <div
      className={cn(
        "bg-white border border-border rounded-lg shadow-card",
        hoverable && "transition-shadow duration-200 hover:shadow-card-hover",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-5 pt-5 pb-3", className)}>{children}</div>
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-5 pb-5", className)}>{children}</div>
}