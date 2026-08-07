import { cn } from "@/lib/utils"

// The status system used everywhere a state needs a color: project status,
// invoice status, form feedback. Five variants map directly to the tokens
// defined in tailwind.config.ts — success/warning/danger/info/neutral.

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral"

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  danger: "bg-danger-light text-danger",
  info: "bg-info-light text-info",
  neutral: "bg-paper-dark text-slate-mid",
}

export function Badge({
  variant = "neutral",
  children,
  className,
}: {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

// Convenience mapping so call sites don't each reinvent this — Part 4
// (Projects) and Part 5 (Invoices) both plug directly into this.
export const PROJECT_STATUS_BADGE: Record<string, { label: string; variant: BadgeVariant }> = {
  in_progress: { label: "In progress", variant: "warning" },
  delivered: { label: "Delivered", variant: "success" },
  invoiced: { label: "Invoiced", variant: "info" },
  paid: { label: "Paid", variant: "success" },
}

export const INVOICE_STATUS_BADGE: Record<string, { label: string; variant: BadgeVariant }> = {
  draft: { label: "Draft", variant: "neutral" },
  sent: { label: "Sent", variant: "info" },
  paid: { label: "Paid", variant: "success" },
  overdue: { label: "Overdue", variant: "danger" },
}