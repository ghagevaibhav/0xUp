import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ConnectWallet from "@/components/connect-wallet"

export default function CTA() {
  return (
    <section id="cta" className="py-20 bg-muted/50">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to secure your Web3 infrastructure?</h2>
            <p className="text-xl text-muted-foreground mb-6">
              Join our early access program and be the first to experience decentralized uptime monitoring.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold">1</span>
                </div>
                <p>Connect your wallet to verify ownership</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold">2</span>
                </div>
                <p>Register for early access with your email</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold">3</span>
                </div>
                <p>Get notified when we launch</p>
              </div>
            </div>
          </div>

          <div>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Get Early Access</CardTitle>
                <CardDescription>Join our waitlist to be notified when we launch.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Connect Wallet</label>
                  <ConnectWallet fullWidth />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Join Waitlist</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

