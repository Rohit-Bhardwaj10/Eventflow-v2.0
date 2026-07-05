import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "inverse" | "pink" | "cyan";
  size?: "default" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-button border-brutal shadow-brutal brutal-hover-lift outline-none cursor-pointer",
          "focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:translate-none",
          {
            "bg-primary text-ink hover:bg-primary-hover": variant === "primary",
            "bg-surface-1 text-ink hover:bg-surface-2": variant === "secondary",
            "bg-canvas text-ink border-2 shadow-brutal-sm hover:bg-surface-2": variant === "tertiary",
            "bg-inverse-canvas text-inverse-ink hover:bg-inverse-surface-1": variant === "inverse",
            "bg-accent-pink text-ink hover:brightness-95": variant === "pink",
            "bg-accent-cyan text-ink hover:brightness-95": variant === "cyan",
            "px-5 py-2.5": size === "default",
            "px-8 py-4 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
