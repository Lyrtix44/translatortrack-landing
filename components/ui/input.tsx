import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full border border-border rounded px-4 py-2.5 text-sm bg-white text-ink placeholder-slate-mid/60",
          "focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/10 transition-all",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"