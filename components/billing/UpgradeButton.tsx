"use client"
import { usePaddle } from "@/lib/paddle/use-paddle"
import { Button } from "@/components/ui/button"

export function UpgradeButton({
  priceId,
  planName,
  userEmail,
  userId,
}: {
  priceId?: string  // now optional
  planName: string
  userEmail: string
  userId: string
}) {
  const paddle = usePaddle()

  function handleClick() {
    if (!priceId) {
      // This shouldn't happen, but just in case:
      console.error("No priceId provided for upgrade")
      return
    }
    paddle?.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: userEmail },
      customData: { user_id: userId },
      settings: {
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      },
    })
  }

  // If priceId is missing, show a disabled button or fallback
  if (!priceId) {
    return (
      <Button disabled className="w-full bg-gray-300 text-gray-500 font-semibold py-2.5 rounded-lg text-sm cursor-not-allowed">
        Plan unavailable
      </Button>
    )
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