// app/(auth)/reset-password/page.tsx
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"
import { Card } from "@/components/ui/card"

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-ink mb-2">Set a new password</h1>
        <p className="text-slate-mid text-sm">Choose something you haven&apos;t used before.</p>
      </div>
      <Card className="p-8">
        <ResetPasswordForm />
      </Card>
    </div>
  )
}