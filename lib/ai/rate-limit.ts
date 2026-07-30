// lib/ai/rate-limit.ts
import { createClient } from "@/lib/supabase/server"

const DAILY_LIMITS: Record<string, number> = {
  free: 5,
  pro: 100,
  studio: 100,
}

export async function checkAndLogAiUsage(
  userId: string,
  feature: string
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = await createClient()

  // Fetch user profile plan tier (defaults to 'free' if missing)
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single()

  const limit = DAILY_LIMITS[profile?.plan ?? "free"]

  // Get start of today (00:00:00 UTC)
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  // Count requests made by user today
  const { count } = await supabase
    .from("ai_usage_log")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", todayStart.toISOString())

  const used = count ?? 0
  if (used >= limit) {
    return { allowed: false, remaining: 0 }
  }

  // Log current request
  await supabase.from("ai_usage_log").insert({ user_id: userId, feature })
  return { allowed: true, remaining: limit - used - 1 }
}