"use client"

import { ThemeProvider } from "@/components/ThemeProvider"
import { WebsitesProvider } from "@/context/website-context"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <WebsitesProvider>{children}</WebsitesProvider>
    </ThemeProvider>
  )
}

