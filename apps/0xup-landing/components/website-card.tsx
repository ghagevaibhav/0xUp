"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { TrendChart } from "@/components/ui/trend-chart"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Clock,
  MoreHorizontal,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Website } from "@/types/website"

interface WebsiteCardProps {
  website: Website
  onRefresh?: (id: string) => void
  className?: string
}

export function WebsiteCard({ website, onRefresh, className }: WebsiteCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Calculate status
  const uptimePercentage = calculateUptimePercentage(website.ticks)
  const status = getStatusFromUptime(uptimePercentage)
  const latestTick = getLatestTick(website.ticks)

  // Format domain
  const domain = new URL(website.url).hostname
  const shortDomain = domain.replace(/^www\./, "")

  // Calculate average response time
  const avgResponseTime = calculateAverageResponseTime(website.ticks)

  // Format last checked time
  const lastChecked = latestTick ? formatDistanceToNow(new Date(latestTick.createdAt), { addSuffix: true }) : "Never"

  // Generate trend data for the chart
  const trendData = generateTrendData(website.ticks)

  // Handle refresh
  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true)
      await onRefresh(website.id)
      setTimeout(() => setIsRefreshing(false), 800)
    }
  }

  return (
    <Card
      className={cn(
        "border-2 overflow-hidden transition-all duration-300 theme-transition animate-fade-in",
        status === "offline" && "border-destructive animate-pulse-slow",
        status === "degraded" && "border-warning",
        status === "online" && "hover:border-primary/50",
        className,
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <img
                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                alt={domain}
                className="h-6 w-6"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-medium">{shortDomain}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="truncate max-w-[180px]">{website.url}</span>
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-primary hover:text-primary/80"
                  aria-label={`Visit ${website.url}`}
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
          <StatusBadge status={status} pulse={status !== "online"} />
        </div>
      </CardHeader>

      <CardContent className="pb-2 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Uptime Trend (24h)</h4>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>Last checked: {lastChecked}</span>
            </div>
          </div>

          <div className="h-[40px] w-full">
            <TrendChart data={trendData} width={300} height={40} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Uptime</p>
            <div className="flex items-center">
              {uptimePercentage >= 99 ? (
                <ArrowUpRight className="h-4 w-4 text-success mr-1" />
              ) : uptimePercentage < 95 ? (
                <ArrowDownRight className="h-4 w-4 text-destructive mr-1" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-warning mr-1" />
              )}
              <span className="text-lg font-semibold">{uptimePercentage.toFixed(2)}%</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Response Time</p>
            <p className="text-lg font-semibold">{avgResponseTime}ms</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4 pb-4 flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="font-medium">{website.validatorsStaked || 24}</span>
                <span className="ml-1">validators</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Number of validators monitoring this website</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh status"
          >
            <RefreshCw className={cn("h-4 w-4 mr-1", isRefreshing && "animate-spin")} />
            {isRefreshing ? "Checking..." : "Check Now"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View History</DropdownMenuItem>
              <DropdownMenuItem>Edit Settings</DropdownMenuItem>
              <DropdownMenuItem>Configure Alerts</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  )
}

// Helper functions
function calculateUptimePercentage(ticks: any[]): number {
  if (ticks.length === 0) return 100

  const upTicks = ticks.filter((tick) => tick.status === "up").length
  return (upTicks / ticks.length) * 100
}

function getStatusFromUptime(uptime: number): "online" | "degraded" | "offline" {
  if (uptime >= 99) return "online"
  if (uptime >= 95) return "degraded"
  return "offline"
}

function getLatestTick(ticks: any[]): any | null {
  if (ticks.length === 0) return null

  return ticks.reduce((latest, current) => {
    const latestDate = new Date(latest.createdAt)
    const currentDate = new Date(current.createdAt)
    return currentDate > latestDate ? current : latest
  }, ticks[0])
}

function calculateAverageResponseTime(ticks: any[]): number {
  if (ticks.length === 0) return 0

  const validTicks = ticks.filter((tick) => tick.latency)
  if (validTicks.length === 0) return 0

  const sum = validTicks.reduce((acc, tick) => acc + tick.latency, 0)
  return Math.round(sum / validTicks.length)
}

function generateTrendData(ticks: any[]): number[] {
  // Generate 24 data points for the last 24 hours
  const data: number[] = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const hourAgo = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hourStart = new Date(hourAgo.getFullYear(), hourAgo.getMonth(), hourAgo.getDate(), hourAgo.getHours())
    const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)

    // Find ticks in this hour
    const hourTicks = ticks.filter((tick) => {
      const tickTime = new Date(tick.createdAt)
      return tickTime >= hourStart && tickTime < hourEnd
    })

    if (hourTicks.length === 0) {
      // No data for this hour, use previous point or 100 if first point
      data.push(data.length > 0 ? data[data.length - 1] : 100)
    } else {
      const upTicks = hourTicks.filter((tick) => tick.status === "up").length
      const hourUptime = (upTicks / hourTicks.length) * 100
      data.push(hourUptime)
    }
  }

  return data
}
