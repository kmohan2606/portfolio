"use client"

import { useEffect, useState } from "react"
import { Music2 } from "lucide-react"

interface NowPlaying {
  isPlaying: boolean
  title: string | null
  artist: string | null
  album: string | null
  albumArt: string | null
  songUrl: string | null
  progressMs: number | null
  durationMs: number | null
}

const POLL_INTERVAL = 30_000

const shellClass =
  "relative flex items-center gap-3 rounded-xl p-3 w-full transition-colors"
const shellClassStacked =
  "relative flex flex-col gap-3 rounded-xl p-3 w-full transition-colors"
const shellStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
} as const

function SpotifyLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="rgba(255,255,255,0.18)"
      className="flex-shrink-0"
      aria-hidden
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

/** Always renders the same outer shell so layout is stable before & after fetch */
export function SpotifyBadge() {
  const [data, setData] = useState<NowPlaying | null>(null)
  const [phase, setPhase] = useState<"loading" | "ready" | "empty">("loading")

  const fetchNowPlaying = async () => {
    try {
      const res = await fetch("/api/spotify/now-playing")
      if (!res.ok) {
        setPhase("empty")
        return
      }
      const json = await res.json()
      setData(json)
      setPhase(json?.title ? "ready" : "empty")
    } catch {
      setPhase("empty")
    }
  }

  useEffect(() => {
    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  if (phase === "loading") {
    return (
      <div
        className={shellClass}
        style={shellStyle}
        role="status"
        aria-busy="true"
        aria-label="loading spotify"
      >
        <div
          className="w-10 h-10 rounded-md flex-shrink-0 animate-pulse"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div className="flex flex-col min-w-0 flex-1 gap-2 py-0.5">
          <div
            className="h-2 w-16 rounded animate-pulse"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <div
            className="h-3.5 w-3/4 max-w-[180px] rounded animate-pulse"
            style={{ background: "rgba(255,255,255,0.07)" }}
          />
          <div
            className="h-2.5 w-1/2 max-w-[120px] rounded animate-pulse"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
        </div>
        <SpotifyLogo />
      </div>
    )
  }

  if (phase === "empty" || !data?.title) {
    return (
      <div
        className={shellClass}
        style={shellStyle}
        role="status"
        aria-label="spotify unavailable"
      >
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(168,85,247,0.12)" }}
        >
          <Music2 size={16} style={{ color: "rgba(168,85,247,0.45)" }} />
        </div>
        <div className="flex flex-col min-w-0 flex-1 justify-center">
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            spotify
          </p>
          <p
            className="truncate"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            couldn&apos;t load playback
          </p>
        </div>
        <SpotifyLogo />
      </div>
    )
  }

  const progress =
    data.progressMs != null && data.durationMs
      ? (data.progressMs / data.durationMs) * 100
      : null

  const ariaLabel = data.isPlaying
    ? `now playing: ${data.title}${data.artist ? ` by ${data.artist}` : ""}. opens in spotify.`
    : `last played: ${data.title}${data.artist ? ` by ${data.artist}` : ""}. opens in spotify.`

  return (
    <a
      href={data.songUrl ?? "https://open.spotify.com"}
      target="_blank"
      rel="noopener noreferrer"
      className={shellClassStacked}
      style={{ ...shellStyle, textDecoration: "none" }}
      aria-label={ariaLabel}
    >
      <div className="flex items-start gap-3 w-full min-w-0">
        <span
          className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={
            data.isPlaying
              ? {
                  background: "#1db954",
                  boxShadow: "0 0 5px #1db954",
                  animation: "pulse 2s ease-in-out infinite",
                }
              : { background: "rgba(255,255,255,0.35)" }
          }
          aria-hidden
        />
        <span
          className="lowercase leading-snug"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.04em",
            color: data.isPlaying ? "#1db954" : "rgba(255,255,255,0.42)",
          }}
        >
          {data.isPlaying ? "live" : "last listened to"}
        </span>
      </div>

      <div className="flex items-center gap-3 min-w-0 w-full">
        {data.albumArt ? (
          <img
            src={data.albumArt}
            alt=""
            width={40}
            height={40}
            className="rounded-md flex-shrink-0"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(168,85,247,0.15)" }}
          >
            <Music2 size={16} style={{ color: "rgba(168,85,247,0.7)" }} />
          </div>
        )}

        <div className="flex flex-col min-w-0 flex-1">
          <p className="truncate leading-relaxed text-white">{data.title}</p>

          <p
            className="truncate"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              color: "rgba(255,255,255,0.38)",
            }}
          >
            {data.artist}
          </p>

          {data.isPlaying && progress != null && (
            <div
              className="mt-1.5 w-full rounded-full overflow-hidden"
              style={{ height: "2px", background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "#1db954",
                  transition: "width 1s linear",
                }}
              />
            </div>
          )}
        </div>

        <SpotifyLogo />
      </div>
    </a>
  )
}
