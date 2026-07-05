import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "feature" | "pricing" | "pricing-featured" | "product-screenshot" | "testimonial" | "logo-tile" | "accent-yellow" | "accent-pink" | "accent-cyan" | "accent-lime";
}

const variantStyles: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "bg-surface-1 text-ink p-6",
  pricing: "bg-surface-1 text-ink p-6",
  feature: "bg-surface-1 text-ink p-6",
  "pricing-featured": "bg-surface-2 text-ink p-6 shadow-brutal-lg",
  "product-screenshot": "bg-surface-1 text-ink p-6 shadow-brutal-lg",
  testimonial: "bg-surface-2 text-ink p-8",
  "logo-tile": "bg-canvas text-ink-subtle p-4 border-brutal-2 shadow-brutal-sm",
  "accent-yellow": "bg-primary text-ink p-6",
  "accent-pink": "bg-accent-pink text-ink p-6",
  "accent-cyan": "bg-accent-cyan text-ink p-6",
  "accent-lime": "bg-accent-lime text-ink p-6",
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("border-brutal shadow-brutal", variantStyles[variant], className)}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

export { Card }
