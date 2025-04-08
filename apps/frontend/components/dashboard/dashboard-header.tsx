"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWebsitesContext } from "@/context/websites-context"

export default function DashboardHeader() {
  const { refreshWebsites, isLoading } = useWebsitesContext()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshWebsites()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Uptime Dashboard</h1>
        <p className="text-muted-foreground">Monitor your Web3 infrastructure with decentralized validators.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs defaultValue="24h" className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-3 w-full sm:w-[300px]">
            <TabsTrigger value="1h">Last Hour</TabsTrigger>
            <TabsTrigger value="24h">24 Hours</TabsTrigger>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading || isRefreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Website
          </Button>
        </div>
      </div>
    </div>
  )
}

