import Hero from "@/components/Hero"
// import Features from "@/components/features"
// import HowItWorks from "@/components/how-it-works"
// import CTA from "@/components/cta"
// import UptimeDemo from "@/components/uptime-demo"
import Navbar from "@/components/Navbar"
// import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        {/* <UptimeDemo />
        <Features />
        <HowItWorks />
        <CTA /> */}
      </main>
      {/* <Footer /> */}
    </div>
  )
}

