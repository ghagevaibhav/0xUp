import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Twitter, DiscIcon as Discord } from "lucide-react"
import Logo from "@/components/logo"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            {/* Render Logo directly without wrapping it in a Link */}
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Decentralized uptime monitoring for Web3 infrastructure. Ensure your dApps, APIs, and smart contracts are
              always online.
            </p>
            <div className="flex items-center gap-4 mb-4">
              <Button size="icon" variant="ghost">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button size="icon" variant="ghost">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button size="icon" variant="ghost">
                <Discord className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Subscribe to our newsletter</h3>
              <div className="flex gap-2">
                <Input placeholder="Enter your email" className="max-w-xs" />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  API
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} 0xUp. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

