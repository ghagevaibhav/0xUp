import { ArrowRight, PlusCircle, Network, Bell } from "lucide-react"
import Image from 'next/image';
import { Architecture } from "./archiecture";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How 0xUp Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A simple, effective process to keep your Web3 infrastructure online 24/7.
          </p>
        </div>

        <div className="relative">
          {/* Flow diagram */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 transform -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1: Add API */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="h-20 w-20 bg-primary/10 flex items-center justify-center text-xl font-bold text-primary-foreground rounded-lg border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                  <PlusCircle className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute top-1/2 left-full transform -translate-y-1/2 hidden lg:block">
                  <ArrowRight className="h-6 w-6 text-primary mx-4" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">1. Add API</h3>
              <p className="text-muted-foreground">
                Register your endpoints, smart contracts, or APIs through our dashboard or API.
              </p>
            </div>

            {/* Step 2: Nodes Check */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="h-20 w-20 bg-primary/10 flex items-center justify-center text-xl font-bold text-primary-foreground rounded-lg border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                  <Network className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute top-1/2 left-full transform -translate-y-1/2 hidden lg:block">
                  <ArrowRight className="h-6 w-6 text-primary mx-4" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">2. Nodes Check</h3>
              <p className="text-muted-foreground">
                Our decentralized network of validators continuously checks your services for availability.
              </p>
            </div>

            {/* Step 3: Alerts */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="h-20 w-20 bg-primary/10 flex items-center justify-center text-xl font-bold text-primary-foreground rounded-lg border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                  <Bell className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">3. Alerts</h3>
              <p className="text-muted-foreground">
                Receive immediate notifications through your preferred channels when issues arise.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-card border rounded-lg overflow-hidden shadow-lg">
          <div className="p-2 md:p-8">
            <h3 className="text-2xl font-bold mb-4">0xUp's System Architecture</h3>
            <p className="text-muted-foreground mb-2">
              Our decentralized network ensures reliable monitoring through distributed consensus.
            </p>
          </div>
          <div className="bg-muted p-8 flex justify-center">
            <div className="relative h-[400px] w-full max-w-4xl">
              <Image src="/image.png" alt="System Architecture" layout="fill" objectFit="cover" />
              {/* <Architecture /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

