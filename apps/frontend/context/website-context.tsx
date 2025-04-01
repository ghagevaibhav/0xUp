"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { mockWebsites } from "@/lib/mock-data"
import { Website } from "@/types/website"

interface WebsitesContextType {
  websites: Website[]
  isLoading: boolean
  refreshWebsites: () => Promise<void>
}

const WebsitesContext = createContext<WebsitesContextType | undefined>(undefined)

export function WebsitesProvider({ children }: { children: ReactNode }) {
  const [websites, setWebsites] = useState<Website[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshWebsites = async () => {
    setIsLoading(true)
    try {
      // In a real app, we would use the useWebsites hook here
      // For now, we'll use mock data with a delay to simulate loading
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setWebsites(mockWebsites)
    } catch (error) {
      console.error("Failed to fetch websites:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshWebsites()

    // Set up a refresh interval (every 5 minutes)
    const interval = setInterval(
      () => {
        refreshWebsites()
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [])

  return (
    <WebsitesContext.Provider value={{ websites, isLoading, refreshWebsites }}>{children}</WebsitesContext.Provider>
  )
}

export function useWebsitesContext() {
  const context = useContext(WebsitesContext)
  if (context === undefined) {
    throw new Error("useWebsitesContext must be used within a WebsitesProvider")
  }
  return context
}

