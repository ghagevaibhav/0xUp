"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Website as CorrectWebsite } from "@/types/website"
import useWebsites from "@/hooks/useWebsites"

interface WebsitesContextType {
  websites: CorrectWebsite[]
  refreshWebsites: () => Promise<void>
}

const WebsitesContext = createContext<WebsitesContextType | undefined>(undefined)

export function WebsitesProvider({ children }: { 
  children: ReactNode 
}) {
  const { websites, refreshWebsites } = useWebsites()

  const contextValue = {
    websites,
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