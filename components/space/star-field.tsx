"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  z: number
  color: string
}

const COLORS = [
  "#ffffff", "#ffffff", "#ffffff", "#ffffff",
  "#cce8ff",
  "#d8b4fe",
  "#a855f7",
]

const COLOR_RGB: Record<string, string> = {
  "#ffffff": "255,255,255",
  "#cce8ff": "204,232,255",
  "#d8b4fe": "216,180,254",
  "#a855f7": "168,85,247",
}

function rgba(hex: string, a: number) {
  return `rgba(${COLOR_RGB[hex] ?? "255,255,255"},${a})`
}

const STAR_COUNT  = 2500
const SPEED_PER_MS = 0.0000324
const TARGET_FPS  = 30
const FRAME_BUDGET = 1000 / TARGET_FPS  // ~33ms

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef  = useRef<Star[]>([])
  const animRef   = useRef<number>()

  function randomStar(spreadZ = false): Star {
    return {
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: spreadZ ? Math.random() : 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }
  }

  function project(star: Star, cx: number, cy: number, fov: number) {
    const depth = star.z + 0.00001
    const scale = fov / depth
    return {
      px: cx + star.x * scale,
      py: cy + star.y * scale,
      size: Math.max(0.2, (1 - star.z) * 2.2),
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    starsRef.current = Array.from({ length: STAR_COUNT }, () => randomStar(true))

    let lastTime = 0

    const draw = (timestamp: number) => {
      animRef.current = requestAnimationFrame(draw)

      // Throttle to TARGET_FPS
      if (timestamp - lastTime < FRAME_BUDGET) return
      const delta = Math.min(timestamp - lastTime, 50)
      lastTime = timestamp

      const W   = canvas.width
      const H   = canvas.height
      const cx  = W / 2
      const cy  = H / 2
      const fov = Math.min(W, H) * 0.38

      // Trail fade
      ctx.fillStyle = "rgba(0,0,0,0.18)"
      ctx.fillRect(0, 0, W, H)

      const advance = SPEED_PER_MS * delta
      const stars   = starsRef.current

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        const prev = project(star, cx, cy, fov)
        star.z -= advance

        if (star.z <= 0) {
          stars[i] = randomStar(false)
          continue
        }

        const cur = project(star, cx, cy, fov)

        // Cull off-screen
        if (
          cur.px < -W * 0.1 || cur.px > W * 1.1 ||
          cur.py < -H * 0.1 || cur.py > H * 1.1
        ) {
          stars[i] = randomStar(false)
          continue
        }

        const opacity = Math.min(1, (1 - star.z) * 1.4 + 0.05)
        const dx = cur.px - prev.px
        const dy = cur.py - prev.py
        const streakLen = Math.sqrt(dx * dx + dy * dy)

        if (streakLen > 0.5 && star.z < 0.85) {
          // Use globalAlpha instead of createLinearGradient — much cheaper
          ctx.globalAlpha = opacity * 0.85
          ctx.strokeStyle = rgba(star.color, 1)
          ctx.lineWidth   = cur.size
          ctx.beginPath()
          ctx.moveTo(prev.px, prev.py)
          ctx.lineTo(cur.px, cur.py)
          ctx.stroke()
          ctx.globalAlpha = 1
        } else {
          ctx.beginPath()
          ctx.arc(cur.px, cur.py, Math.max(0.3, cur.size * 0.5), 0, Math.PI * 2)
          ctx.fillStyle = rgba(star.color, opacity)
          ctx.fill()
        }
      }
    }

    animRef.current = requestAnimationFrame(draw)

    const handleResize = () => {
      resize()
      starsRef.current = Array.from({ length: STAR_COUNT }, () => randomStar(true))
    }
    window.addEventListener("resize", handleResize)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "#000000" }}
      />
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)",
        }}
      />
    </>
  )
}
