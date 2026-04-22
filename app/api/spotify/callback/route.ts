import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  const error = req.nextUrl.searchParams.get("error")

  if (error || !code) {
    return NextResponse.json({ error: error ?? "no code returned" }, { status: 400 })
  }

  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64")

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:  `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type:   "authorization_code",
      code,
      redirect_uri: "http://127.0.0.1:3000/api/spotify/callback",
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json({ error: data }, { status: res.status })
  }

  // Show the refresh token so you can paste it into .env.local
  return new NextResponse(
    `<html><body style="font-family:monospace;padding:40px;background:#000;color:#fff">
      <h2 style="color:#a855f7">✓ spotify auth complete</h2>
      <p>copy this into your <code>.env.local</code>:</p>
      <pre style="background:#111;padding:16px;border-radius:8px;border:1px solid #333;color:#d8b4fe">SPOTIFY_REFRESH_TOKEN=${data.refresh_token}</pre>
      <p style="color:#666;font-size:12px">then restart the dev server — this route is no longer needed.</p>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  )
}
