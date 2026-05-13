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

function AnimateOnScroll({
  children,
  type = 'fade',
  delay = 0,
}: {
  children: ReactNode
  type?: 'fade' | 'scale'
  delay?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState<'visible' | 'hidden' | 'animating'>('visible')

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (el.getBoundingClientRect().top < window.innerHeight) return
    setState('hidden')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setState('animating')
            io.disconnect()
          }
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const style: React.CSSProperties =
    state === 'hidden'
      ? { opacity: 0 }
      : state === 'animating'
        ? {
            opacity: 0,
            animation: `${type === 'scale' ? 'vlpScaleIn 500ms' : 'vlpFadeIn 400ms'} ease-out ${delay}ms forwards`,
          }
        : { opacity: 1 }

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  )
}

function ProductCarousel() {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const onScroll = () => {
    const el = scrollerRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    onScroll()
  }, [])

  const scrollBy = (dx: number) => {
    scrollerRef.current?.scrollBy({ left: dx, behavior: 'smooth' })
  }

  return (
    <div style={{ position: 'relative', padding: '0 32px' }}>
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="vlp-carousel"
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 8,
        }}
      >
        {PRODUCTS.map((p) => (
          <a
            key={p.abbrev}
            href={p.domain}
            target="_blank"
            rel="noreferrer"
            className="vlp-card"
            style={{
              flex: '0 0 auto',
              width: 260,
              scrollSnapAlign: 'start',
              borderRadius: 14,
              background: 'white',
              border: '1px solid rgba(0,0,0,0.06)',
              borderTop: `3px solid ${p.color}`,
              padding: 20,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              transition: 'border-color 200ms ease, box-shadow 200ms ease',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = `${p.color}4D`
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.06)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
            }}
          >
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 17, fontWeight: 600, color: '#1a1a1a' }}>{p.name}</div>
            <span
              style={{
                marginTop: 8,
                alignSelf: 'flex-start',
                background: p.bg,
                color: p.color,
                fontFamily: 'Sora, sans-serif',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                padding: '4px 8px',
                borderRadius: 999,
              }}
            >
              {p.category}
            </span>
            <p style={{ marginTop: 14, fontSize: 13, lineHeight: 1.5, color: '#555', flex: 1 }}>{p.desc}</p>
          </a>
        ))}
      </div>

      {canLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy(-280)}
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            fontSize: 18,
            color: '#1a1a1a',
            zIndex: 2,
          }}
        >
          ‹
        </button>
      )}
      {canRight && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy(280)}
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'white',
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            fontSize: 18,
            color: '#1a1a1a',
            zIndex: 2,
          }}
        >
          ›
        </button>
      )}
    </div>
  )
}

function RoleTabs() {
  const [activeId, setActiveId] = useState(ROLES[0].id)
  const [fadeKey, setFadeKey] = useState(0)
  const active = ROLES.find((r) => r.id === activeId) || ROLES[0]
  const matched = PRODUCTS.filter((p) => active.filter.includes(p.abbrev))

  const select = (id: string) => {
    if (id === activeId) return
    setActiveId(id)
    setFadeKey((k) => k + 1)
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 8,
          marginTop: 32,
          overflowX: 'auto',
        }}
      >
        {ROLES.map((r) => {
          const isActive = r.id === activeId
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => select(r.id)}
              style={{
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 999,
                cursor: 'pointer',
                border: 'none',
                background: isActive ? '#f97316' : 'transparent',
                color: isActive ? 'white' : '#888',
                fontFamily: 'inherit',
                transition: 'background 200ms, color 200ms',
                whiteSpace: 'nowrap',
              }}
            >
              {r.label}
            </button>
          )
        })}
      </div>

      <div
        key={fadeKey}
        style={{
          marginTop: 40,
          animation: 'vlpFadeIn 300ms ease-out forwards',
        }}
        className="vlp-tab-panel"
      >
        <div className="vlp-tab-grid">
          <div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 600, color: active.color, textTransform: 'uppercase', letterSpacing: 1 }}>
              {active.subtitle}
            </div>
            <div style={{ marginTop: 8, fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>
              Built for {active.label.toLowerCase()}s
            </div>
            <ul style={{ marginTop: 20, listStyle: 'none', padding: 0 }}>
              {matched.map((p) => (
                <li key={p.abbrev} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14, fontSize: 15, lineHeight: 1.7, color: '#444' }}>
                  <span
                    style={{
                      flexShrink: 0,
                      marginTop: 9,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: p.color,
                    }}
                  />
                  <span>
                    <strong style={{ color: '#1a1a1a', fontWeight: 600 }}>{p.name}</strong> — {p.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignContent: 'start' }}>
            {matched.map((p) => (
              <a
                key={p.abbrev}
                href={p.domain}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: 'white',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderTop: `3px solid ${p.color}`,
                  borderRadius: 12,
                  padding: 16,
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    alignSelf: 'flex-start',
                    background: p.bg,
                    color: p.color,
                    fontFamily: 'Sora, sans-serif',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    padding: '3px 7px',
                    borderRadius: 999,
                  }}
                >
                  {p.category}
                </span>
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{p.name}</div>
                <span style={{ fontFamily: 'Sora, sans-serif', fontSize: 12, fontWeight: 600, color: p.color }}>
                  {p.cta} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LogoMarquee() {
  const items = PRODUCTS.map((p) => ({ name: p.abbrev, color: p.color }))
  const doubled = [...items, ...items]
  return (
    <div
      style={{
        overflow: 'hidden',
        height: 60,
        position: 'relative',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)',
        maskImage: 'linear-gradient(to right, transparent, black 60px, black calc(100% - 60px), transparent)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 48,
          alignItems: 'center',
          height: '100%',
          width: 'max-content',
          animation: 'vlpScroll 30s linear infinite',
        }}
      >
        {doubled.map((it, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: it.color }} />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'rgba(0,0,0,0.3)',
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontFamily: 'Sora, sans-serif',
              }}
            >
              {it.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="font-sans text-[#1a1a1a]" style={{ background: '#faf9f6' }}>
      <style jsx global>{`
        @keyframes vlpFadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes vlpScaleIn {
          from { opacity: 0; transform: scale(0.97) }
          to { opacity: 1; transform: scale(1) }
        }
        @keyframes vlpScroll {
          from { transform: translateX(0) }
          to { transform: translateX(-50%) }
        }
        .vlp-carousel::-webkit-scrollbar { display: none }
        .vlp-carousel { scrollbar-width: none }
        .vlp-tab-grid {
          display: grid;
          grid-template-columns: 55% 45%;
          gap: 32px;
        }
        @media (max-width: 768px) {
          .vlp-tab-grid {
            grid-template-columns: 1fr;
          }
          .vlp-timeline-line {
            left: 18px !important;
            transform: none !important;
          }
          .vlp-timeline-row {
            grid-template-columns: 1fr !important;
            padding-left: 56px;
          }
          .vlp-timeline-badge {
            left: 18px !important;
            transform: translateX(-50%) !important;
          }
        }
      `}</style>

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
      <section style={{ background: '#faf9f6', padding: '80px 16px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              color: '#f97316',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontFamily: 'Sora, sans-serif',
            }}
          >
            Platform — 10 Products, One Account
          </span>
          <h1
            style={{
              marginTop: 20,
              fontFamily: 'Sora, sans-serif',
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 700,
              letterSpacing: '-1px',
              lineHeight: 1.1,
              color: '#1a1a1a',
            }}
          >
            The operating system for{' '}
            <span style={{ color: '#f97316' }}>tax practices.</span>
          </h1>
          <p
            style={{
              margin: '20px auto 0',
              maxWidth: 640,
              fontSize: 18,
              lineHeight: 1.6,
              color: '#666',
            }}
          >
            From the first lead to the final refund — VLP unifies monitoring, automation, AI, and lead-gen across 10 specialized
            products. One login. One bill. One platform for the modern tax practice.
          </p>
          <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            <Link
              href="/sign-in"
              style={{
                background: '#f97316',
                color: 'white',
                padding: '14px 32px',
                borderRadius: 8,
                fontWeight: 600,
                fontFamily: 'Sora, sans-serif',
                fontSize: 15,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Start free →
            </Link>
            <a
              href="https://cal.com/tax-monitor-pro/vlp-intro"
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'transparent',
                color: '#1a1a1a',
                padding: '14px 32px',
                borderRadius: 8,
                fontWeight: 600,
                fontFamily: 'Sora, sans-serif',
                fontSize: 15,
                textDecoration: 'none',
                border: '1px solid rgba(0,0,0,0.15)',
                display: 'inline-block',
              }}
            >
              Book a 15-min intro
            </a>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', marginTop: '24px' }}>
            {['No credit card required', '20% lifetime affiliate commission', 'Cancel anytime', '24/7 monitoring'].map((item) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#888' }}>
                <span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT CAROUSEL */}
      <section style={{ background: '#faf9f6', paddingBottom: 64 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <ProductCarousel />
        </div>
      </section>

      {/* SOCIAL PROOF STATS (no $19K) */}
      <section className="border-y bg-white" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-6 py-10 sm:grid-cols-3">
          {[
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

      {/* SCROLLING LOGO BAR */}
      <section style={{ background: 'white', padding: '24px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <LogoMarquee />
      </section>

      {/* ROLE TABS */}
      <section style={{ padding: '80px 24px', background: '#faf9f6' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <AnimateOnScroll>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: 32, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.5px' }}>
                One ecosystem. Built for how you work.
              </h2>
              <p style={{ marginTop: 12, fontSize: 15, color: '#888', maxWidth: 560, margin: '12px auto 0' }}>
                Pick your role to see the products built for you.
              </p>
            </div>
          </AnimateOnScroll>
          <RoleTabs />
        </div>
      </section>

      {/* HOW IT WORKS — TIMELINE */}
      <section style={{ background: 'white', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <AnimateOnScroll>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <p style={{ fontFamily: 'Sora, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f97316' }}>
                How it works
              </p>
              <h2 style={{ marginTop: 12, fontFamily: 'Sora, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.5px', color: '#1a1a1a' }}>
                Five steps from sign-up to compounding revenue.
              </h2>
              <p style={{ marginTop: 16, maxWidth: 560, margin: '16px auto 0', fontSize: 15, lineHeight: 1.6, color: '#555' }}>
                Every product feeds the next. The longer you stay, the more leverage you get.
              </p>
            </div>
          </AnimateOnScroll>

          <div style={{ position: 'relative' }}>
            <div
              aria-hidden
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: 2,
                background: 'rgba(0,0,0,0.08)',
                transform: 'translateX(-50%)',
              }}
              className="vlp-timeline-line"
            />
            {STEPS.map((s, i) => {
              const isLeft = i % 2 === 0
              return (
                <AnimateOnScroll key={s.n} type="scale" delay={i * 60}>
                  <div
                    className="vlp-timeline-row"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 32,
                      marginBottom: 40,
                      position: 'relative',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      aria-hidden
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: 24,
                        transform: 'translateX(-50%)',
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: '#f97316',
                        color: 'white',
                        fontWeight: 700,
                        fontFamily: 'Sora, sans-serif',
                        fontSize: 13,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        boxShadow: '0 0 0 6px white',
                      }}
                      className="vlp-timeline-badge"
                    >
                      {s.n}
                    </div>
                    {isLeft ? (
                      <>
                        <div
                          className="vlp-timeline-card"
                          style={{
                            background: 'white',
                            border: '1px solid rgba(0,0,0,0.06)',
                            borderRadius: 12,
                            padding: 24,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                          }}
                        >
                          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>{s.title}</div>
                          <p style={{ marginTop: 8, fontSize: 14, color: '#666', lineHeight: 1.6 }}>{s.body}</p>
                        </div>
                        <div />
                      </>
                    ) : (
                      <>
                        <div />
                        <div
                          className="vlp-timeline-card"
                          style={{
                            background: 'white',
                            border: '1px solid rgba(0,0,0,0.06)',
                            borderRadius: 12,
                            padding: 24,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                          }}
                        >
                          <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>{s.title}</div>
                          <p style={{ marginTop: 8, fontSize: 14, color: '#666', lineHeight: 1.6 }}>{s.body}</p>
                        </div>
                      </>
                    )}
                  </div>
                </AnimateOnScroll>
              )
            })}
          </div>

        </div>
      </section>

      {/* PROOF BANNER (dark) — trust strip */}
      <section style={{ background: '#1a1a2e' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 24px', color: 'white' }}>
          <AnimateOnScroll>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontFamily: 'Sora, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#f97316' }}>
                Trust & infrastructure
              </p>
              <h2 style={{ marginTop: 12, fontFamily: 'Sora, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.5px', maxWidth: 720, margin: '12px auto 0' }}>
                Built on the same primitives big-tech uses.
              </h2>
              <div style={{ marginTop: 16, fontFamily: 'Sora, sans-serif', fontSize: 56, fontWeight: 700, lineHeight: 1, letterSpacing: '-1.5px' }}>578%</div>
              <div style={{ marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>ROAS on our first paid acquisition cohort</div>
            </div>
          </AnimateOnScroll>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              justifyContent: 'space-between',
            }}
          >
            {[
              { t: 'CAN-SPAM compliant', d: 'Every outbound email signed + suppressible' },
              { t: 'Stripe-secured billing', d: 'Hosted + embedded checkout, webhook reconciled' },
              { t: 'HMAC-signed webhooks', d: 'Every backend event is verifiable end-to-end' },
              { t: '20% affiliate', d: 'Lifetime commission via Stripe Connect Express' },
            ].map((c) => (
              <div
                key={c.t}
                style={{
                  flex: '1 1 240px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: 24,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontFamily: 'Sora, sans-serif', fontSize: 14, fontWeight: 600, color: 'white' }}>{c.t}</div>
                <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)' }}>{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ background: '#faf9f6', padding: '80px 24px', textAlign: 'center' }}>
        <AnimateOnScroll>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <p style={{ fontFamily: 'Sora, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#f97316' }}>
              Get started
            </p>
            <h2 style={{ marginTop: 12, fontFamily: 'Sora, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.5px', color: '#1a1a1a' }}>
              Not sure where to start?
            </h2>
            <p style={{ marginTop: 16, fontSize: 16, lineHeight: 1.6, color: '#555', maxWidth: 560, margin: '16px auto 0' }}>
              Book a 15-minute intro and we&apos;ll match you to the right entry-point product. No demo theater, no pressure.
            </p>
            <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              <a
                href="https://cal.com/tax-monitor-pro/vlp-intro"
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#f97316',
                  color: 'white',
                  padding: '14px 32px',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 15,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Book intro →
              </a>
              <Link
                href="/pricing"
                style={{
                  background: 'transparent',
                  color: '#1a1a1a',
                  padding: '14px 32px',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontFamily: 'Sora, sans-serif',
                  fontSize: 15,
                  textDecoration: 'none',
                  border: '1px solid rgba(0,0,0,0.15)',
                  display: 'inline-block',
                }}
              >
                View pricing
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  )
}
