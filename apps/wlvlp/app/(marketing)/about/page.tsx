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
      {/* Hero */}
      <section className="border-b border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center">
          <div className="inline-block rounded-full border border-brand-primary bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary mb-6">
            About
          </div>
          <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight text-text-primary mb-5">
            Professional websites,
            <br />
            three ways to acquire one
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-text-muted leading-relaxed mb-8">
            Website Lotto is a marketplace built for small business owners and professionals who need a
            polished, ready-to-launch website without learning to build one. Browse a curated catalog,
            then buy at list price, place a bid, or try your luck with a free scratch ticket.
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

      {/* Mission */}
      <section className="border-b border-subtle bg-surface-card">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-4">
              Why Website Lotto exists
            </h2>
            <p className="text-text-muted text-lg leading-relaxed">
              Most small businesses need a professional website but cannot justify the cost or
              complexity of hiring an agency. DIY builders demand hours of work and still leave you
              with something that looks generic. Website Lotto closes that gap with a catalog of
              designer-quality templates, sold once, hosted for you, customized to your brand in
              minutes.
            </p>
          </div>
        </div>
      </section>

      {/* How it's different */}
      <section className="border-b border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="text-center mb-10">
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-3">
              Three ways in
            </h2>
            <p className="text-text-muted text-lg">
              Pick the path that fits your budget and your luck.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-default bg-surface-card p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-light text-brand-primary mb-4">
                <Sparkles size={22} />
              </div>
              <h3 className="font-sora text-xl font-bold text-text-primary mb-2">Buy</h3>
              <p className="text-text-muted leading-relaxed">
                Pick a template, pay list price, and own it outright. One-time payment, twelve months
                of hosting included.
              </p>
            </div>
            <div className="rounded-xl border border-default bg-surface-card p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-light text-brand-primary mb-4">
                <Layers size={22} />
              </div>
              <h3 className="font-sora text-xl font-bold text-text-primary mb-2">Bid</h3>
              <p className="text-text-muted leading-relaxed">
                Found a design you love but the price feels high? Place a bid. If no one outbids you
                by close, the site is yours at your number.
              </p>
            </div>
            <div className="rounded-xl border border-default bg-surface-card p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-light text-brand-primary mb-4">
                <Building2 size={22} />
              </div>
              <h3 className="font-sora text-xl font-bold text-text-primary mb-2">Win</h3>
              <p className="text-text-muted leading-relaxed">
                Try a free scratch ticket. Match the symbols and walk away with a free template,
                discount, or hosting credit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company */}
      <section className="border-b border-subtle bg-surface-card">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block rounded-full border border-default bg-surface-elevated px-3 py-1 text-xs font-bold uppercase tracking-wider text-text-muted mb-4">
              The team
            </div>
            <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-4">
              Powered by Virtual Launch Pro
            </h2>
            <p className="text-text-muted text-lg leading-relaxed">
              Website Lotto is part of the Virtual Launch Pro ecosystem, built and operated by
              Lenore, Inc. — a small team that ships templates, hosting, and tooling for
              professionals who would rather run their business than wrestle with web infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20 text-center">
          <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-4">
            Ready to find your site?
          </h2>
          <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">
            Browse the catalog, scratch a free ticket, or place a bid. Three ways in — pick yours.
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
