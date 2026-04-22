import { NextResponse } from "next/server"

const SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
].join(" ")

export function GET() {
  const params = new URLSearchParams({
    client_id:     process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri:  "http://127.0.0.1:3000/api/spotify/callback",
    scope:         SCOPES,
  })

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  )
}
