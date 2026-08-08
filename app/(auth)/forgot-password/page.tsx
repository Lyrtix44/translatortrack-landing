// app/(auth)/forgot-password/page.tsx
import Link from "next/link"
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm"
import { Card } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-ink mb-2">Reset your password</h1>
        <p className="text-slate-mid text-sm">Enter your email and we&apos;ll send you a reset link.</p>
      </div>
      <Card className="p-8">
        <ForgotPasswordForm />
      </Card>
      <p className="text-center text-sm text-slate-mid mt-6">
        <Link href="/login" className="text-ink font-medium hover:text-amber transition-colors">← Back to login</Link>
      </p>
    </div>
  )
}