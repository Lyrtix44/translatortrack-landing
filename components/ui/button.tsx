import { forwardRef } from "react"
import { cn } from "@/lib/utils"

// Replaces the Week 3 shadcn Button — same import path, so existing call
// sites (`import { Button } from "@/components/ui/button"`) keep working.
// Adds "ghost-dark" specifically for use on the ink sidebar/topbar, which
// the original component had no answer for.

type ButtonVariant = "primary" | "secondary" | "ghost" | "ghost-dark" | "danger"
type ButtonSize = "sm" | "md" | "lg"

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-amber text-ink hover:bg-amber-hover font-semibold",
  secondary: "bg-ink text-white hover:bg-ink-light font-semibold",
  ghost: "bg-transparent text-ink hover:bg-paper-dark",
  "ghost-dark": "bg-transparent text-sidebar-text hover:bg-white/5 hover:text-white",
  danger: "bg-transparent text-danger hover:bg-danger-light",
}

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 rounded-sm gap-1.5",
  md: "text-sm px-4 py-2.5 rounded gap-2",
  lg: "text-base px-6 py-3 rounded-lg gap-2.5",
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"