import type { Metadata } from "next"
import { UptimeDashboard } from "@/components/dashboard/uptime-dashboard"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Uptime Dashboard | 0xUp - Web3 Monitoring",
  description: "Monitor your Web3 infrastructure with 0xUp's decentralized uptime monitoring platform.",
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background theme-transition">
      <Navbar />
      <main className="container py-8">
        <UptimeDashboard />
      </main>
      <Footer />
    </div>
  )
}

