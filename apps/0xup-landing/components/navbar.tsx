"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"
import ConnectWallet from "@/components/connect-wallet"
import Logo from "@/components/logo"
import { ThemeToggle } from "./theme-toggle"
import { SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center">
        <div className="flex-1">
          <Logo />
        </div>

        <nav className="hidden md:flex items-center justify-center gap-6 flex-1">
          <Link href="#features" className="text-sm font-medium hover:text-primary">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
            How It Works
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
            Dashboard
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary">
            Docs
          </Link>
        </nav>

        <div className="flex-1 flex items-center justify-end gap-4">
        <ThemeToggle />
          <div className="text-sm pr-4 font-medium hover:text-primary">
            <SignInButton >
              <UserButton />
            </SignInButton>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden container py-4 bg-background border-b">
          <nav className="flex flex-col gap-4">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Docs
            </Link>
            <div className="pt-2">
              <ConnectWallet />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

