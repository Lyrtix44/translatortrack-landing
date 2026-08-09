// components/settings/BrandingForm.tsx
"use client"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { updateBrandingAction, type BrandingFormState } from "@/app/actions/settings"
import { SubmitButton } from "@/components/ui/submit-button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

const initialState: BrandingFormState = { error: null, success: false }

export function BrandingForm({
  profile,
}: {
  profile: {
    business_name: string | null
    business_address: string | null
    payment_instructions: string | null
  } | null
}) {
  const [state, formAction] = useActionState(updateBrandingAction, initialState)

  useEffect(() => {
    if (state.success) toast.success("Branding updated.")
  }, [state.success])

  return (
    <Card className="p-6">
      <form action={formAction} className="space-y-4">
        {state.error && <p className="text-danger text-sm" role="alert">{state.error}</p>}

        <div>
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
            Business / your name
          </label>
          <Input
            name="business_name"
            defaultValue={profile?.business_name ?? ""}
            placeholder="Maria Santos Translations"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
            Address
          </label>
          <textarea
            name="business_address"
            defaultValue={profile?.business_address ?? ""}
            rows={3}
            className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-ink resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1.5">
            Payment instructions
          </label>
          <textarea
            name="payment_instructions"
            defaultValue={profile?.payment_instructions ?? ""}
            rows={3}
            placeholder="Bank transfer details, PayPal, Wise, etc."
            className="w-full border border-border rounded px-4 py-2.5 text-sm focus:outline-none focus:border-ink resize-none"
          />
        </div>

        <SubmitButton pendingText="Saving..." variant="primary" size="md">
          Save branding
        </SubmitButton>
      </form>
    </Card>
  )
}