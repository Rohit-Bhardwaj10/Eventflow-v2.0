import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border-transparent bg-surface-1 px-3 py-2 text-body text-ink ring-offset-canvas file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink-subtle outline-none transition-shadow",
          "focus-visible:ring-2 focus-visible:ring-primary-focus/50 focus-visible:ring-offset-0 focus-visible:border-hairline-strong",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
