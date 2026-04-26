import type { Metadata } from 'next'
import { Suspense } from 'react'
import SignInForm from '@/components/auth/SignInForm'

export const metadata: Metadata = { title: 'Sign In' }

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-400">
        Loading…
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
