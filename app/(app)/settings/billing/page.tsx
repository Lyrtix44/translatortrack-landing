import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { manageBillingAction } from "@/app/actions/billing"

export default async function BillingSettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_status, renews_at, cancels_at")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-screen bg-paper pt-28 px-6 pb-20">
      <div className="max-w-lg mx-auto">
        <h1 className="font-display text-3xl text-ink mb-6">
          Billing
        </h1>

        <div className="bg-white border border-border rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-mid text-sm">
              Current plan
            </span>

            <span className="text-ink font-semibold capitalize">
              {profile?.plan}
            </span>
          </div>

          {profile?.cancels_at && (
            <div className="bg-amber-50 border border-amber/30 rounded-lg px-4 py-3 text-sm text-ink">
              Your plan is set to cancel on{" "}
              {new Date(profile.cancels_at).toLocaleDateString()}.
              You'll keep access until then.
            </div>
          )}

          {profile?.renews_at &&
            profile.subscription_status === "active" &&
            !profile.cancels_at && (
              <div className="flex items-center justify-between">
                <span className="text-slate-mid text-sm">
                  Renews
                </span>

                <span className="text-ink text-sm">
                  {new Date(profile.renews_at).toLocaleDateString()}
                </span>
              </div>
            )}

          {profile?.plan === "free" ? (
            <a
              href="/pricing"
              className="block text-center bg-ink hover:bg-ink-light text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              Upgrade
            </a>
          ) : (
            <form action={manageBillingAction}>
              <button
                type="submit"
                className="w-full bg-ink hover:bg-ink-light text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                Manage billing & payment method
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}