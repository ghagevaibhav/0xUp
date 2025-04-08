"use client"

import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Logo() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative h-8 w-8 overflow-hidden rounded-full">
          <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">0x</div>
        </div>
        <span className="text-xl font-bold">0xUp</span>
      </div>
    )
  }

  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative h-8 w-8 overflow-hidden rounded-full">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(45)">
              <stop offset="0%" stopColor="hsl(var(--primary))" className="animate-pulse">
                <animate
                  attributeName="stop-color"
                  values="hsl(var(--primary)); hsl(var(--primary-foreground)); hsl(var(--primary))"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="hsl(var(--primary-foreground))" className="animate-pulse">
                <animate
                  attributeName="stop-color"
                  values="hsl(var(--primary-foreground)); hsl(var(--primary)); hsl(var(--primary-foreground))"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <mask id="mask">
              <rect width="32" height="32" fill="white" rx="16" />
              <rect x="4" y="4" width="24" height="24" fill="black" rx="12" />
            </mask>
          </defs>
          <rect width="32" height="32" fill="url(#gradient)" rx="16" mask="url(#mask)" />
          <path
            d="M11 16.5L13 20.5H10L8 16.5L10 12.5H13L11 16.5Z"
            fill={theme === "dark" ? "white" : "black"}
            className="animate-pulse"
          />
          <path
            d="M21 16.5L19 20.5H22L24 16.5L22 12.5H19L21 16.5Z"
            fill={theme === "dark" ? "white" : "black"}
            className="animate-pulse"
          />
          <rect
            x="15"
            y="11.5"
            width="2"
            height="10"
            fill={theme === "dark" ? "white" : "black"}
            className="animate-pulse"
          />
        </svg>
      </div>
      <span className="text-xl font-bold">0xUp</span>
    </Link>
  )
}

