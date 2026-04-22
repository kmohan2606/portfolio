import dns from "node:dns"
import { NextResponse } from "next/server"

// Prefer IPv4 — avoids ETIMEDOUT when IPv6 routes are broken (common on macOS / some networks)
dns.setDefaultResultOrder("ipv4first")

const TOKEN_URL = "https://accounts.spotify.com/api/token"
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing"
const RECENTLY_PLAYED_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1"

const FETCH_TIMEOUT_MS = 25_000
const MAX_ATTEMPTS = 3

async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
  let lastErr: unknown
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await fetch(url, {
        ...init,
        cache: "no-store",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      })
    } catch (e) {
      lastErr = e
      if (attempt < MAX_ATTEMPTS - 1) {
        await new Promise((r) => setTimeout(r, 400 * 2 ** attempt))
      }
    }
  }
  throw lastErr
}

async function getAccessToken(): Promise<string> {
  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64")

  const res = await fetchWithRetry(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }),
  })

  if (!res.ok) {
    throw new Error(`token refresh failed: ${res.status}`)
  }

  const data = await res.json()
  return data.access_token
}

async function fetchSpotify(url: string, token: string): Promise<Response> {
  const res = await fetchWithRetry(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get("Retry-After") ?? "2", 10)
    await new Promise((r) => setTimeout(r, retryAfter * 1000))
    return fetchSpotify(url, token)
  }

  return res
}

export async function GET() {
  try {
    const token = await getAccessToken()

    const npRes = await fetchSpotify(NOW_PLAYING_URL, token)

    if (npRes.status === 200) {
      const data = await npRes.json()

      if (data?.item) {
        const track = data.item
        return NextResponse.json({
          isPlaying: data.is_playing,
          title: track.name,
          artist: track.artists.map((a: { name: string }) => a.name).join(", "),
          album: track.album.name,
          albumArt: track.album.images[1]?.url ?? track.album.images[0]?.url ?? null,
          songUrl: track.external_urls.spotify,
          progressMs: data.progress_ms,
          durationMs: track.duration_ms,
        })
      }
    }

    const rpRes = await fetchSpotify(RECENTLY_PLAYED_URL, token)

    if (!rpRes.ok) {
      return NextResponse.json({ isPlaying: false, title: null }, { status: 200 })
    }

    const rpData = await rpRes.json()
    const recent = rpData.items?.[0]?.track

    if (!recent) {
      return NextResponse.json({ isPlaying: false, title: null })
    }

    return NextResponse.json({
      isPlaying: false,
      title: recent.name,
      artist: recent.artists.map((a: { name: string }) => a.name).join(", "),
      album: recent.album.name,
      albumArt: recent.album.images[1]?.url ?? recent.album.images[0]?.url ?? null,
      songUrl: recent.external_urls.spotify,
      progressMs: null,
      durationMs: recent.duration_ms,
    })
  } catch (err) {
    console.error("spotify now-playing error:", err)
    return NextResponse.json({ error: "failed to fetch" }, { status: 500 })
  }
}
