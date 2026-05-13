'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'

type Product = {
  name: string
  abbrev: string
  color: string
  bg: string
  domain: string
  desc: string
  cta: string
  category: string
  audience: string[]
}

type Role = {
  id: string
  label: string
  subtitle: string
  filter: string[]
  color: string
  bg: string
}

const PRODUCTS: Product[] = [
  { name: 'Virtual Launch Pro', abbrev: 'VLP', color: '#f97316', bg: '#fff7ed', domain: 'https://virtuallaunch.pro', desc: 'Lead-gen directory + speed-to-lead notifications for tax professionals.', cta: 'Get listed', category: 'Lead Gen', audience: ['pro'] },
  { name: 'Tax Monitor Pro', abbrev: 'TMP', color: '#f59e0b', bg: '#fffbeb', domain: 'https://taxmonitor.pro', desc: 'Continuous IRS transcript monitoring with same-day alerts on every change.', cta: 'See alerts', category: 'Monitoring', audience: ['pro', 'taxpayer'] },
  { name: 'Transcript Tax Monitor', abbrev: 'TTMP', color: '#14b8a6', bg: '#f0fdfa', domain: 'https://transcript.taxmonitor.pro', desc: 'Automated PDF transcript parsing, diffs, and engagement workflow.', cta: 'Parse transcripts', category: 'Automation', audience: ['pro'] },
  { name: 'Tax Tools Arcade', abbrev: 'TTTMP', color: '#8b5cf6', bg: '#f5f3ff', domain: 'https://taxtools.taxmonitor.pro', desc: 'Interactive tax games that teach taxpayers what their transcript means.', cta: 'Play & learn', category: 'Education', audience: ['taxpayer', 'pro'] },
  { name: 'Developers VLP', abbrev: 'DVLP', color: '#3b82f6', bg: '#eff6ff', domain: 'https://developers.virtuallaunch.pro', desc: 'Public API, contracts, and SDKs for building on the VLP platform.', cta: 'Read the docs', category: 'Platform', audience: ['developer'] },
  { name: 'Tax Claim VLP', abbrev: 'TCVLP', color: '#eab308', bg: '#fefce8', domain: 'https://taxclaim.virtuallaunch.pro', desc: 'Refund recovery + Kwong settlement claim workflow with deadline tracking.', cta: 'File a claim', category: 'Recovery', audience: ['taxpayer', 'pro'] },
  { name: 'Website Lotto VLP', abbrev: 'WLVLP', color: '#00D4FF', bg: '#ecfeff', domain: 'https://websitelotto.virtuallaunch.pro', desc: 'Buy & sell turnkey tax-niche websites in a curated marketplace.', cta: 'Browse sites', category: 'Marketplace', audience: ['business', 'pro'] },
  { name: 'Tax Avatar Pro', abbrev: 'TAVLP', color: '#ec4899', bg: '#fdf2f8', domain: 'https://taxavatar.virtuallaunch.pro', desc: 'Branded AI avatars that explain tax results to your clients on camera.', cta: 'Meet your avatar', category: 'AI', audience: ['pro', 'business'] },
]

const ROLES: Role[] = [
  { id: 'pro', label: 'Tax professional', subtitle: 'CPA, EA, attorney', filter: ['VLP', 'TMP', 'TTMP', 'TAVLP'], color: '#f97316', bg: '#fff7ed' },
  { id: 'taxpayer', label: 'Taxpayer', subtitle: 'Individual filer', filter: ['TMP', 'TTTMP', 'TCVLP'], color: '#14b8a6', bg: '#f0fdfa' },
  { id: 'business', label: 'Business owner', subtitle: 'Operator, investor', filter: ['WLVLP', 'TAVLP', 'TCVLP'], color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'developer', label: 'Developer', subtitle: 'API + integrations', filter: ['DVLP'], color: '#3b82f6', bg: '#eff6ff' },
]

const STEPS = [
  { n: '01', color: '#f97316', title: 'Pick a starting product', body: 'Most pros begin with VLP or TMP. Taxpayers usually start with Tax Monitor Pro or Tax Claim VLP. One account works across all 10 products.' },
  { n: '02', color: '#f59e0b', title: 'Connect your data', body: 'Upload an IRS transcript PDF, import your client roster, or wire up the API. We do the parsing, diffing, and alerting.' },
  { n: '03', color: '#14b8a6', title: 'Get notified', body: 'New leads, transcript changes, refund opportunities, deadline shifts — delivered the second they happen, never the day after.' },
  { n: '04', color: '#8b5cf6', title: 'Act inside the platform', body: 'Reply, file, claim, book, monitor, message — every workflow finishes inside VLP. No tab switching, no copy-paste.' },
  { n: '05', color: '#3b82f6', title: 'Compound it', body: 'Refer clients with our 20% lifetime affiliate program. Resell websites in WLVLP. Add Tax Avatar Pro to brand your client deliverables.' },
]

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (el.getBoundingClientRect().top < window.innerHeight) return
    setVisible(false)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true)
            io.disconnect()
          }
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    const fallback = window.setTimeout(() => setVisible(true), 1500)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function DashboardMockup() {
  return (
    <div
      className="relative rounded-2xl border bg-white p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]"
      style={{ borderColor: 'rgba(0,0,0,0.08)' }}
    >
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#ef4444' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#f59e0b' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#10b981' }} />
          <span className="ml-3 font-sora text-[11px] font-semibold tracking-wide text-[#1a1a1a]">TRANSCRIPT MONITOR — ACCT 4471</span>
        </div>
        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: '#fee2e2', color: '#b91c1c' }}>3 NEW</span>
      </div>
      <div className="mt-4 space-y-2.5">
        {[
          { code: '922', label: 'Review of unreported income', date: '05-08', tone: 'alert' },
          { code: '420', label: 'Examination indicator', date: '05-06', tone: 'alert' },
          { code: '846', label: 'Refund issued', date: '05-02', tone: 'good' },
          { code: '290', label: 'Additional tax assessed', date: '04-28', tone: 'warn' },
          { code: '150', label: 'Return filed', date: '04-15', tone: 'neutral' },
        ].map((r) => (
          <div key={r.code + r.date} className="flex items-center justify-between rounded-lg border px-3 py-2.5" style={{ borderColor: 'rgba(0,0,0,0.05)', background: '#fafafa' }}>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#1a1a1a]">{r.code}</span>
              <span className="text-xs text-[#666]">{r.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#999]">{r.date}</span>
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: r.tone === 'alert' ? '#ef4444' : r.tone === 'warn' ? '#f59e0b' : r.tone === 'good' ? '#10b981' : '#cbd5e1',
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-lg p-3" style={{ background: '#fff7ed' }}>
        <span className="font-sora text-[11px] font-semibold text-[#9a3412]">NEXT CHECK · 6h 12m</span>
        <span className="text-[11px] font-semibold text-[#f97316]">Run now →</span>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [activeRole, setActiveRole] = useState<string | null>(null)

  const visibleProducts =
    activeRole == null
      ? PRODUCTS
      : PRODUCTS.filter((p) => ROLES.find((r) => r.id === activeRole)?.filter.includes(p.abbrev))

  return (
    <div className="font-sans text-[#1a1a1a]" style={{ background: '#faf9f6' }}>
      {/* Utility bar */}
      <div className="w-full" style={{ background: '#0f172a' }}>
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 py-2 text-[12px] text-white/90">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f97316] animate-pulse" />
            <span className="font-sora font-semibold tracking-wide text-white">KWONG DEADLINE</span>
            <span className="text-white/70">— Claim your share of the $130M settlement before the filing window closes.</span>
          </span>
          <a
            href="https://taxclaim.virtuallaunch.pro/gala"
            target="_blank"
            rel="noreferrer"
            className="hidden font-sora text-[11px] font-semibold uppercase tracking-wider text-[#f97316] hover:text-white sm:inline"
          >
            Start a claim →
          </a>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-200px] h-[600px] w-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.10), transparent 60%)' }}
        />
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <Reveal>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-sora text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a3412]"
              style={{ borderColor: 'rgba(249,115,22,0.25)', background: '#fff7ed' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#f97316]" />
              Platform — 10 products, one account
            </span>
            <h1 className="mt-6 font-sora text-[44px] font-bold leading-[1.05] tracking-[-0.02em] md:text-[64px]">
              The operating system for{' '}
              <span style={{ color: '#f97316' }}>tax practices.</span>
            </h1>
            <p className="mt-6 max-w-[560px] text-[18px] leading-relaxed text-[#444]">
              From the first lead to the final refund — VLP unifies monitoring, automation, AI, and lead-gen across 10 specialized
              products. One login. One bill. One platform for the modern tax practice.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3.5 font-sora text-[15px] font-semibold text-white shadow-[0_10px_30px_-12px_rgba(249,115,22,0.7)] transition-transform hover:-translate-y-[1px]"
                style={{ background: '#f97316' }}
              >
                Start free →
              </Link>
              <a
                href="https://cal.com/tax-monitor-pro/vlp-intro"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg border px-6 py-3.5 font-sora text-[15px] font-semibold text-[#1a1a1a] transition-colors hover:bg-white"
                style={{ borderColor: 'rgba(0,0,0,0.12)', background: 'transparent' }}
              >
                Book a 15-min intro
              </a>
            </div>
            <ul className="mt-10 grid max-w-[520px] grid-cols-1 gap-2 text-[13px] text-[#555] sm:grid-cols-2">
              {[
                'No credit card to start',
                '20% lifetime affiliate',
                'Cancel anytime',
                '24/7 transcript monitoring',
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="font-sora text-[#10b981]">✓</span> {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <DashboardMockup />
          </Reveal>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="border-y bg-white" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-6 py-10 md:grid-cols-4">
          {[
            { stat: '$19K', label: 'Recovered for one client' },
            { stat: '10', label: 'Specialized platforms' },
            { stat: '20%', label: 'Lifetime affiliate commission' },
            { stat: '24/7', label: 'Transcript monitoring' },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-sora text-[28px] font-bold tracking-tight text-[#1a1a1a] md:text-[32px]">{s.stat}</div>
              <div className="mt-1 text-[12px] uppercase tracking-wider text-[#888]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ROLE ROUTER */}
      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-sora text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f97316]">Choose your path</p>
              <h2 className="mt-2 font-sora text-[32px] font-bold leading-tight tracking-tight md:text-[40px]">
                Who are you building for?
              </h2>
            </div>
            <p className="max-w-[420px] text-[14px] text-[#666]">
              Pick a role to filter the product grid below. Click again to see all 10.
            </p>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r, i) => {
            const active = activeRole === r.id
            return (
              <Reveal key={r.id} delay={i * 60}>
                <button
                  type="button"
                  onClick={() => setActiveRole(active ? null : r.id)}
                  className="group w-full rounded-xl border p-6 text-left transition-all hover:-translate-y-[2px]"
                  style={{
                    borderColor: active ? r.color : 'rgba(0,0,0,0.08)',
                    background: active ? r.bg : '#fff',
                    boxShadow: active ? `0 14px 40px -20px ${r.color}` : '0 1px 0 rgba(0,0,0,0.02)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex h-7 items-center justify-center rounded-full px-2.5 font-sora text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: r.bg, color: r.color }}
                    >
                      {r.id}
                    </span>
                    <span className="font-sora text-[11px] font-semibold uppercase tracking-wider" style={{ color: active ? r.color : '#999' }}>
                      {active ? 'Filtering ✓' : 'Pick'}
                    </span>
                  </div>
                  <div className="mt-5 font-sora text-[20px] font-semibold tracking-tight text-[#1a1a1a]">{r.label}</div>
                  <div className="mt-1 text-[13px] text-[#666]">{r.subtitle}</div>
                </button>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="mx-auto max-w-[1280px] px-6 pb-20">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <h3 className="font-sora text-[24px] font-bold tracking-tight text-[#1a1a1a] md:text-[28px]">
              {activeRole ? `For ${ROLES.find((r) => r.id === activeRole)?.label.toLowerCase()}s` : 'All 10 platforms'}
            </h3>
            <span className="text-[13px] text-[#888]">{visibleProducts.length} products</span>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((p, i) => (
            <Reveal key={p.abbrev} delay={i * 40}>
              <a
                href={p.domain}
                target="_blank"
                rel="noreferrer"
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-white p-6 pl-7 transition-all hover:-translate-y-[2px]"
                style={{ borderColor: 'rgba(0,0,0,0.06)' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background = p.bg
                  ;(e.currentTarget as HTMLElement).style.borderColor = `${p.color}4D`
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background = '#fff'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.06)'
                }}
              >
                <span className="absolute left-0 top-0 h-full w-[3px]" style={{ background: p.color }} />
                <span
                  className="inline-flex w-fit items-center rounded-full px-2 py-1 font-sora text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: p.bg, color: p.color }}
                >
                  {p.category}
                </span>
                <div className="mt-4 font-sora text-[18px] font-semibold tracking-tight text-[#1a1a1a]">{p.name}</div>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[#555]">{p.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1 font-sora text-[13px] font-semibold" style={{ color: p.color }}>
                  {p.cta} <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t bg-white" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-sora text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f97316]">How it works</p>
            <h2 className="mt-3 font-sora text-[36px] font-bold leading-[1.05] tracking-tight md:text-[44px]">
              Five steps from sign-up to compounding revenue.
            </h2>
            <p className="mt-5 max-w-[440px] text-[15px] leading-relaxed text-[#555]">
              VLP wasn&apos;t designed as a marketplace of disconnected tools. Every product feeds the next. The longer you stay,
              the more leverage you get.
            </p>
            <Link
              href="/how-it-works"
              className="mt-8 inline-flex items-center rounded-lg px-5 py-3 font-sora text-[14px] font-semibold text-white"
              style={{ background: '#1a1a2e' }}
            >
              Full walkthrough →
            </Link>
          </div>
          <div className="space-y-10">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 60}>
                <div className="flex gap-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-sora text-[14px] font-bold text-white"
                    style={{ background: s.color }}
                  >
                    {s.n}
                  </div>
                  <div>
                    <div className="font-sora text-[20px] font-semibold tracking-tight text-[#1a1a1a]">{s.title}</div>
                    <p className="mt-2 max-w-[560px] text-[14.5px] leading-relaxed text-[#555]">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF BANNER (dark) */}
      <section style={{ background: '#1a1a2e' }}>
        <div className="mx-auto max-w-[1280px] px-6 py-24 text-white">
          <Reveal>
            <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <p className="font-sora text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f97316]">Real outcomes</p>
                <h2 className="mt-3 font-sora text-[48px] font-bold leading-[1.02] tracking-tight md:text-[72px]">
                  <span style={{ color: '#f97316' }}>$19,000</span> recovered
                  <br />
                  for one client.
                </h2>
                <p className="mt-5 max-w-[520px] text-[15px] leading-relaxed text-white/70">
                  A single TMP alert caught a CP-2000 mismatch that would&apos;ve quietly cost a taxpayer five figures. They were
                  notified the day the transcript changed. Their CPA closed the issue in 11 days.
                </p>
              </div>
              <div>
                <div className="font-sora text-[14px] font-semibold uppercase tracking-wider text-white/60">Trust & infrastructure</div>
                <div className="mt-2 font-sora text-[56px] font-bold leading-none tracking-tight">578%</div>
                <div className="mt-2 text-[13px] text-white/60">ROAS on our first paid acquisition cohort</div>
              </div>
            </div>
          </Reveal>
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { t: 'CAN-SPAM compliant', d: 'Every outbound email signed + suppressible' },
              { t: 'Stripe-secured billing', d: 'Hosted + embedded checkout, webhook reconciled' },
              { t: 'HMAC-signed webhooks', d: 'Every backend event is verifiable end-to-end' },
              { t: '20% affiliate', d: 'Lifetime commission via Stripe Connect Express' },
            ].map((c) => (
              <div key={c.t} className="rounded-xl border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                <div className="font-sora text-[13px] font-semibold tracking-tight text-white">{c.t}</div>
                <div className="mt-1.5 text-[12px] leading-relaxed text-white/55">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-24 text-center">
          <Reveal>
            <p className="font-sora text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f97316]">Get started</p>
            <h2 className="mx-auto mt-3 max-w-[680px] font-sora text-[36px] font-bold leading-[1.1] tracking-tight md:text-[48px]">
              Not sure where to start?
            </h2>
            <p className="mx-auto mt-4 max-w-[560px] text-[16px] leading-relaxed text-[#555]">
              Book a 15-minute intro and we&apos;ll match you to the right entry-point product. No demo theater, no pressure.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="https://cal.com/tax-monitor-pro/vlp-intro"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg px-7 py-3.5 font-sora text-[15px] font-semibold text-white"
                style={{ background: '#f97316' }}
              >
                Book intro →
              </a>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg border px-7 py-3.5 font-sora text-[15px] font-semibold text-[#1a1a1a]"
                style={{ borderColor: 'rgba(0,0,0,0.12)' }}
              >
                View pricing
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
