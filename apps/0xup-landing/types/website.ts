export interface Tick {
  id: string
  websiteId: string
  validatorId: string
  createdAt: Date
  status: "Up" | "Down"
  latency: number
}

export interface Website {
  id: string
  url: string
  disabled: boolean
  userId: string
  validatorsStaked?: number
  ticks: Tick[]
}
