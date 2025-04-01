import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Shield, Zap, Globe, LineChart, Webhook, Lock, Coins, History } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: Bell,
      title: "Real-time Alerts",
      description: "Receive instant notifications via Discord, Telegram, Slack, or email when your services go down.",
    },
    {
      icon: Shield,
      title: "Decentralized Verification",
      description: "Multiple validators confirm your service status to prevent false positives and ensure accuracy.",
    },
    {
      icon: Zap,
      title: "Off-Chain Checks",
      description: "Monitor traditional web services, APIs, and endpoints alongside your blockchain infrastructure.",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Validators distributed across the globe provide monitoring from multiple geographic regions.",
    },
    {
      icon: LineChart,
      title: "Advanced Analytics",
      description: "Detailed uptime reports, historical data, and performance metrics to optimize your services.",
    },
    {
      icon: Webhook,
      title: "Webhook Integration",
      description: "Trigger custom actions and recovery processes automatically when issues are detected.",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "End-to-end encryption for sensitive endpoints with customizable privacy settings.",
    },
    {
      icon: Coins,
      title: "Staking for Validators",
      description: "Earn rewards by running a validator node and contributing to the monitoring network.",
    },
    {
      icon: History,
      title: "Historical Reporting",
      description: "Access comprehensive historical data to identify patterns and improve reliability.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Monitoring Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to ensure your Web3 infrastructure is always available and performing optimally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border bg-card hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

