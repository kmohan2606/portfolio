"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"

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

const SPEED_PER_MS = 0.0000324

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}
function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function subscribeCoarse(cb: () => void) {
  const mq = window.matchMedia("(hover: none), (pointer: coarse)")
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}
function getCoarsePointer() {
  return window.matchMedia("(hover: none), (pointer: coarse)").matches
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef  = useRef<Star[]>([])
  const animRef   = useRef<number>()
  const reducedMotion = useSyncExternalStore(subscribeMotion, getReducedMotion, () => false)
  const coarsePointer = useSyncExternalStore(subscribeCoarse, getCoarsePointer, () => false)

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
    if (reducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    const isIOS =
      typeof navigator !== "undefined" &&
      /iP(ad|hone|od)/.test(navigator.userAgent)
    const lite = coarsePointer || isIOS

    const starCount = lite ? 550 : 2500
    const targetFps = lite ? 20 : 30
    const frameBudget = 1000 / targetFps
    const maxDpr = lite ? 1.25 : 2
    const useTrailFade = !lite
    const drawStreaks = !lite

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
      const w = Math.floor(window.innerWidth * dpr)
      const h = Math.floor(window.innerHeight * dpr)
      canvas.width = w
      canvas.height = h
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    starsRef.current = Array.from({ length: starCount }, () => randomStar(true))

    let lastTime = 0
    let running = true

    const draw = (timestamp: number) => {
      if (!running) return
      animRef.current = requestAnimationFrame(draw)

      if (timestamp - lastTime < frameBudget) return
      const delta = Math.min(timestamp - lastTime, 50)
      lastTime = timestamp

      const W = window.innerWidth
      const H = window.innerHeight
      const cx = W / 2
      const cy = H / 2
      const fov = Math.min(W, H) * 0.38

      if (useTrailFade) {
        ctx.fillStyle = "rgba(0,0,0,0.18)"
        ctx.fillRect(0, 0, W, H)
      } else {
        ctx.fillStyle = "#000000"
        ctx.fillRect(0, 0, W, H)
      }

      const advance = SPEED_PER_MS * delta
      const stars = starsRef.current

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        const prev = project(star, cx, cy, fov)
        star.z -= advance

        if (star.z <= 0) {
          stars[i] = randomStar(false)
          continue
        }

        const cur = project(star, cx, cy, fov)

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

        if (
          drawStreaks &&
          streakLen > 0.5 &&
          star.z < 0.85
        ) {
          ctx.globalAlpha = opacity * 0.85
          ctx.strokeStyle = rgba(star.color, 1)
          ctx.lineWidth = cur.size
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
      starsRef.current = Array.from({ length: starCount }, () => randomStar(true))
    }
    window.addEventListener("resize", handleResize)

    return () => {
      running = false
      if (animRef.current) cancelAnimationFrame(animRef.current)
      window.removeEventListener("resize", handleResize)
    }
  }, [coarsePointer, reducedMotion])

  const vignette = (
    <div
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%)",
      }}
    />
  )

  if (reducedMotion) {
    return vignette
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: "#000000",
          contain: "strict",
        }}
      />
      {vignette}
    </>
  )
}
