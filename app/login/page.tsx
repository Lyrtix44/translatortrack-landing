import Link from "next/link"
import { Suspense } from "react"
import { LoginForm } from "@/components/auth/LoginForm"
import { GoogleButton } from "@/components/auth/GoogleButton"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6 pt-24 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl text-ink inline-block mb-6">
            Translator<span className="text-amber">Track</span>
          </Link>
          <h1 className="font-display text-3xl text-ink mb-2">Welcome back</h1>
          <p className="text-slate-mid text-sm">Log in to your dashboard.</p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
          <GoogleButton />

          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-slate-mid uppercase tracking-wider">or</span>
            <div className="h-px bg-border flex-1" />
          </div>

          {/* Suspense required: LoginForm reads useSearchParams() */}
          <Suspense fallback={<div className="h-40" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-sm text-slate-mid mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-ink font-medium hover:text-amber transition-colors">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}