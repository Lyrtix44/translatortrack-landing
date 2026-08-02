import { createClient } from "@/lib/supabase/server"
import type { User } from "@supabase/supabase-js"

export class UnauthorizedError extends Error {
  constructor() {
    super("You need to be signed in to do that.")
    this.name = "UnauthorizedError"
  }
}

export async function requireAuth(): Promise<User> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new UnauthorizedError()

  return user
}