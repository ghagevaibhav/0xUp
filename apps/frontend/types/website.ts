export type Tick = {
  id: string;
  websiteId: string;
  validatorId: string;
  createdAt: string;
  status: "up" | "down";
  latency: number;
};
export interface Website {
  id: string;
  url: string;
  validatorsStaked?: number;
  ticks: Tick[];
}
