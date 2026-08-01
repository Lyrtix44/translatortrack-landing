export async function getFreshCustomerPortalUrl(
  customerId: string,
  subscriptionId?: string
): Promise<string | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
      ? "https://api.paddle.com"
      : "https://sandbox-api.paddle.com"

  const response = await fetch(`${baseUrl}/customers/${customerId}/portal-sessions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PADDLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscription_ids: subscriptionId ? [subscriptionId] : [],
    }),
  })

  if (!response.ok) {
    console.error("Failed to create portal session:", await response.text())
    return null
  }

  const data = await response.json()

  // With a subscriptionId supplied, Paddle also returns a subscription-specific
  // deep link; the general overview URL always comes back regardless
  return data.data.urls.general.overview as string
}