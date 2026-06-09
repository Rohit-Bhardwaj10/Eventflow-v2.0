import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "feature" | "pricing" | "pricing-featured" | "product-screenshot" | "testimonial" | "logo-tile";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          {
            "bg-surface-1 text-ink rounded-lg p-6 border border-hairline": variant === "default" || variant === "pricing",
            "bg-surface-2 text-ink rounded-lg p-6 border border-hairline-strong": variant === "pricing-featured",
            "bg-surface-1 text-ink rounded-lg p-6": variant === "feature",
            "bg-surface-1 text-ink rounded-xl p-6": variant === "product-screenshot",
            "bg-surface-1 text-ink rounded-lg p-8": variant === "testimonial",
            "bg-canvas text-ink-subtle rounded-xs p-4": variant === "logo-tile",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

export { Card }
