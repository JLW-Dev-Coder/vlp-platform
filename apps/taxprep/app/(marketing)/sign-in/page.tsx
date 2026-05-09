import Link from 'next/link'

// Deviation 3: Tax Prep Pro members sign in to SuiteDash, not Next.js.
// TODO(RC): Confirm SD member portal URL with Jamie before production deploy.
const SD_MEMBER_PORTAL_URL = 'https://members.virtuallaunch.pro'

export default function SignInPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--color-text-1)]">
        Sign in to Tax Prep Pro
      </h1>
      <p className="mt-4 text-base text-[var(--color-text-2)]">
        Tax Prep Pro members access their workspace inside SuiteDash.
      </p>
      <a
        href={SD_MEMBER_PORTAL_URL}
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-[var(--tpp-rose)] px-6 py-3 font-medium text-white transition hover:bg-[var(--tpp-rose-deep)]"
      >
        Sign in to SuiteDash →
      </a>
      <Link
        href="/contact"
        className="mt-6 text-sm text-[var(--color-text-3)] underline-offset-4 hover:underline"
      >
        Not a member yet? Book a discovery call.
      </Link>
    </section>
  )
}
