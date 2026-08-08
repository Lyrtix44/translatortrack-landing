// app/(auth)/signup/page.tsx
import Link from "next/link"
import { SignUpForm } from "@/components/auth/SignUpForm"
import { GoogleButton } from "@/components/auth/GoogleButton"
import { Card } from "@/components/ui/card"

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-ink mb-2">Create your account</h1>
        <p className="text-slate-mid text-sm">Free forever plan. No credit card required.</p>
      </div>
      <Card className="p-8">
        <GoogleButton />
        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-border flex-1" />
          <span className="text-xs text-slate-mid uppercase tracking-wider">or</span>
          <div className="h-px bg-border flex-1" />
        </div>
        <SignUpForm />
      </Card>
      <p className="text-center text-sm text-slate-mid mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-ink font-medium hover:text-amber transition-colors">Sign in</Link>
      </p>
    </div>
  )
}