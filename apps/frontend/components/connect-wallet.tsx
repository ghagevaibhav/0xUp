/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image';

interface ConnectWalletProps {
  fullWidth?: boolean
}

export default function ConnectWallet({ fullWidth = false }: ConnectWalletProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleConnect = (type: string) => {
    // Simulate wallet connection
    const mockAddress = "0x" + Math.random().toString(16).slice(2, 12) + "..."
    setWalletAddress(mockAddress)
    setIsConnected(true)
    setIsDialogOpen(false)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setWalletAddress("")
  }

  return (
    <>
      {isConnected ? (
        <Button variant="outline" onClick={handleDisconnect} className={fullWidth ? "w-full" : ""}>
          <Wallet className="mr-2 h-4 w-4" />
          {walletAddress}
        </Button>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className={`gap-2 ${fullWidth ? "w-full" : ""}`}>
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect your wallet</DialogTitle>
              <DialogDescription>
                Connect your wallet to access early features and register for updates.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button onClick={() => handleConnect("metamask")} className="w-full">
                <Image src="/placeholder.svg" alt="MetaMask" width={24} height={24} className="mr-2" />
                MetaMask
              </Button>
              <Button onClick={() => handleConnect("walletconnect")} className="w-full">
                <Image src="/placeholder.svg" alt="WalletConnect" width={24} height={24} className="mr-2" />
                WalletConnect
              </Button>
              <Button onClick={() => handleConnect("coinbase")} className="w-full">
                <Image src="/placeholder.svg" alt="Coinbase Wallet" width={24} height={24} className="mr-2" />
                Coinbase Wallet
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
