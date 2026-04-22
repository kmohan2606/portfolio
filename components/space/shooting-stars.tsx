"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ShootingStar {
  id: number
  startX: number
  startY: number
  angle: number
}

export function ShootingStars() {
  const [stars, setStars] = useState<ShootingStar[]>([])

  useEffect(() => {
    const createStar = () => {
      const newStar: ShootingStar = {
        id: Date.now(),
        startX: Math.random() * window.innerWidth * 0.7,
        startY: Math.random() * window.innerHeight * 0.3,
        angle: 30 + Math.random() * 30, // 30-60 degrees
      }
      setStars((prev) => [...prev, newStar])

      // Remove star after animation
      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== newStar.id))
      }, 1500)
    }

    // Create shooting stars at random intervals (4-8 seconds)
    const scheduleNext = () => {
      const delay = 4000 + Math.random() * 4000
      setTimeout(() => {
        createStar()
        scheduleNext()
      }, delay)
    }

    scheduleNext()

    return () => {}
  }, [])

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ x: star.startX, y: star.startY, opacity: 1, scale: 1 }}
            animate={{
              x: star.startX + Math.cos((star.angle * Math.PI) / 180) * 400,
              y: star.startY + Math.sin((star.angle * Math.PI) / 180) * 400,
              opacity: 0,
              scale: 0.5,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute"
          >
            <div
              className="w-1 h-1 bg-white rounded-full"
              style={{
                boxShadow: `
                  0 0 4px 2px rgba(255,255,255,0.8),
                  0 0 8px 4px rgba(255,255,255,0.4),
                  -20px 0 15px 1px rgba(255,255,255,0.3),
                  -40px 0 20px 1px rgba(255,255,255,0.2),
                  -60px 0 25px 1px rgba(255,255,255,0.1)
                `,
                transform: `rotate(${star.angle}deg)`,
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
