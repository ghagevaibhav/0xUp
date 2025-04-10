import type { Tick } from "@/types/website"

export function calculateUptimePercentage(ticks: Tick[]): number {
  if (ticks.length === 0) return 100

  const upTicks = ticks.filter((tick) => tick.status === "Up").length
  return (upTicks / ticks.length) * 100
}

export function getLatestTick(ticks: Tick[]): Tick | null {
  if (ticks.length === 0) return null

  return ticks.reduce((latest, current) => {
    const latestDate = new Date(latest.createdAt)
    const currentDate = new Date(current.createdAt)
    return currentDate > latestDate ? current : latest
  }, ticks[0])
}

export function aggregateTicksInWindows(ticks: Tick[], windowMinutes: number): Tick[] {
  if (ticks.length === 0) return []

  // Sort ticks by createdAt
  const sortedTicks = [...ticks].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  const windows: Record<string, Tick[]> = {}

  // Group ticks into time windows
  sortedTicks.forEach((tick) => {
    const tickTime = new Date(tick.createdAt)
    // Round down to the nearest window
    const windowTime = new Date(
      tickTime.getFullYear(),
      tickTime.getMonth(),
      tickTime.getDate(),
      tickTime.getHours(),
      Math.floor(tickTime.getMinutes() / windowMinutes) * windowMinutes,
    )

    const windowKey = windowTime.toISOString()

    if (!windows[windowKey]) {
      windows[windowKey] = []
    }

    windows[windowKey].push(tick)
  })

  // Aggregate each window
  return Object.entries(windows)
    .map(([windowKey, windowTicks]) => {
      const upTicks = windowTicks.filter((t) => t.status === "Up").length
      const downTicks = windowTicks.length - upTicks
      const avgLatency = windowTicks.reduce((sum, t) => sum + (t.latency || 0), 0) / windowTicks.length

      return {
        id: windowKey,
        websiteId: windowTicks[0].websiteId,
        validatorId: windowTicks[0].validatorId,
        createdAt: new Date(windowKey),
        status: upTicks > downTicks ? ("Up" as const) : ("Down" as const),
        latency: Math.round(avgLatency),
      }
    })
    .slice(-20) // Return the last 20 windows
}

