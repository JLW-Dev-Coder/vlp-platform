import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works | Tax Avatar Pro',
  description:
    'From signup to your first published video in 48 hours. Pick a plan, choose an AI avatar, approve your scripts, and we publish to your branded YouTube channel.',
}

const steps = [
  {
    n: 1,
    title: 'Choose your plan & topic',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    body: "Pick Launch, Growth, or Pro based on how many videos you want per month. Tell us your tax specialty — penalty abatement, IRS collections, audit representation, whatever you focus on. We'll tailor every script to your niche.",
  },
  {
    n: 2,
    title: 'Pick your AI avatar',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    body: 'Choose from 6 professional AI presenters — or bring your own face with a custom avatar on the Pro plan. Your avatar delivers your content with natural speech, expressions, and gestures. You never step in front of a camera.',
  },
  {
    n: 3,
    title: 'Review & approve your scripts',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <polyline points="9 15 11 17 15 13" />
      </svg>
    ),
    body: 'Every month on your billing date, our AI generates fresh video scripts on your chosen tax topic. You review each script in your dashboard — approve, or generate new ones. Nothing goes live without your OK. It only takes a minute.',
  },
  {
    n: 4,
    title: 'We produce & publish automatically',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
    body: 'Once you approve, we render the video with your AI avatar, create a professional thumbnail, and publish it to your branded YouTube channel. You get an email with a link to every new video the moment it goes live.',
  },
  {
    n: 5,
    title: 'Your channel grows on autopilot',
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
        <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
      </svg>
    ),
    body: 'Every month, the cycle repeats — new scripts on your billing date, your approval, automatic production and publishing. Your channel builds a library of content that drives viewers to your firm. More videos mean more search visibility, more subscribers, and more leads finding their way to your intake page.',
  },
]

const benefits = [
  "Branded YouTube channel with your firm's name and colors",
  'AI-generated scripts tailored to your tax specialty',
  'Professional AI avatar videos published on schedule',
  'Lead generation — every video drives viewers to your intake page',
  'YouTube stats dashboard updated daily',
  'Full channel ownership whenever you want it',
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      {/* Hero */}
      <section className="mx-auto max-w-[1280px] w-full px-6 md:px-8 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#ec4899]" aria-hidden="true" />
            <span className="text-sm text-white/70">Signup to first video in 48 hours</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            How{' '}
            <span className="bg-gradient-to-br from-[#ec4899] to-[#f472b6] bg-clip-text text-transparent">
              Tax Avatar Pro
            </span>{' '}
            Works
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-white/70 md:text-2xl">
            From signup to your first published video in 48 hours. No camera required.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8 py-16 md:py-20">
          <div className="grid gap-6 md:gap-8 max-w-4xl mx-auto">
            {steps.map((step) => (
              <div
                key={step.n}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-10 shadow-md"
              >
                <div className="flex items-start gap-5">
                  <div className="shrink-0 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#ec4899] to-[#f472b6] text-white">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-sm font-extrabold tracking-widest text-[#ec4899]">
                        STEP {step.n}
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold mb-4">{step.title}</h3>
                    <p className="text-base leading-relaxed text-white/70">{step.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold tracking-widest text-[#ec4899] text-center">
              WHAT YOU GET
            </p>
            <h2 className="mt-3 mb-10 text-4xl font-extrabold md:text-5xl text-center">
              Everything you need to launch
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-5"
                >
                  <span
                    className="mt-1.5 h-2 w-2 rounded-full bg-[#ec4899] shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-base text-white/80">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Channel ownership callout */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8 py-16 md:py-20">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[#ec4899]/30 bg-gradient-to-br from-[#ec4899]/10 to-transparent p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">It&apos;s your channel</h2>
            <p className="text-lg leading-relaxed text-white/80">
              We build and manage the channel for you. You&apos;re added as a Channel Manager with
              full visibility. When you&apos;re ready, request a transfer from your dashboard —
              after 7 business days, you&apos;re the primary owner with full control of your
              channel, videos, and subscribers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#0a0a0a] via-[#1a0a14] to-[#ec4899]/20">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to launch your channel?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/pricing"
              className="inline-block bg-[#ec4899] hover:bg-[#db2777] text-white font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl"
            >
              See Pricing
            </a>
            <a
              href="/contact"
              className="inline-block text-white/80 hover:text-white underline-offset-4 hover:underline font-semibold px-6 py-4 text-base"
            >
              Questions? Talk to us →
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
