import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Bypasses Row Level Security completely. Never import this into a
// Client Component or anything reachable by an unverified request. It
// exists for exactly one kind of situation: trusted, server-to-server
// code — like a signature-verified webhook — acting on behalf of a
// user with no active session.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}