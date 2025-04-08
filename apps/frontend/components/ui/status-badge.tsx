import { cn } from "@/lib/utils"

type StatusType = "online" | "offline" | "degraded" | "unknown"

interface StatusBadgeProps {
  status: StatusType
  className?: string
  size?: "sm" | "md" | "lg"
  pulse?: boolean
}

export function StatusBadge({ status, className, size = "md", pulse = false }: StatusBadgeProps) {
  const statusConfig = {
    online: {
      color: "bg-success text-success-foreground",
      bgColor: "bg-success-background",
      label: "Online",
    },
    offline: {
      color: "bg-destructive text-destructive-foreground",
      bgColor: "bg-destructive-background",
      label: "Offline",
    },
    degraded: {
      color: "bg-warning text-warning-foreground",
      bgColor: "bg-warning-background",
      label: "Degraded",
    },
    unknown: {
      color: "bg-muted text-muted-foreground",
      bgColor: "bg-muted/20",
      label: "Unknown",
    },
  }

  const config = statusConfig[status]

  const sizeClasses = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-2.5 w-2.5",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium",
        config.bgColor,
        className,
      )}
    >
      <span
        className={cn("rounded-full", config.color, sizeClasses[size], pulse && status !== "online" && "animate-pulse")}
      />
      <span>{config.label}</span>
    </div>
  )
}

