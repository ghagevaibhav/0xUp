"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { API_BACKEND_URL } from "@/config"

interface Website {
  id: string
  url: string
  ticks: {
    id: string
    websiteId: string
    validatorId: string
    createdAt: Date
    status: "Up" | "Down"
    latency: number
  }[]
}

export default function useWebsites() {
  const { getToken } = useAuth()
  const [websites, setWebsites] = useState<Website[]>([])

  async function refreshWebsites() {
    const token = await getToken()
    const response = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    setWebsites(response.data.websites)
  }

  useEffect(() => {
    refreshWebsites()

    const interval = setInterval(
      () => {
        refreshWebsites()
      },
      1000 * 60 * 15,
    )
    return () => clearInterval(interval)
  }, [])

  return { websites, refreshWebsites }
}

