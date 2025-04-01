"use client"

import { useState } from "react"
import { useWebsitesContext } from "@/context/websites-context"
import { WebsiteCard } from "@/components/website-card"
import { WebsiteCardSkeleton } from "@/components/website-card-skeleton"
import { AddWebsiteModal, AddWebsiteButton } from "@/components/add-website-modal"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { RefreshCw, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Website } from "@/types/website"

export function UptimeDashboard() {
  const { websites, isLoading, refreshWebsites } = useWebsitesContext()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [timeFilter, setTimeFilter] = useState("24h")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("status")

  // Filter websites based on search query
  const filteredWebsites = websites.filter((website) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return website.url.toLowerCase().includes(query) || new URL(website.url).hostname.toLowerCase().includes(query)
  })

  // Sort websites
  const sortedWebsites = [...filteredWebsites].sort((a, b) => {
    switch (sortBy) {
      case "status":
        return getStatusPriority(a) - getStatusPriority(b)
      case "name":
        return new URL(a.url).hostname.localeCompare(new URL(b.url).hostname)
      case "uptime":
        return calculateUptimePercentage(b.ticks) - calculateUptimePercentage(a.ticks)
      case "response":
        return calculateAverageResponseTime(a.ticks) - calculateAverageResponseTime(b.ticks)
      default:
        return 0
    }
  })

  // Handle refresh all
  const handleRefreshAll = async () => {
    setIsRefreshing(true)
    await refreshWebsites()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  // Handle add website
  const handleAddWebsite = async (values: { name: string; url: string }) => {
    // In a real app, this would call an API to add the website
    console.log("Adding website:", values)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await refreshWebsites()
  }

  // Handle refresh single website
  const handleRefreshWebsite = async (id: string) => {
    // In a real app, this would call an API to refresh a specific website
    console.log("Refreshing website:", id)
    await new Promise((resolve) => setTimeout(resolve, 800))
    await refreshWebsites()
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Uptime Dashboard</h1>
          {/* <ThemeToggle /> */}
        </div>
        <p className="text-muted-foreground">Monitor your Web3 infrastructure with decentralized validators.</p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search websites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* <Tabs value={timeFilter} onValueChange={setTimeFilter} className="w-auto">
            <TabsList className="grid grid-cols-3 w-[240px]">
              <TabsTrigger value="1h">Last Hour</TabsTrigger>
              <TabsTrigger value="24h">24 Hours</TabsTrigger>
              <TabsTrigger value="7d">7 Days</TabsTrigger>
            </TabsList>
          </Tabs> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Sort websites">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="uptime">Uptime</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="response">Response Time</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Filter websites">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value="all">
                <DropdownMenuRadioItem value="all">All Websites</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="online">Online</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="degraded">Degraded</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="offline">Offline</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={handleRefreshAll} disabled={isRefreshing} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh All"}
          </Button>

          <AddWebsiteButton onClick={() => setIsAddModalOpen(true)} />
        </div>
      </div>

      {/* Website Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <WebsiteCardSkeleton key={i} />
            ))}
        </div>
      ) : sortedWebsites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No websites found</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {searchQuery
              ? "No websites match your search criteria. Try a different search term."
              : "You haven't added any websites to monitor yet. Add your first website to get started."}
          </p>
          {!searchQuery && <Button onClick={() => setIsAddModalOpen(true)}>Add Your First Website</Button>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedWebsites.map((website) => (
            <WebsiteCard key={website.id} website={website} onRefresh={handleRefreshWebsite} />
          ))}
        </div>
      )}

      {/* Add Website Modal */}
      <AddWebsiteModal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} onAdd={handleAddWebsite} />
    </div>
  )
}

// Helper functions
function getStatusPriority(website: Website): number {
  const uptime = calculateUptimePercentage(website.ticks)
  if (uptime < 95) return 0 // Offline - highest priority
  if (uptime < 99) return 1 // Degraded
  return 2 // Online - lowest priority
}

function calculateUptimePercentage(ticks: any[]): number {
  if (ticks.length === 0) return 100

  const upTicks = ticks.filter((tick) => tick.status === "up").length
  return (upTicks / ticks.length) * 100
}

function calculateAverageResponseTime(ticks: any[]): number {
  if (ticks.length === 0) return 0

  const validTicks = ticks.filter((tick) => tick.latency)
  if (validTicks.length === 0) return 0

  const sum = validTicks.reduce((acc, tick) => acc + tick.latency, 0)
  return Math.round(sum / validTicks.length)
}

