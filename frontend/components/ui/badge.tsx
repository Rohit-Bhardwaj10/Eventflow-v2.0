import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "yellow" | "pink" | "cyan" | "lime" | "dark";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center border-brutal-2 shadow-brutal-sm px-3 py-1 text-caption",
        {
          "bg-surface-1 text-ink": variant === "default",
          "bg-accent-lime text-ink": variant === "success" || variant === "lime",
          "bg-primary text-ink": variant === "yellow",
          "bg-accent-pink text-ink": variant === "pink",
          "bg-accent-cyan text-ink": variant === "cyan",
          "bg-inverse-canvas text-inverse-ink": variant === "dark",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
