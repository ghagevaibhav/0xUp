"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"

interface TrendChartProps {
  data: number[]
  height?: number
  width?: number
  strokeColor?: string
  fillColor?: string
  className?: string
}

export function TrendChart({ data, height = 40, width = 100, strokeColor, fillColor, className }: TrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Set colors based on theme
    const stroke = strokeColor || (theme === "dark" ? "#38bdf8" : "#0ea5e9")
    const fill = fillColor || (theme === "dark" ? "rgba(56, 189, 248, 0.1)" : "rgba(14, 165, 233, 0.1)")

    // Calculate points
    const points = data.map((value, index) => ({
      x: (index / (data.length - 1)) * width,
      y: height - (value / 100) * height,
    }))

    // Draw line
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length; i++) {
      // Use bezier curves for smoother lines
      const prevPoint = points[i - 1]
      const currPoint = points[i]

      const cp1x = prevPoint.x + (currPoint.x - prevPoint.x) / 3
      const cp1y = prevPoint.y
      const cp2x = prevPoint.x + (2 * (currPoint.x - prevPoint.x)) / 3
      const cp2y = currPoint.y

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, currPoint.x, currPoint.y)
    }

    // Line style
    ctx.strokeStyle = stroke
    ctx.lineWidth = 2
    ctx.stroke()

    // Fill area under the line
    ctx.lineTo(points[points.length - 1].x, height)
    ctx.lineTo(points[0].x, height)
    ctx.closePath()
    ctx.fillStyle = fill
    ctx.fill()
  }, [data, height, width, strokeColor, fillColor, theme, mounted])

  return <canvas ref={canvasRef} height={height} width={width} className={className} />
}

