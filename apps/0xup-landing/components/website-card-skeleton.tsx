import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function WebsiteCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden border", className)}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-3 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Card>
  )
}

