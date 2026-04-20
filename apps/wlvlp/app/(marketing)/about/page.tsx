import Link from 'next/link'
import { generatePageMeta } from '@vlp/member-ui'
import { Sparkles, Layers, Building2 } from 'lucide-react'

export const metadata = generatePageMeta({
  title: 'About - Website Lotto',
  description:
    'Website Lotto is a marketplace where you can win, bid on, or buy professionally designed websites ready to launch with your brand.',
  domain: 'websitelotto.virtuallaunch.pro',
  path: '/about',
})

export default function AboutPage() {
  return (
    <div>
      {/* Hero with bokeh orbs */}
      <section className="relative overflow-hidden">
        <div className="bokeh hidden md:block" style={{ top: '10%', left: '10%', width: '260px', height: '260px', background: 'radial-gradient(circle, #00D4FF, transparent 70%)' }} />
        <div className="bokeh hidden md:block" style={{ top: '40%', left: '80%', width: '240px', height: '240px', background: 'radial-gradient(circle, #FF2D8A, transparent 70%)', animationDelay: '3s' }} />
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center relative z-10">
          <div className="inline-block rounded-full neon-border px-3 py-1 text-xs font-bold uppercase tracking-wider text-neon-blue mb-6">
            About
          </div>
          <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-5 glow-blue">
            Professional websites,
            <br />
            <span className="text-neon-yellow glow-yellow">three ways</span> to acquire one
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/70 leading-relaxed mb-8">
            Website Lotto is a marketplace built for small business owners and professionals who need a
            polished, ready-to-launch website without learning to build one. Browse a curated catalog,
            then buy at list price, place a bid, or try your luck with a free scratch ticket.
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

      <div className="neon-line" />

      {/* Mission */}
      <section className="relative">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center glass-card neon-border rounded-2xl p-10 anim-float">
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4 glow-blue">
              Why Website Lotto exists
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              Most small businesses need a professional website but cannot justify the cost or
              complexity of hiring an agency. DIY builders demand hours of work and still leave you
              with something that looks generic. Website Lotto closes that gap with a catalog of
              designer-quality templates, sold once, hosted for you, customized to your brand in
              minutes.
            </p>
          </div>
        </div>
      </section>

      <div className="neon-line" />

      {/* Three paths */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3 glow-magenta">
              Three ways in
            </h2>
            <p className="text-white/60 text-lg">
              Pick the path that fits your budget and your luck.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card rounded-xl p-6 neon-border anim-float">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[rgba(0,212,255,0.1)] text-neon-blue mb-4 anim-icon-bounce">
                <Sparkles size={22} />
              </div>
              <h3 className="font-sora text-xl font-bold text-neon-blue mb-2">Buy</h3>
              <p className="text-white/65 leading-relaxed">
                Pick a template, pay list price, and own it outright. One-time payment, twelve months
                of hosting included.
              </p>
            </div>
            <div className="glass-card rounded-xl p-6 neon-border-yellow anim-dance">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[rgba(255,229,52,0.1)] text-neon-yellow mb-4 anim-icon-bounce">
                <Layers size={22} />
              </div>
              <h3 className="font-sora text-xl font-bold text-neon-yellow mb-2">Bid</h3>
              <p className="text-white/65 leading-relaxed">
                Found a design you love but the price feels high? Place a bid. If no one outbids you
                by close, the site is yours at your number.
              </p>
            </div>
            <div className="glass-card rounded-xl p-6 neon-border-magenta anim-sway">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[rgba(255,45,138,0.1)] text-neon-magenta mb-4 anim-icon-bounce">
                <Building2 size={22} />
              </div>
              <h3 className="font-sora text-xl font-bold text-neon-magenta mb-2">Win</h3>
              <p className="text-white/65 leading-relaxed">
                Try a free scratch ticket. Match the symbols and walk away with a free template,
                discount, or hosting credit.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="neon-line" />

      {/* Company */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block rounded-full border border-glassBorder bg-glass px-3 py-1 text-xs font-bold uppercase tracking-wider text-neon-cyan mb-4">
              The team
            </div>
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4 glow-cyan">
              Powered by Virtual Launch Pro
            </h2>
            <p className="text-white/65 text-lg leading-relaxed">
              Website Lotto is part of the Virtual Launch Pro ecosystem, built and operated by
              Lenore, Inc. — a small team that ships templates, hosting, and tooling for
              professionals who would rather run their business than wrestle with web infrastructure.
            </p>
          </div>
        </div>
      </section>

      <div className="neon-line" />

      {/* CTA */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20 text-center">
          <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4 glow-yellow">
            Ready to find your site?
          </h2>
          <p className="text-white/65 text-lg mb-8 max-w-xl mx-auto">
            Browse the catalog, scratch a free ticket, or place a bid. Three ways in — pick yours.
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
