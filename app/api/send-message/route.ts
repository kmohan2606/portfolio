import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Basic in-memory rate limiter — one message per IP per 60 seconds
const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_MS = 60_000

const MESSAGES_FILE = path.join(process.cwd(), "data", "messages.json")

function readMessages(): object[] {
  try {
    fs.mkdirSync(path.dirname(MESSAGES_FILE), { recursive: true })
    if (!fs.existsSync(MESSAGES_FILE)) return []
    return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"))
  } catch {
    return []
  }
}

function writeMessages(messages: object[]) {
  fs.mkdirSync(path.dirname(MESSAGES_FILE), { recursive: true })
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf-8")
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  const lastSent = rateLimitMap.get(ip) ?? 0
  if (Date.now() - lastSent < RATE_LIMIT_MS) {
    return NextResponse.json(
      { error: "please wait a moment before sending another message." },
      { status: 429 }
    )
  }

  const { name, phone, message } = await req.json()

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "message cannot be empty." }, { status: 400 })
  }
  if (message.trim().length > 500) {
    return NextResponse.json({ error: "message too long (max 500 characters)." }, { status: 400 })
  }

  const entry = {
    timestamp: new Date().toISOString(),
    name: name?.trim() || null,
    phone: phone?.trim() || null,
    message: message.trim(),
    ip,
  }

  try {
    const messages = readMessages()
    messages.push(entry)
    writeMessages(messages)

    rateLimitMap.set(ip, Date.now())
    return NextResponse.json({ success: true, autoReplied: false })
  } catch (err) {
    console.error("failed to save message:", err)
    return NextResponse.json({ error: "failed to save. try again later." }, { status: 500 })
  }
}
