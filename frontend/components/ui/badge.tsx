import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-pill px-2 py-[2px] text-caption font-medium transition-colors",
        {
          "bg-surface-2 text-ink-muted": variant === "default",
          "bg-semantic-success/10 text-semantic-success": variant === "success",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
