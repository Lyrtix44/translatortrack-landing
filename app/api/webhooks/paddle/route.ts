import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createAdminClient } from "@/lib/supabase/admin"

const PRICE_TO_PLAN: Record<string, "pro" | "studio"> = {
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO!]: "pro",
  [process.env.NEXT_PUBLIC_PADDLE_PRICE_STUDIO!]: "studio",
}

// Per Paddle's own documented guidance: only these statuses should grant access
const RETAINS_ACCESS = new Set(["trialing", "active", "past_due"])
const SIGNATURE_TOLERANCE_SECONDS = 30

function verifyPaddleSignature(rawBody: string, header: string | null): boolean {
  if (!header) return false
  const match = header.match(/^ts=(\d+);h1=([a-f0-9]+)$/)
  if (!match) return false
  const [, ts, receivedHash] = match
  const ageSeconds = Math.abs(Date.now() / 1000 - Number(ts))
  if (ageSeconds > SIGNATURE_TOLERANCE_SECONDS) return false
  const secret = process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET!
  const signedPayload = `${ts}:${rawBody}`
  const computedHash = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex")

  const computedBuffer = Buffer.from(computedHash)
  const receivedBuffer = Buffer.from(receivedHash)

  if (computedBuffer.length !== receivedBuffer.length) return false

  return crypto.timingSafeEqual(
    computedBuffer,
    receivedBuffer
  )
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get("paddle-signature")

  if (!verifyPaddleSignature(rawBody, signature)) {
    console.error("Invalid Paddle webhook signature")
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    )
  }

  const payload = JSON.parse(rawBody)
  const eventType: string = payload.event_type
  const data = payload.data
  const userId: string | undefined = data?.custom_data?.user_id

  if (!userId) {
    console.error(
      "Webhook missing user_id in custom_data:",
      eventType
    )

    return NextResponse.json({
      received: true,
      note: "no user_id",
    })
  }

  const supabase = createAdminClient()

  switch (eventType) {
    case "subscription.created":
    case "subscription.updated": {
      const priceId: string | undefined =
        data.items?.[0]?.price?.id

      const status: string = data.status

      const plan = RETAINS_ACCESS.has(status)
        ? (PRICE_TO_PLAN[priceId ?? ""] ?? "free")
        : "free"

      const scheduledCancel =
        data.scheduled_change?.action === "cancel"
          ? data.scheduled_change.effective_at
          : null

      await supabase
        .from("profiles")
        .update({
          plan,
          subscription_status: status,
          paddle_customer_id: data.customer_id,
          paddle_subscription_id: data.id,
          paddle_price_id: priceId,
          renews_at:
            data.current_billing_period?.ends_at ?? null,
          cancels_at: scheduledCancel,
        })
        .eq("id", userId)

      break
    }

    case "subscription.canceled": {
      await supabase
        .from("profiles")
        .update({
          plan: "free",
          subscription_status: "canceled",
          cancels_at: null,
        })
        .eq("id", userId)

      break
    }

    case "transaction.completed": {
      if (data.subscription_id) {
        await supabase
          .from("profiles")
          .update({
            subscription_status: "active",
          })
          .eq("id", userId)
      }

      break
    }

    default:
      break
  }

  return NextResponse.json({
    received: true,
  })
}