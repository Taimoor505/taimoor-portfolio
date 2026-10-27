import { NextRequest, NextResponse } from "next/server";

// Simple in-memory sliding window rate limiter (max 5 submissions per 10 minutes per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous-client";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many messages sent. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, subject, message, honeypot } = body;

    // Silent drop for bot submissions hitting honeypot
    if (honeypot) {
      return NextResponse.json({ ok: true, message: "Message received." });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Valid email address is required." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { ok: false, error: "Please enter a message of at least 10 characters." },
        { status: 400 }
      );
    }

    // Optional webhook forwarding if configured in environment
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            subject: (subject || "New Portfolio Contact").trim(),
            message: message.trim(),
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error("Failed to forward contact to webhook:", err);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Thanks for reaching out! I usually reply within 24 hours.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred while sending your message. Please try again." },
      { status: 500 }
    );
  }
}
