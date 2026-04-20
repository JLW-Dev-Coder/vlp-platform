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
    color: 'blue' as const,
    body:
      'See a template you like but the price is too high? Place a bid. If no one outbids you by the auction close, you win the site at your price. A way to get a professional website for less than retail.',
  },
  {
    icon: Globe,
    title: 'Premium Domain Hosting',
    color: 'yellow' as const,
    body:
      'Connect your own domain to your purchased site. Your business name, your URL, hosted and maintained for you. No server management, no DNS headaches — just your site on your domain.',
  },
  {
    icon: Ticket,
    title: 'Scratcher Site Winner',
    color: 'magenta' as const,
    body:
      'A scratch-to-win mechanic where you can win a website template for free. Reveal the card, match the symbols, claim the site. Luck-based acquisition that makes the marketplace engaging.',
  },
  {
    icon: ThumbsUp,
    title: 'Vote on Designs',
    color: 'cyan' as const,
    body:
      'Vote for the templates you want to see added to the marketplace. Your votes influence which designs get produced next. The catalog reflects what buyers actually want, not what a designer guessed.',
  },
  {
    icon: Palette,
    title: 'White-Labeled Hosted Website',
    color: 'blue' as const,
    body:
      'A fully designed, ready-to-publish website with your business name, colors, and content. No design skills needed. Purchase or win a template, customize it through the site editor, and your website is live. Professional web presence in minutes, not months.',
  },
]

const BORDERS = {
  blue: 'neon-border',
  yellow: 'neon-border-yellow',
  magenta: 'neon-border-magenta',
  cyan: 'neon-border-cyan',
}
const TEXTS = {
  blue: 'text-neon-blue',
  yellow: 'text-neon-yellow',
  magenta: 'text-neon-magenta',
  cyan: 'text-neon-cyan',
}
const BGS = {
  blue: 'bg-[rgba(0,212,255,0.1)]',
  yellow: 'bg-[rgba(255,229,52,0.1)]',
  magenta: 'bg-[rgba(255,45,138,0.1)]',
  cyan: 'bg-[rgba(0,240,208,0.1)]',
}

export default function FeaturesPage() {
  return (
    <div>
      {/* Hero with bokeh */}
      <section className="relative overflow-hidden">
        <div className="bokeh hidden md:block" style={{ top: '10%', left: '15%', width: '280px', height: '280px', background: 'radial-gradient(circle, #FF2D8A, transparent 70%)' }} />
        <div className="bokeh hidden md:block" style={{ top: '40%', left: '75%', width: '260px', height: '260px', background: 'radial-gradient(circle, #00D4FF, transparent 70%)', animationDelay: '3s' }} />
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center relative z-10">
          <div className="inline-block rounded-full neon-border-magenta px-3 py-1 text-xs font-bold uppercase tracking-wider text-neon-magenta mb-6">
            Features
          </div>
          <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-5 glow-magenta">
            Everything Website Lotto does
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/70 leading-relaxed mb-8">
            A marketplace, an auction house, a scratch ticket, and a hosting platform — all wrapped
            into one place where you actually end up with a finished website.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-neon-yellow px-6 py-3 font-extrabold text-[#07070A] btn-glow-yellow hover:-translate-y-0.5 transition-transform"
            >
              Browse Templates
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-lg bg-[rgba(0,212,255,0.06)] neon-border px-6 py-3 font-bold text-neon-blue"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      <div className="neon-line" />

      {/* Feature grid */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              const animCls = i % 3 === 0 ? 'anim-float' : i % 3 === 1 ? 'anim-dance' : 'anim-sway'
              return (
                <div
                  key={f.title}
                  className={`glass-card rounded-xl p-6 md:p-8 ${BORDERS[f.color]} ${animCls}`}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${BGS[f.color]} ${TEXTS[f.color]} mb-4 anim-icon-bounce`}>
                    <Icon size={24} />
                  </div>
                  <h3 className={`font-sora text-2xl font-bold mb-3 ${TEXTS[f.color]}`}>{f.title}</h3>
                  <p className="text-white/70 leading-relaxed">{f.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="neon-line" />

      {/* CTA */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20 text-center">
          <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4 glow-blue">
            Find a template, make it yours
          </h2>
          <p className="text-white/65 text-lg mb-8 max-w-xl mx-auto">
            Browse the catalog now or try a free scratch ticket — no account needed to look around.
          </p>
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
