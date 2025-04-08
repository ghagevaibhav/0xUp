"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { API_BACKEND_URL } from "@/config/config"
import type { Website as CorrectWebsite } from "@/types/website"

export default function useWebsites() {
  const { getToken } = useAuth();
  const [websites, setWebsites] = useState<CorrectWebsite[]>([]);

  async function refreshWebsites() {    
      const token = await getToken();
      if (!token) return;
      const response = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
        headers: {
            Authorization: `Bearer ${token}`,
          }
      });
      setWebsites(response.data.websites);
  }

  useEffect(() => {
      refreshWebsites();

      const interval = setInterval(() => {
          refreshWebsites();
      }, 1000 * 60 * 1);

      return () => clearInterval(interval);
  }, []);

  return { websites, refreshWebsites };
}