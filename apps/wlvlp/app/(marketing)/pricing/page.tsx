import Link from 'next/link'
import { generatePageMeta } from '@vlp/member-ui'
import { ShoppingCart, Gavel, Ticket, Globe } from 'lucide-react'
import { FaqAccordion } from '../../../components/FaqAccordion'

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
    color: 'blue' as const,
    body:
      'Pick a template, pay list price, and own it outright. Pricing varies by template and niche — see each listing in the catalog for the current price. Twelve months of hosting included.',
    cta: { label: 'Browse Templates', href: '/' },
  },
  {
    icon: Gavel,
    title: 'Bid',
    price: 'Name your price',
    color: 'yellow' as const,
    body:
      'Place a bid below list price on any auction-eligible template. If no one outbids you by close, the site is yours at your number. Payment captures automatically — you only pay if you win.',
    cta: { label: 'See Available Auctions', href: '/' },
  },
  {
    icon: Ticket,
    title: 'Win',
    price: 'Free',
    color: 'magenta' as const,
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

const BORDERS = {
  blue: 'neon-border',
  yellow: 'neon-border-yellow',
  magenta: 'neon-border-magenta',
}
const TEXTS = {
  blue: 'text-neon-blue',
  yellow: 'text-neon-yellow',
  magenta: 'text-neon-magenta',
}
const BGS = {
  blue: 'bg-[rgba(0,212,255,0.1)]',
  yellow: 'bg-[rgba(255,229,52,0.1)]',
  magenta: 'bg-[rgba(255,45,138,0.1)]',
}

export default function PricingPage() {
  return (
    <div>
      {/* Hero with bokeh */}
      <section className="relative overflow-hidden">
        <div className="bokeh hidden md:block" style={{ top: '10%', left: '10%', width: '260px', height: '260px', background: 'radial-gradient(circle, #FFE534, transparent 70%)' }} />
        <div className="bokeh hidden md:block" style={{ top: '50%', left: '80%', width: '260px', height: '260px', background: 'radial-gradient(circle, #00D4FF, transparent 70%)', animationDelay: '3s' }} />
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center relative z-10">
          <div className="inline-block rounded-full neon-border-yellow px-3 py-1 text-xs font-bold uppercase tracking-wider text-neon-yellow mb-6">
            Pricing
          </div>
          <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-5 glow-yellow">
            Get a professional website
            <br />
            <span className="text-neon-blue glow-blue">at your price</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/70 leading-relaxed">
            One-time payment. No subscription required for the site itself. Twelve months of hosting
            included. Three different ways to acquire a template — pick the one that fits.
          </p>
        </div>
      </section>

      <div className="neon-line" />

      {/* Three paths — signature yellow wobble card for "Bid" */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3 glow-blue">
              Three ways to acquire a site
            </h2>
            <p className="text-white/65 text-lg">Buy outright, bid below list, or win one free.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PATHS.map((p) => {
              const Icon = p.icon
              const animCls = p.color === 'yellow' ? 'anim-wobble' : p.color === 'blue' ? 'anim-float' : 'anim-sway'
              return (
                <div
                  key={p.title}
                  className={`glass-card rounded-xl p-6 flex flex-col ${BORDERS[p.color]} ${animCls}`}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${BGS[p.color]} ${TEXTS[p.color]} mb-4 anim-icon-bounce`}>
                    <Icon size={22} />
                  </div>
                  <h3 className={`font-sora text-2xl font-bold mb-1 ${TEXTS[p.color]}`}>{p.title}</h3>
                  <div className={`font-bold mb-3 ${TEXTS[p.color]}`}>{p.price}</div>
                  <p className="text-white/65 leading-relaxed mb-6 flex-1">{p.body}</p>
                  <Link
                    href={p.cta.href}
                    className={`inline-flex items-center justify-center rounded-lg px-4 py-2 font-bold transition-all hover:-translate-y-0.5 ${
                      p.color === 'yellow'
                        ? 'bg-neon-yellow text-[#07070A] btn-glow-yellow'
                        : p.color === 'blue'
                        ? 'bg-[rgba(0,212,255,0.08)] neon-border text-neon-blue'
                        : 'bg-[rgba(255,45,138,0.08)] neon-border-magenta text-neon-magenta'
                    }`}
                  >
                    {p.cta.label}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="neon-line" />

      {/* Hosting */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[rgba(0,240,208,0.1)] text-neon-cyan mb-4 anim-icon-bounce">
              <Globe size={22} />
            </div>
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3 glow-cyan">
              Hosting after year one
            </h2>
            <p className="text-white/65 text-lg max-w-xl mx-auto">
              Twelve months of hosting come bundled with every template. After that, keep the site
              live with one of two plans.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {HOSTING.map((h, i) => (
              <div
                key={h.title}
                className={`glass-card rounded-xl p-6 ${i === 0 ? 'neon-border-cyan' : 'neon-border'} ${i === 0 ? 'anim-float' : 'anim-sway'}`}
              >
                <h3 className={`font-sora text-xl font-bold mb-1 ${i === 0 ? 'text-neon-cyan' : 'text-neon-blue'}`}>{h.title}</h3>
                <div className={`font-bold mb-3 ${i === 0 ? 'text-neon-cyan' : 'text-neon-blue'}`}>{h.price}</div>
                <p className="text-white/65 leading-relaxed">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="neon-line" />

      {/* FAQ */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3 glow-magenta">
              Pricing FAQ
            </h2>
          </div>
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      <div className="neon-line" />

      {/* CTA */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20 text-center">
          <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4 glow-yellow">
            Pick your path
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-neon-yellow px-6 py-3 font-extrabold text-[#07070A] btn-glow-yellow hover:-translate-y-0.5 transition-transform"
            >
              Browse Templates
            </Link>
            <Link
              href="/scratch"
              className="inline-flex items-center rounded-lg bg-[rgba(0,212,255,0.06)] neon-border px-6 py-3 font-bold text-neon-blue"
            >
              Try a Free Scratch Ticket
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
