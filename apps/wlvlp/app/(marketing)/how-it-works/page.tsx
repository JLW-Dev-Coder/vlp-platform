import Link from 'next/link'
import { generatePageMeta } from '@vlp/member-ui'
import { Search, Route, Brush, Rocket } from 'lucide-react'

export const metadata = generatePageMeta({
  title: 'How It Works - Website Lotto',
  description:
    'Browse a template, choose how you acquire it, customize it to your brand, and launch. Four steps from gallery to live website.',
  domain: 'websitelotto.virtuallaunch.pro',
  path: '/how-it-works',
})

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Browse',
    body:
      'Explore the template gallery and find a design you actually want to send people to. Filter by category, sort by votes or price, and preview the live site before you commit.',
  },
  {
    number: '02',
    icon: Route,
    title: 'Choose your path',
    body:
      'Buy at list price for instant ownership. Place a bid below list and wait for the auction to close. Or scratch a free ticket and try to win the site outright.',
  },
  {
    number: '03',
    icon: Brush,
    title: 'Customize',
    body:
      'Add your business name, brand colors, logo, contact info, and content through the site editor. No code, no design tools — fill in fields and save.',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Launch',
    body:
      'Your site goes live on a branded subdomain immediately. Connect your own domain whenever you are ready — DNS pointing and SSL provisioning are handled for you.',
  },
]

export default function HowItWorksPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center">
          <div className="inline-block rounded-full border border-brand-primary bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary mb-6">
            How It Works
          </div>
          <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight text-text-primary mb-5">
            From gallery to live site
            <br />
            in four steps
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-text-muted leading-relaxed mb-8">
            No agency calls. No design briefs. No Figma files. Pick a template, make it yours, and
            ship it.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-brand-primary px-6 py-3 font-semibold text-brand-text-on-primary hover:bg-brand-hover transition-colors"
            >
              Start Browsing
            </Link>
            <Link
              href="/scratch"
              className="inline-flex items-center rounded-lg border border-default bg-surface-card px-6 py-3 font-semibold text-text-primary hover:border-hover transition-colors"
            >
              Try a Free Scratch Ticket
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="border-b border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="grid gap-6">
            {STEPS.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className="rounded-xl border border-default bg-surface-card p-6 md:p-8 grid md:grid-cols-[120px_1fr] gap-6 items-start"
                >
                  <div className="flex flex-col items-start">
                    <div className="font-sora text-5xl font-extrabold text-brand-primary leading-none">
                      {step.number}
                    </div>
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-light text-brand-primary mt-3">
                      <Icon size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-sora text-2xl font-bold text-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-text-muted leading-relaxed text-lg">{step.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20 text-center">
          <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-4">
            Ready to launch?
          </h2>
          <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">
            Browse the catalog or try a free scratch ticket. Step one starts now.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-brand-primary px-6 py-3 font-semibold text-brand-text-on-primary hover:bg-brand-hover transition-colors"
            >
              Browse Templates
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-lg border border-default bg-surface-card px-6 py-3 font-semibold text-text-primary hover:border-hover transition-colors"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
