import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm"

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6 pt-24 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-ink mb-2">Set a new password</h1>
          <p className="text-slate-mid text-sm">Choose something you haven&apos;t used before.</p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}