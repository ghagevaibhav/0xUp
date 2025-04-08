import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Shield, Clock, Zap } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2] bg-[length:20px_20px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-primary/20 via-background to-background rounded-b-[50%] opacity-60 blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1.5 bg-muted rounded-full text-sm font-medium">
            <span className="text-primary">New:</span> Staking rewards for validators
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Web3 Uptime Monitoring, Decentralized.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Real-time checks. Staked security. No central point of failure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button size="lg" asChild>
              <Link href="#cta">
                Get Early Access <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">Try Dashboard</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 w-full">
            <div className="flex flex-col items-center p-4 rounded-lg bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Trustless Verification</h3>
              <p className="text-sm text-muted-foreground text-center">
                Multiple validators confirm your service status
              </p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Real-time Alerts</h3>
              <p className="text-sm text-muted-foreground text-center">
                Instant notifications across multiple channels
              </p>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Low Latency</h3>
              <p className="text-sm text-muted-foreground text-center">
                Global validator network for minimal response time
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

