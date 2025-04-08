"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Website } from "@/types/website"

interface WebsiteCardProps {
  website: Website
  className?: string
}

export function WebsiteCard({ website, className }: WebsiteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Calculate status
  const uptimePercentage = calculateUptimePercentage(website.ticks)
  const status = getStatusFromUptime(uptimePercentage)
  const latestTick = getLatestTick(website.ticks)

  // Format domain
  const domain = new URL(website.url).hostname
  const shortDomain = domain.replace(/^www\./, "")

  // Format last checked time
  const lastChecked = latestTick ? formatDistanceToNow(new Date(latestTick.createdAt), { addSuffix: true }) : "Never"

  // Get recent ticks (last 30 minutes)
  const recentTicks = website.ticks.slice(0, 10)

  return (
    <Card className={cn("overflow-hidden border transition-all duration-200", className)}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-3 w-3 rounded-full",
                status === "online" ? "bg-green-500" : status === "degraded" ? "bg-amber-500" : "bg-red-500",
              )}
              aria-label={`Status: ${status}`}
            />
            <div>
              <h3 className="font-medium">{shortDomain}</h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="truncate max-w-[180px]">{website.url}</span>
                <a
                  href={website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Visit ${website.url}`}
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{uptimePercentage.toFixed(1)}% uptime</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t animate-slide-up">
            <div className="space-y-2">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground mb-2">Last 30 minutes status:</p>
                <div className="flex gap-1 h-2">
                  {recentTicks.map((tick, index) => (
                    <div
                      key={index}
                      className={cn("h-full flex-1 rounded-sm", tick.status === "Up" ? "bg-green-500" : "bg-red-500")}
                      title={`${new Date(tick.createdAt).toLocaleTimeString()}: ${tick.status === "Up" ? "Online" : "Offline"}`}
                    />
                  ))}

                  {/* Fill empty spaces if not enough ticks */}
                  {Array(10 - recentTicks.length)
                    .fill(0)
                    .map((_, index) => (
                      <div key={`empty-${index}`} className="h-full flex-1 rounded-sm bg-gray-500" />
                    ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">Last checked: {lastChecked}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

// Helper functions
function calculateUptimePercentage(ticks: any[]): number {
  if (ticks.length === 0) return 100

  const upTicks = ticks.filter((tick) => tick.status === "Up").length
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

