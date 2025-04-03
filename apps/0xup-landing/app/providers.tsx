"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { WebsitesProvider } from "@/context/websites-context"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <WebsitesProvider pollInterval={5000}>{children}</WebsitesProvider>
    </ThemeProvider>
  )
}

