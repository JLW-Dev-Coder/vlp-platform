import Link from 'next/link'
import { generatePageMeta } from '@vlp/member-ui'
import { ShoppingCart, Gavel, Ticket, Globe } from 'lucide-react'

export const metadata = generatePageMeta({
  title: 'Pricing - Website Lotto',
  description:
    'Three ways to get a professional website: buy at list price, place a bid, or win one with a free scratch ticket. Hosting included for the first twelve months.',
  domain: 'websitelotto.virtuallaunch.pro',
  path: '/pricing',
})

const PATHS = [
  {
    icon: ShoppingCart,
    title: 'Buy',
    price: 'One-time payment',
    body:
      'Pick a template, pay list price, and own it outright. Pricing varies by template and niche — see each listing in the catalog for the current price. Twelve months of hosting included.',
    cta: { label: 'Browse Templates', href: '/' },
  },
  {
    icon: Gavel,
    title: 'Bid',
    price: 'Name your price',
    body:
      'Place a bid below list price on any auction-eligible template. If no one outbids you by close, the site is yours at your number. Payment captures automatically — you only pay if you win.',
    cta: { label: 'See Available Auctions', href: '/' },
  },
  {
    icon: Ticket,
    title: 'Win',
    price: 'Free',
    body:
      'Try a scratch ticket and walk away with a free template, discount, or hosting credit. No payment required to scratch — just sign in and reveal.',
    cta: { label: 'Try a Free Scratch Ticket', href: '/scratch' },
  },
]

const HOSTING = [
  {
    title: 'Standard hosting',
    price: 'Monthly billing',
    body: 'After year 1. Branded subdomain, Cloudflare CDN, SSL, mobile-responsive delivery.',
  },
  {
    title: 'Premium hosting',
    price: 'Monthly billing',
    body:
      'After year 1. Includes content updates, SEO maintenance, and priority support — built for sites where the website is doing real revenue work.',
  },
]

const FAQS = [
  {
    q: 'Is this a subscription?',
    a: 'No. The site itself is a one-time purchase. Hosting is bundled free for the first twelve months. After that, monthly hosting kicks in if you want to keep the site live.',
  },
  {
    q: 'What happens if I bid and lose?',
    a: 'Nothing. You are not charged unless your bid wins at close. Lose an auction and you can still buy other templates at list or place a new bid.',
  },
  {
    q: 'Are scratch tickets actually free?',
    a: 'Yes. Sign in, reveal the ticket, and any prize you match is yours. No payment, no credit card required to scratch.',
  },
  {
    q: 'Why are some templates more expensive?',
    a: 'Premium niches (tax, legal, services, real estate, tech) command higher list prices because the templates are tuned for industries with higher customer lifetime value. Standard niches sit at the lower price tier.',
  },
  {
    q: 'Can I bring my own domain?',
    a: 'Yes — premium domain hosting lets you connect any domain you own. We handle DNS pointing and SSL provisioning.',
  },
]

export default function PricingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center">
          <div className="inline-block rounded-full border border-brand-primary bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary mb-6">
            Pricing
          </div>
          <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight text-text-primary mb-5">
            Get a professional website
            <br />
            at your price
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">
            One-time payment. No subscription required for the site itself. Twelve months of hosting
            included. Three different ways to acquire a template — pick the one that fits.
          </p>
        </div>
      </section>

      {/* Three paths */}
      <section className="border-b border-subtle bg-surface-card">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-3">
              Three ways to acquire a site
            </h2>
            <p className="text-text-muted text-lg">Buy outright, bid below list, or win one free.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PATHS.map((p) => {
              const Icon = p.icon
              return (
                <div
                  key={p.title}
                  className="rounded-xl border border-default bg-surface-bg p-6 flex flex-col"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-light text-brand-primary mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-sora text-2xl font-bold text-text-primary mb-1">{p.title}</h3>
                  <div className="text-brand-primary font-semibold mb-3">{p.price}</div>
                  <p className="text-text-muted leading-relaxed mb-6 flex-1">{p.body}</p>
                  <Link
                    href={p.cta.href}
                    className="inline-flex items-center justify-center rounded-lg border border-default bg-surface-card px-4 py-2 font-semibold text-text-primary hover:border-hover transition-colors"
                  >
                    {p.cta.label}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Hosting */}
      <section className="border-b border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-light text-brand-primary mb-4">
              <Globe size={22} />
            </div>
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-3">
              Hosting after year one
            </h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto">
              Twelve months of hosting come bundled with every template. After that, keep the site
              live with one of two plans.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {HOSTING.map((h) => (
              <div key={h.title} className="rounded-xl border border-default bg-surface-card p-6">
                <h3 className="font-sora text-xl font-bold text-text-primary mb-1">{h.title}</h3>
                <div className="text-brand-primary font-semibold mb-3">{h.price}</div>
                <p className="text-text-muted leading-relaxed">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-subtle bg-surface-card">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-3">
              Pricing FAQ
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="rounded-lg border border-default bg-surface-bg p-5 group"
              >
                <summary className="font-semibold text-text-primary cursor-pointer list-none flex justify-between items-center">
                  <span>{f.q}</span>
                  <span className="text-brand-primary text-xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-text-muted leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20 text-center">
          <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-4">
            Pick your path
          </h2>
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
