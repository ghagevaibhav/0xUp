import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WebsiteCardSkeleton() {
  return (
    <Card className="border-2 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="flex gap-1 h-8">
              {Array(20)
                .fill(0)
                .map((_, index) => (
                  <Skeleton key={index} className="h-full w-2 rounded-sm" />
                ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>

      <div className="px-6 py-2 border-t">
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>

      <CardFooter className="pt-4 pb-4">
        <Button variant="outline" className="w-full gap-2" disabled>
          <Shield className="h-4 w-4" />
          Stake as Validator
        </Button>
      </CardFooter>
    </Card>
  )
}

