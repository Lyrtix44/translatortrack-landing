// app/(auth)/login/page.tsx
import Link from "next/link"
import { Suspense } from "react"
import { LoginForm } from "@/components/auth/LoginForm"
import { GoogleButton } from "@/components/auth/GoogleButton"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-ink mb-2">Welcome back</h1>
        <p className="text-slate-mid text-sm">Log in to your dashboard.</p>
      </div>
      <Card className="p-8">
        <GoogleButton />
        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-border flex-1" />
          <span className="text-xs text-slate-mid uppercase tracking-wider">or</span>
          <div className="h-px bg-border flex-1" />
        </div>
        <Suspense fallback={<div className="h-40" />}>
          <LoginForm />
        </Suspense>
      </Card>
      <p className="text-center text-sm text-slate-mid mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-ink font-medium hover:text-amber transition-colors">Sign up free</Link>
      </p>
    </div>
  )
}