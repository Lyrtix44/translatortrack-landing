import Link from "next/link"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6 pt-24 pb-12">
      <div className="w-full max-w-md text-center">
        <div className="text-5xl mb-6">✉️</div>
        <h1 className="font-display text-3xl text-ink mb-3">Check your inbox</h1>
        <p className="text-slate-mid mb-8 leading-relaxed">
          We&apos;ve sent a confirmation link to your email. Click it to
          activate your account and get started.
        </p>
        <Link href="/login" className="text-ink font-medium hover:text-amber transition-colors text-sm">
          ← Back to login
        </Link>
      </div>
    </div>
  )
}