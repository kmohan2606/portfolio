"use client"

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, Code2, Mail, FileDown, Menu, X } from "lucide-react"

const orbs = [
  { id: "experience", icon: Briefcase, label: "Experience", action: "scroll" },
  { id: "projects", icon: Code2, label: "Projects", action: "scroll" },
  { id: "contact", icon: Mail, label: "Contact", action: "scroll" },
  { id: "resume", icon: FileDown, label: "Resume", action: "download" },
] as const

function computeNavMode(): { compactNav: boolean; showKeybinds: boolean } {
  const w = window.innerWidth
  const h = window.innerHeight
  const ar = w / h

  const compactNav =
    w < 768 ||
    (w < 1024 && h > w) ||
    (w < 900 && ar < 1.15)

  const showKeybinds = !compactNav && w >= 900 && ar >= 1.05

  return { compactNav, showKeybinds }
}

export function SideNav() {
  const [compactNav, setCompactNav] = useState(true)
  const [showKeybinds, setShowKeybinds] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const menuPanelRef = useRef<HTMLDivElement>(null)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  const handleOrb = useCallback((orb: (typeof orbs)[number]) => {
    if (orb.action === "download") {
      const a = document.createElement("a")
      a.href = "/resume.pdf"
      a.download = "Kedarnath_Mohan_Resume.pdf"
      a.click()
    } else {
      scrollTo(orb.id)
    }
  }, [])

  useLayoutEffect(() => {
    const sync = () => {
      const m = computeNavMode()
      setCompactNav(m.compactNav)
      setShowKeybinds(m.showKeybinds)
      if (!m.compactNav) setMenuOpen(false)
    }
    sync()
    window.addEventListener("resize", sync)
    return () => window.removeEventListener("resize", sync)
  }, [])

  useEffect(() => {
    if (!showKeybinds) return
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const index = ["1", "2", "3", "4"].indexOf(e.key)
      if (index !== -1) handleOrb(orbs[index])
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [showKeybinds, handleOrb])

  useEffect(() => {
    if (!menuOpen) return
    const onDoc = (e: MouseEvent) => {
      if (menuPanelRef.current?.contains(e.target as Node)) return
      setMenuOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [menuOpen])

  const orbButtonStyle = (isHovered: boolean) => ({
    background: "rgba(255,255,255,0.04)",
    borderWidth: "1px",
    borderStyle: "solid" as const,
    borderColor: isHovered ? "rgba(168,85,247,0.4)" : "rgba(255,255,255,0.08)",
    boxShadow: isHovered
      ? "0 0 0 1px rgba(168,85,247,0.3), 0 0 18px 5px rgba(168,85,247,0.22)"
      : "none",
    color: isHovered ? "rgba(216,180,254,0.9)" : "rgba(255,255,255,0.45)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    transition: "box-shadow 0.12s ease-out, border-color 0.12s ease-out, color 0.12s ease-out",
  })

  /* ── Compact: single menu top-left (symmetrical with notification top-right) ── */
  if (compactNav) {
    return (
      <div ref={menuPanelRef} className="fixed top-5 left-5 z-50">
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "close navigation" : "open navigation"}
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={orbButtonStyle(menuOpen)}
          whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
        >
          {menuOpen ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
        </motion.button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 top-[52px] flex flex-col gap-2 min-w-[200px] rounded-2xl p-2"
              style={{
                background: "rgba(8,8,18,0.94)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              {orbs.map((orb, i) => (
                <button
                  key={orb.id}
                  type="button"
                  onClick={() => {
                    handleOrb(orb)
                    setMenuOpen(false)
                  }}
                  className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-colors"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.75)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(168,85,247,0.12)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent"
                  }}
                >
                  <orb.icon size={15} strokeWidth={1.5} className="text-white/50 flex-shrink-0" />
                  <span className="lowercase">{orb.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  /* ── Desktop: vertical dock mid-left ── */
  return (
    <div className="fixed left-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {orbs.map((orb, i) => {
        const isHovered = hoveredIdx === i
        return (
          <motion.button
            key={orb.id}
            type="button"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 + 0.5, duration: 0.4, ease: "easeOut" }}
            onClick={() => handleOrb(orb)}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            title={showKeybinds ? `${orb.label} [${i + 1}]` : orb.label}
            className="group relative w-11 h-11 rounded-2xl flex items-center justify-center"
            style={orbButtonStyle(isHovered)}
            whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
          >
            <orb.icon size={15} strokeWidth={1.5} />

            {showKeybinds && (
              <span
                className="absolute bottom-0 right-0 translate-x-1 translate-y-1 w-[18px] h-[18px] rounded-[3px] flex items-center justify-center select-none"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  fontWeight: 700,
                  lineHeight: 1,
                  color: "rgba(220,220,220,0.9)",
                  background: "linear-gradient(to bottom, #787878, #4a4a4a)",
                  border: "1px solid rgba(120,120,120,0.35)",
                  boxShadow:
                    "0 2.5px 0 rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.08)",
                }}
              >
                {i + 1}
              </span>
            )}

            <span
              className="pointer-events-none absolute left-14 whitespace-nowrap rounded-md px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              style={{
                fontFamily: "var(--font-mono)",
                color: "rgba(255,255,255,0.55)",
                background: "rgba(0,0,0,0.72)",
                border: "1px solid rgba(255,255,255,0.07)",
                letterSpacing: "0.04em",
              }}
            >
              {orb.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
