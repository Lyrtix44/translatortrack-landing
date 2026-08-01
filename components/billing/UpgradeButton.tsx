// components/billing/UpgradeButton.tsx
"use client"
import { usePaddle } from "@/lib/paddle/use-paddle"
import { Button } from "@/components/ui/button"

export function UpgradeButton({
  priceId,
  planName,
  userEmail,
  userId,
}: {
  priceId: string
  planName: string
  userEmail: string
  userId: string
}) {
  const paddle = usePaddle()

  function handleClick() {
    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: userEmail },
      customData: { user_id: userId },   // ← this is the bridge
      settings: {
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      },
    })
  }

  return (
    <Button
      onClick={handleClick}
      disabled={!paddle}
      className="w-full bg-ink hover:bg-ink-light text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
    >
      {paddle ? `Switch to ${planName}` : "Loading..."}
    </Button>
  )
}