"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"
import { interval } from "date-fns"

export default function UptimeDemo() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [statuses, setStatuses] = useState([
    { id: 1, name: "API Gateway", status: "online", latency: "23ms", uptime: "99.98%" },
    { id: 2, name: "Smart Contract", status: "online", latency: "45ms", uptime: "99.95%" },
    { id: 3, name: "IPFS Gateway", status: "online", latency: "67ms", uptime: "99.92%" },
    { id: 4, name: "RPC Node", status: "online", latency: "31ms", uptime: "99.97%" },
  ])

  // Simulate occasional status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())

      // Randomly change status of one service occasionally
      if (Math.random() > 0.7) {
        const randomIndex = Math.floor(Math.random() * statuses.length)
        const newStatuses = [...statuses]

        // Toggle between online and degraded
        newStatuses[randomIndex] = {
          ...newStatuses[randomIndex],
          status: newStatuses[randomIndex].status === "online" ? "degraded" : "online",
          latency:
            newStatuses[randomIndex].status === "online"
              ? `${Math.floor(Math.random() * 100 + 200)}ms`
              : `${Math.floor(Math.random() * 50 + 20)}ms`,
        }

        setStatuses(newStatuses)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [statuses])

  return (
    <section className="py-16 container">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 shadow-lg overflow-hidden">
          <CardHeader className="bg-muted border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">0xUp Status Dashboard</CardTitle>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span suppressHydrationWarning>{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {statuses.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    {service.status === "online" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    ) : service.status === "degraded" ? (
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-3" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                    )}
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      Latency: <span className="font-medium">{service.latency}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Uptime: <span className="font-medium">{service.uptime}</span>
                    </div>
                    <Badge
                      variant={service.status === "online" ? "outline" : "secondary"}
                      className={`
                        ${service.status === "online" ? "border-green-500 text-green-500" : ""}
                        ${service.status === "degraded" ? "border-amber-500 text-amber-500" : ""}
                        ${service.status === "offline" ? "border-red-500 text-red-500" : ""}
                      `}
                    >
                      {service.status === "online" ? "Online" : service.status === "degraded" ? "Degraded" : "Offline"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-muted/50 p-4 text-sm text-center text-muted-foreground">
              Monitored by 24 decentralized validators across 6 regions
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

