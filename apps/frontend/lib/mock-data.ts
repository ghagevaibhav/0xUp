import type { Tick, Website } from "@/types/website"

// Helper to generate random ticks
function generateTicks(websiteId: string, count: number, upProbability: number) {
    const now = new Date()
    const ticks: Tick[] = [] // Explicitly type the array
  
    for (let i = 0; i < count; i++) {
      const createdAt = new Date(now.getTime() - i * 3 * 60 * 1000) // 3 minutes apart
      const isUp = Math.random() < upProbability
  
      ticks.push({
        id: `tick-${websiteId}-${i}`,
        websiteId,
        validatorId: `validator-${Math.floor(Math.random() * 10)}`,
        createdAt: createdAt.toISOString(),
        status: isUp ? "up" : "down", // This now matches the union type
        latency: isUp ? Math.floor(Math.random() * 200) + 20 : 0,
      })
    }
  
    return ticks
  }

export const mockWebsites: Website[] = [
  {
    id: "website-1",
    url: "https://api.0xup.com/v1/status",
    validatorsStaked: 42,
    ticks: generateTicks("website-1", 60, 0.98), // 98% uptime
  },
  {
    id: "website-2",
    url: "https://app.0xup.com",
    validatorsStaked: 36,
    ticks: generateTicks("website-2", 60, 0.995), // 99.5% uptime
  },
  {
    id: "website-3",
    url: "https://rpc.ethereum.0xup.com",
    validatorsStaked: 28,
    ticks: generateTicks("website-3", 60, 0.92), // 92% uptime (critical)
  },
  {
    id: "website-4",
    url: "https://ipfs.0xup.com/gateway",
    validatorsStaked: 19,
    ticks: generateTicks("website-4", 60, 0.97), // 97% uptime
  },
  {
    id: "website-5",
    url: "https://docs.0xup.com",
    validatorsStaked: 15,
    ticks: generateTicks("website-5", 60, 1.0), // 100% uptime
  },
  {
    id: "website-6",
    url: "https://bridge.0xup.com",
    validatorsStaked: 51,
    ticks: generateTicks("website-6", 60, 0.89), // 89% uptime (critical)
  },
]

