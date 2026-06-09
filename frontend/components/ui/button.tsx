import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "inverse";
  size?: "default";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-button transition-colors outline-none",
          "focus-visible:ring-2 focus-visible:ring-primary-focus/50 focus-visible:ring-offset-0",
          "disabled:pointer-events-none disabled:opacity-50 rounded-md",
          {
            "bg-primary text-ink border border-transparent hover:bg-primary-hover active:bg-primary-focus": variant === "primary",
            "bg-surface-1 text-ink border border-hairline hover:bg-surface-2": variant === "secondary",
            "bg-canvas text-ink border border-transparent hover:bg-surface-1": variant === "tertiary",
            "bg-inverse-canvas text-inverse-ink border border-transparent hover:bg-inverse-surface-1": variant === "inverse",
            "px-[14px] py-[8px]": size === "default",
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
