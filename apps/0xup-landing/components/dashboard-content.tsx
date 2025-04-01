"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, ExternalLink, MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for websites/APIs being monitored
const initialWebsites = [
  {
    id: "1",
    name: "Main dApp Frontend",
    url: "https://app.example.com",
    interval: 60,
    status: "online",
    uptime: "99.98%",
    checks: Array(30)
      .fill(null)
      .map((_, i) => (Math.random() > 0.1 ? "up" : "down")),
  },
  {
    id: "2",
    name: "API Gateway",
    url: "https://api.example.com/v1",
    interval: 30,
    status: "online",
    uptime: "99.95%",
    checks: Array(30)
      .fill(null)
      .map((_, i) => (Math.random() > 0.05 ? "up" : "down")),
  },
  {
    id: "3",
    name: "Smart Contract RPC",
    url: "https://rpc.example.com",
    interval: 120,
    status: "degraded",
    uptime: "98.72%",
    checks: Array(30)
      .fill(null)
      .map((_, i) => (Math.random() > 0.2 ? "up" : "down")),
  },
  {
    id: "4",
    name: "IPFS Gateway",
    url: "https://ipfs.example.com",
    interval: 300,
    status: "offline",
    uptime: "95.43%",
    checks: Array(30)
      .fill(null)
      .map((_, i) => (Math.random() > 0.4 ? "up" : "down")),
  },
]

export default function DashboardContent() {
  const [websites, setWebsites] = useState(initialWebsites)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newWebsite, setNewWebsite] = useState({
    name: "",
    url: "",
    interval: "60",
  })

  const handleAddWebsite = () => {
    const id = (websites.length + 1).toString()
    const website = {
      id,
      name: newWebsite.name,
      url: newWebsite.url,
      interval: Number.parseInt(newWebsite.interval),
      status: "online",
      uptime: "100.00%",
      checks: Array(30).fill("up"),
    }

    setWebsites([...websites, website])
    setNewWebsite({ name: "", url: "", interval: "60" })
    setIsAddDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "degraded":
        return "bg-amber-500"
      case "offline":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Monitored Endpoints</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Website
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Website or API</DialogTitle>
              <DialogDescription>Enter the details of the website or API you want to monitor.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newWebsite.name}
                  onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                  placeholder="My Website"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={newWebsite.url}
                  onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="interval">Check Interval</Label>
                <Select
                  value={newWebsite.interval}
                  onValueChange={(value) => setNewWebsite({ ...newWebsite, interval: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                    <SelectItem value="600">10 minutes</SelectItem>
                    <SelectItem value="1800">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddWebsite}>Add Website</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {websites.map((website) => (
          <Accordion key={website.id} type="single" collapsible className="w-full">
            <AccordionItem value={website.id}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{website.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <span className="truncate">{website.url}</span>
                        <a href={website.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-primary">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full ${getStatusColor(website.status)} mr-2`}></div>
                        <span className="text-sm font-medium capitalize">{website.status}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Pause Monitoring</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <AccordionTrigger className="py-2 px-6">
                  <span className="text-sm text-muted-foreground">View Details</span>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Last 30 Minutes Uptime</h4>
                        <div className="flex gap-1">
                          {website.checks.map((check, index) => (
                            <div
                              key={index}
                              className={`h-6 w-2 rounded-sm ${check === "up" ? "bg-green-500" : "bg-red-500"}`}
                              title={`${index + 1} minute(s) ago: ${check === "up" ? "Online" : "Offline"}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Check Interval</p>
                          <p className="font-medium">{website.interval} seconds</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Uptime</p>
                          <p className="font-medium">{website.uptime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <p className="font-medium flex items-center">
                            {website.status === "online" ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                Online
                              </>
                            ) : website.status === "offline" ? (
                              <>
                                <XCircle className="h-4 w-4 text-red-500 mr-1" />
                                Offline
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 text-amber-500 mr-1" />
                                Degraded
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-0">
                    <Button variant="outline" size="sm">
                      View Logs
                    </Button>
                    <Button size="sm">Check Now</Button>
                  </CardFooter>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        ))}
      </div>

      {websites.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">No websites or APIs are being monitored yet.</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your First Website
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

