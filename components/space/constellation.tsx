"use client"

import { useEffect, useRef, useState } from "react"

interface Star {
  x: number
  y: number
  baseX: number
  baseY: number
  connections: number[]
}

export function Constellation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [stars, setStars] = useState<Star[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    const starCount = 35
    const newStars: Star[] = []

    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * dimensions.width
      const y = Math.random() * dimensions.height
      newStars.push({
        x,
        y,
        baseX: x,
        baseY: y,
        connections: [],
      })
    }

    // Create connections based on proximity
    newStars.forEach((star, i) => {
      newStars.forEach((otherStar, j) => {
        if (i !== j) {
          const dist = Math.sqrt(
            Math.pow(star.baseX - otherStar.baseX, 2) +
              Math.pow(star.baseY - otherStar.baseY, 2)
          )
          if (dist < 200 && star.connections.length < 3) {
            star.connections.push(j)
          }
        }
      })
    })

    setStars(newStars)
  }, [dimensions])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const container = containerRef.current
    container?.addEventListener("mousemove", handleMouseMove)
    return () => container?.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Update star positions based on mouse proximity
  const getStarPosition = (star: Star) => {
    const dist = Math.sqrt(
      Math.pow(mousePos.x - star.baseX, 2) + Math.pow(mousePos.y - star.baseY, 2)
    )
    const maxDist = 150
    const influence = Math.max(0, 1 - dist / maxDist)
    const moveAmount = 20 * influence

    const angle = Math.atan2(mousePos.y - star.baseY, mousePos.x - star.baseX)
    return {
      x: star.baseX + Math.cos(angle) * moveAmount,
      y: star.baseY + Math.sin(angle) * moveAmount,
    }
  }

  const getLineOpacity = (star1: Star, star2: Star) => {
    const midX = (star1.baseX + star2.baseX) / 2
    const midY = (star1.baseY + star2.baseY) / 2
    const dist = Math.sqrt(
      Math.pow(mousePos.x - midX, 2) + Math.pow(mousePos.y - midY, 2)
    )
    const maxDist = 200
    const baseOpacity = 0.15
    const maxOpacity = 0.5
    const influence = Math.max(0, 1 - dist / maxDist)
    return baseOpacity + (maxOpacity - baseOpacity) * influence
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto"
    >
      <svg className="w-full h-full" style={{ position: "absolute" }}>
        {/* Draw connections */}
        {stars.map((star, i) =>
          star.connections.map((connIndex) => {
            const otherStar = stars[connIndex]
            if (!otherStar || connIndex < i) return null
            const pos1 = getStarPosition(star)
            const pos2 = getStarPosition(otherStar)
            const opacity = getLineOpacity(star, otherStar)
            return (
              <line
                key={`${i}-${connIndex}`}
                x1={pos1.x}
                y1={pos1.y}
                x2={pos2.x}
                y2={pos2.y}
                stroke={`rgba(192, 192, 192, ${opacity})`}
                strokeWidth="0.5"
                style={{ transition: "all 0.3s ease-out" }}
              />
            )
          })
        )}
        {/* Draw stars */}
        {stars.map((star, i) => {
          const pos = getStarPosition(star)
          return (
            <circle
              key={i}
              cx={pos.x}
              cy={pos.y}
              r={2}
              fill="rgba(255, 255, 255, 0.6)"
              style={{
                transition: "all 0.3s ease-out",
                filter: "blur(0.5px)",
              }}
            />
          )
        })}
      </svg>
    </div>
  )
}
