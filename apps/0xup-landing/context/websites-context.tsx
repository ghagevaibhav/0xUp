"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Website } from "@/types/website"
import useWebsites from "@/hooks/useWebsites"

interface WebsitesContextType {
  websites: Website[]
  isLoading: boolean
  error: Error | null
  refreshWebsites: () => Promise<void>
}

const WebsitesContext = createContext<WebsitesContextType | undefined>(undefined)

export function WebsitesProvider({ children, pollInterval }: { 
  children: ReactNode 
  pollInterval?: number 
}) {
  const { websites, refreshWebsites, isLoading, error } = useWebsites(pollInterval)

  const contextValue = {
    websites,
    isLoading,
    error,
    refreshWebsites
  }

  return (
    <WebsitesContext.Provider value={contextValue}>
      {children}
    </WebsitesContext.Provider>
  )
}

export function useWebsitesContext() {
  const context = useContext(WebsitesContext)
  if (context === undefined) {
    throw new Error("useWebsitesContext must be used within a WebsitesProvider")
  }
  return context
}