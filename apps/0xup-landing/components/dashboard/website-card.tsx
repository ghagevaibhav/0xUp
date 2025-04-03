"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, ExternalLink, Clock, Shield } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Website } from "@/types/website"
import { calculateUptimePercentage, getLatestTick, aggregateTicksInWindows } from "@/lib/uptime-utils"

interface WebsiteCardProps {
  website: Website
}

export default function WebsiteCard({ website }: WebsiteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const uptimePercentage = calculateUptimePercentage(website.ticks)
  const latestTick = getLatestTick(website.ticks)
  const aggregatedTicks = aggregateTicksInWindows(website.ticks, 3) // 3-minute windows

  const isDown = uptimePercentage < 95
  const domain = new URL(website.url).hostname
  const shortDomain = domain.replace(/^www\./, "")

  const lastChecked = latestTick ? formatDistanceToNow(new Date(latestTick.createdAt), { addSuffix: true }) : "Never"

  return (
    <Card
      className={`
      border-2 transition-all duration-300 overflow-hidden
      ${isDown ? "border-red-500 animate-pulse-slow" : "hover:border-primary/50"}
      ${isExpanded ? "shadow-[0_0_15px_rgba(var(--primary),0.3)]" : ""}
    `}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
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
              <CardTitle className="text-lg">{shortDomain}</CardTitle>
              <CardDescription className="flex items-center">
                <span className="truncate max-w-[180px]">{website.url}</span>
                <a href={website.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-primary">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={uptimePercentage >= 99 ? "outline" : "secondary"}
            className={`
              ${uptimePercentage >= 99 ? "border-green-500 text-green-500" : ""}
              ${uptimePercentage >= 95 && uptimePercentage < 99 ? "border-amber-500 text-amber-500" : ""}
              ${uptimePercentage < 95 ? "border-red-500 text-red-500" : ""}
            `}
          >
            {uptimePercentage >= 99 ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : uptimePercentage < 95 ? (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            ) : null}
            {uptimePercentage.toFixed(2)}% Uptime
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Uptime Timeline</h4>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Last checked: {lastChecked}</span>
              </div>
            </div>

            <TooltipProvider>
              <div className="flex gap-1 h-8">
                {aggregatedTicks.map((tick, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          h-full w-2 rounded-sm transition-all duration-300
                          ${tick.status === "Up" ? "bg-green-500" : "bg-red-500"}
                          hover:w-3 hover:shadow-[0_0_8px_rgba(var(--primary),0.5)]
                        `}
                      ></div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <p>{new Date(tick.createdAt).toLocaleString()}</p>
                      <p>Status: {tick.status === "Up" ? "Online" : "Offline"}</p>
                      <p>Latency: {tick.latency}ms</p>
                    </TooltipContent>
                  </Tooltip>
                ))}

                {/* Fill empty spaces if not enough ticks */}
                {Array(20 - aggregatedTicks.length)
                  .fill(0)
                  .map((_, index) => (
                    <div key={`empty-${index}`} className="h-full w-2 rounded-sm bg-muted/50"></div>
                  ))}
              </div>
            </TooltipProvider>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium">{website.validatorsStaked || 24}</span>
              <span className="text-muted-foreground">validators</span>
            </div>

            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Avg. Latency:</span>
              <span className="font-medium">
                {Math.round(
                  website.ticks.reduce((sum, tick) => sum + (tick.latency || 0), 0) /
                    website.ticks.filter((tick) => tick.latency).length || 0,
                )}
                ms
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <Accordion type="single" collapsible>
        <AccordionItem value="details" className="border-t border-b-0">
          <AccordionTrigger className="py-2 px-6">
            <span className="text-sm text-muted-foreground">View Detailed Logs</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-6 pb-4 max-h-[200px] overflow-y-auto">
              <div className="space-y-2">
                {website.ticks.slice(0, 10).map((tick, index) => (
                  <div key={index} className="flex justify-between items-center text-sm py-1 border-b border-muted/50">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${tick.status === "Up" ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <span>{new Date(tick.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">
                        Latency: <span className="font-medium">{tick.latency}ms</span>
                      </span>
                      <Badge variant="outline" className={tick.status === "Up" ? "text-green-500" : "text-red-500"}>
                        {tick.status === "Up" ? "Online" : "Offline"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <CardFooter className="pt-4 pb-4">
        <Button variant="outline" className="w-full gap-2 hover:border-primary hover:text-primary transition-colors">
          <Shield className="h-4 w-4" />
          Stake as Validator → Earn Rewards
        </Button>
      </CardFooter>
    </Card>
  )
}

