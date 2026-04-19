import Link from 'next/link'
import { generatePageMeta } from '@vlp/member-ui'
import { Gavel, Globe, Ticket, ThumbsUp, Palette } from 'lucide-react'

export const metadata = generatePageMeta({
  title: 'Features - Website Lotto',
  description:
    'Bid on websites, win free templates, vote on designs, host on a custom domain, and launch a white-labeled site without writing a line of code.',
  domain: 'websitelotto.virtuallaunch.pro',
  path: '/features',
})

const FEATURES = [
  {
    icon: Gavel,
    title: 'Bid on Websites',
    body:
      'See a template you like but the price is too high? Place a bid. If no one outbids you by the auction close, you win the site at your price. A way to get a professional website for less than retail.',
  },
  {
    icon: Globe,
    title: 'Premium Domain Hosting',
    body:
      'Connect your own domain to your purchased site. Your business name, your URL, hosted and maintained for you. No server management, no DNS headaches — just your site on your domain.',
  },
  {
    icon: Ticket,
    title: 'Scratcher Site Winner',
    body:
      'A scratch-to-win mechanic where you can win a website template for free. Reveal the card, match the symbols, claim the site. Luck-based acquisition that makes the marketplace engaging.',
  },
  {
    icon: ThumbsUp,
    title: 'Vote on Designs',
    body:
      'Vote for the templates you want to see added to the marketplace. Your votes influence which designs get produced next. The catalog reflects what buyers actually want, not what a designer guessed.',
  },
  {
    icon: Palette,
    title: 'White-Labeled Hosted Website',
    body:
      'A fully designed, ready-to-publish website with your business name, colors, and content. No design skills needed. Purchase or win a template, customize it through the site editor, and your website is live. Professional web presence in minutes, not months.',
  },
]

export default function FeaturesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center">
          <div className="inline-block rounded-full border border-brand-primary bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary mb-6">
            Features
          </div>
          <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight text-text-primary mb-5">
            Everything Website Lotto does
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-text-muted leading-relaxed mb-8">
            A marketplace, an auction house, a scratch ticket, and a hosting platform — all wrapped
            into one place where you actually end up with a finished website.
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

      {/* Feature grid */}
      <section className="border-b border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="rounded-xl border border-default bg-surface-card p-6 md:p-8"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-light text-brand-primary mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-sora text-2xl font-bold text-text-primary mb-3">{f.title}</h3>
                  <p className="text-text-muted leading-relaxed">{f.body}</p>
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
            Find a template, make it yours
          </h2>
          <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">
            Browse the catalog now or try a free scratch ticket — no account needed to look around.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-brand-primary px-6 py-3 font-semibold text-brand-text-on-primary hover:bg-brand-hover transition-colors"
            >
              Browse Templates
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
    </div>
  )
}
