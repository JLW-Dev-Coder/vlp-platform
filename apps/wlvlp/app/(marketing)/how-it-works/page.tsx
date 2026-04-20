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
    color: 'blue' as const,
    title: 'Browse',
    body:
      'Explore the template gallery and find a design you actually want to send people to. Filter by category, sort by votes or price, and preview the live site before you commit.',
  },
  {
    number: '02',
    icon: Route,
    color: 'yellow' as const,
    title: 'Choose your path',
    body:
      'Buy at list price for instant ownership. Place a bid below list and wait for the auction to close. Or scratch a free ticket and try to win the site outright.',
  },
  {
    number: '03',
    icon: Brush,
    color: 'magenta' as const,
    title: 'Customize',
    body:
      'Add your business name, brand colors, logo, contact info, and content through the site editor. No code, no design tools — fill in fields and save.',
  },
  {
    number: '04',
    icon: Rocket,
    color: 'cyan' as const,
    title: 'Launch',
    body:
      'Your site goes live on a branded subdomain immediately. Connect your own domain whenever you are ready — DNS pointing and SSL provisioning are handled for you.',
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
const GLOWS = {
  blue: 'glow-blue',
  yellow: 'glow-yellow',
  magenta: 'glow-magenta',
  cyan: 'glow-cyan',
}
const BGS = {
  blue: 'bg-[rgba(0,212,255,0.1)]',
  yellow: 'bg-[rgba(255,229,52,0.1)]',
  magenta: 'bg-[rgba(255,45,138,0.1)]',
  cyan: 'bg-[rgba(0,240,208,0.1)]',
}
const ANIMS = ['anim-float', 'anim-dance', 'anim-sway', 'anim-wobble']

export default function HowItWorksPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bokeh hidden md:block" style={{ top: '15%', left: '10%', width: '260px', height: '260px', background: 'radial-gradient(circle, #00D4FF, transparent 70%)' }} />
        <div className="bokeh hidden md:block" style={{ top: '40%', left: '80%', width: '240px', height: '240px', background: 'radial-gradient(circle, #FFE534, transparent 70%)', animationDelay: '3s' }} />
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center relative z-10">
          <div className="inline-block rounded-full neon-border-cyan px-3 py-1 text-xs font-bold uppercase tracking-wider text-neon-cyan mb-6">
            How It Works
          </div>
          <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-5 glow-cyan">
            From gallery to live site
            <br />
            <span className="text-neon-yellow glow-yellow">in four steps</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/70 leading-relaxed mb-8">
            No agency calls. No design briefs. No Figma files. Pick a template, make it yours, and
            ship it.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-neon-yellow px-6 py-3 font-extrabold text-[#07070A] btn-glow-yellow hover:-translate-y-0.5 transition-transform"
            >
              Start Browsing
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

      <div className="neon-line" />

      {/* Steps */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="grid gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className={`glass-card rounded-xl p-6 md:p-8 grid md:grid-cols-[120px_1fr] gap-6 items-start ${BORDERS[step.color]} ${ANIMS[i]}`}
                >
                  <div className="flex flex-col items-start">
                    <div className={`font-sora text-5xl font-extrabold leading-none ${TEXTS[step.color]} ${GLOWS[step.color]}`}>
                      {step.number}
                    </div>
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${BGS[step.color]} ${TEXTS[step.color]} mt-3 anim-icon-bounce`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className={`font-sora text-2xl font-bold mb-2 ${TEXTS[step.color]}`}>
                      {step.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed text-lg">{step.body}</p>
                  </div>
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
            Ready to launch?
          </h2>
          <p className="text-white/65 text-lg mb-8 max-w-xl mx-auto">
            Browse the catalog or try a free scratch ticket. Step one starts now.
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
    </div>
  )
}
