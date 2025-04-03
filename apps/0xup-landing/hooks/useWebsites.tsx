"use client"

import axios from "axios"
import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@clerk/nextjs"
import { API_BACKEND_URL } from "@/config/config"
import { Tick, Website } from "@/types/website"

interface ApiTick {
  id: string
  websiteId: string
  validatorId: string
  createdAt: Date
  status: "Up" | "Down"
  latency: number
}

interface ApiWebsite {
  id: string
  url: string
  disabled: boolean
  userId: string
  validatorsStaked?: number
  ticks: ApiTick[]
}

interface ApiResponse {
  websites: ApiWebsite[]
}

export default function useWebsites(pollInterval?: number) {
  const { getToken } = useAuth()
  const [websites, setWebsites] = useState<Website[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refreshWebsites = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = await getToken()
      const response = await axios.get<ApiResponse>(`${API_BACKEND_URL}/api/v1/websites`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      const websites = response.data.websites.map((website: ApiWebsite) => ({
        ...website,
        ticks: website.ticks.map((tick: ApiTick) => ({
          ...tick,
          createdAt: new Date(tick.createdAt)
        }))
      }))

      setWebsites(websites)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch websites'))
      console.error("Failed to fetch websites:", err)
    } finally {
      setIsLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    const abortController = new AbortController()

    const fetchData = async () => {
      try {
        const token = await getToken()
        const response = await axios.get<ApiResponse>(`${API_BACKEND_URL}/api/v1/websites`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal
        })
        
        const websites = response.data.websites.map((website: ApiWebsite) => ({
          ...website,
          ticks: website.ticks.map((tick: ApiTick) => ({
            ...tick,
            createdAt: new Date(tick.createdAt)
          }))
        }))

        setWebsites(websites)
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch websites'))
          console.error("Failed to fetch websites:", err)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, pollInterval)
    
    return () => {
      abortController.abort()
      clearInterval(interval)
    }
  }, [getToken, pollInterval])

  return { websites, refreshWebsites, isLoading, error }
}