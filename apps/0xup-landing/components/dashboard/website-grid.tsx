"use client"

import { useWebsitesContext } from "@/context/websites-context"
import WebsiteCard from "@/components/dashboard/website-card"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WebsiteCardSkeleton } from "@/components/dashboard/website-card-skeleton"

export default function WebsiteGrid() {
  const { websites, isLoading } = useWebsitesContext()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <WebsiteCardSkeleton key={i} />
          ))}
      </div>
    )
  }

  if (websites.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground mb-4">No websites or APIs are being monitored yet.</p>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Your First Website
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {websites.map((website) => (
        <WebsiteCard key={website.id} website={website} />
      ))}
    </div>
  )
}

