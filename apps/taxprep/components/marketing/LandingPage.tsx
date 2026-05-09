'use client'

import { useEffect, useRef } from 'react'
import { tppConfig } from '@/lib/platform-config'
import { SuiteDashFormEmbed } from './SuiteDashFormEmbed'

// Phase 2: line-by-line port of the SD-built TPP landing page.
// Source under apps/taxprep/scratch/sd-landing.{html,css}.
// Deviations applied: 5 (port HTML/CSS), 6 (B2C → B2B copy rewrite),
// 9 (Sora replaces Cormorant Garamond + Inter), and the Deviation 1
// supplemental (Pattern A SuiteDashFormEmbed via next/script).
//
// Per Deviation 5 and the supplemental, animations and structural classes are
// preserved verbatim. Copy is rewritten for service-bureau / tax-pro audience
// with {/* TODO(copy): */} markers; the original SD copy was B2C tax-prep.

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null)

  // Behavior 1: stagger reveal on load (.tpp-loaded toggle on root).
  // Behavior 2: scroll reveal for .tpp-reveal via IntersectionObserver.
  // Behavior 3: phase rail draw-on (.is-drawn) via IntersectionObserver.
  // Behavior 5: count-up stats (1400ms ease-out from 0 → data-count, append data-suffix).
  // Behavior 6: QR card flip on click (.is-flipped toggle).
  //
  // Parallax orbs (.tpp-hero-orb data-parallax) skipped per RC prompt §4.4 —
  // the static blurred orbs read fine without scroll-coupled motion and the
  // per-frame scroll listener was outside the ~20-line budget.

  // 1. Stagger reveal on load — releases .tpp-loaded after window.load.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    // Mark JS active so CSS can keep elements hidden only when JS will reveal them.
    root.classList.add('tpp-js')
    const onLoad = () => root.classList.add('tpp-loaded')
    if (document.readyState === 'complete') {
      onLoad()
    } else {
      window.addEventListener('load', onLoad, { once: true })
    }
    return () => window.removeEventListener('load', onLoad)
  }, [])

  // 2. Scroll reveal for .tpp-reveal elements (threshold 0.15).
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const els = root.querySelectorAll<HTMLElement>('.tpp-reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('tpp-in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // 3. Phase-rail draw-on (.is-drawn) via IntersectionObserver.
  useEffect(() => {
    const rail = rootRef.current?.querySelector<HTMLElement>('#tpp-phase-rail')
    if (!rail) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            rail.classList.add('is-drawn')
            io.unobserve(rail)
          }
        })
      },
      { threshold: 0.3 }
    )
    io.observe(rail)
    return () => io.disconnect()
  }, [])

  // 5. Count-up stats. Animates each .tpp-stat-num from 0 → data-count over
  // ~1400ms with ease-out, appending data-suffix. Triggered when the parent
  // .tpp-stat reveals.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const stats = root.querySelectorAll<HTMLElement>('.tpp-stat')
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
    const animate = (numEl: HTMLElement) => {
      const target = Number(numEl.dataset.count || '0')
      const suffix = numEl.dataset.suffix || ''
      const duration = 1400
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const value = Math.round(easeOut(t) * target)
        numEl.textContent = `${value}${suffix}`
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const numEl = entry.target.querySelector<HTMLElement>('.tpp-stat-num')
            if (numEl) animate(numEl)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 }
    )
    stats.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // 6. QR card flip on click.
  useEffect(() => {
    const card = rootRef.current?.querySelector<HTMLElement>('.tpp-qr-card')
    if (!card) return
    const onClick = () => card.classList.toggle('is-flipped')
    card.addEventListener('click', onClick)
    return () => card.removeEventListener('click', onClick)
  }, [])

  return (
    <div className="tpp-lp" ref={rootRef}>
      <style>{TPP_LANDING_CSS}</style>

      {/* Header lives in app/page.tsx as the canonical MarketingHeader. */}

      {/* Hero */}
      <section className="tpp-hero" id="tpp-top">
        <div className="tpp-hero-breath" aria-hidden="true" />
        <div className="tpp-hero-orb tpp-one" data-parallax="0.18" />
        <div className="tpp-hero-orb tpp-two" data-parallax="0.12" />
        <div className="tpp-hero-orb tpp-three" data-parallax="0.24" />
        <div className="tpp-wrap">
          <div className="tpp-hero-copy">
            {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
            <span className="tpp-hero-kicker tpp-stagger">Now Onboarding Service Bureaus</span>
            <h1 className="tpp-h1">
              {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
              <span className="tpp-stagger">Your service bureau,</span>
              <span className="tpp-stagger">
                productized <em className="tpp-accent">end-to-end.</em>
              </span>
            </h1>
            <p className="tpp-lede tpp-stagger">
              {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
              A clear, structured 8-phase client journey from intake to filing — handled inside a branded SuiteDash workspace your team and your clients actually want to use.
            </p>
            <div className="tpp-hero-ctas tpp-stagger">
              <a href="#tpp-book" className="tpp-btn-primary">
                Book a Discovery Call
                <span className="tpp-arrow">→</span>
              </a>
              <a href="#tpp-how" className="tpp-btn-secondary">
                See How It Works
              </a>
            </div>
            <div className="tpp-hero-trust tpp-stagger">
              {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
              <span><span className="tpp-check">✶</span> EAs, CPAs &amp; attorneys</span>
              <span><span className="tpp-check">✶</span> Branded SD portal</span>
              <span><span className="tpp-check">✶</span> Member training included</span>
            </div>
          </div>
          <div className="tpp-hero-photo">
            <span className="tpp-photo-tag">Your Workspace</span>
            <div className="tpp-photo-frame">
              <div className="tpp-photo-glow" aria-hidden="true" />
              {/* TODO(SD-FIDELITY): replace with TPP-hosted hero asset; SD path
                  references the SD CDN and will not resolve from the static export. */}
              <img
                src="https://virtuallaunch.pro/assets/tpp-hero-placeholder.png"
                alt="Tax Prep Pro workspace preview"
              />
            </div>
            <div className="tpp-photo-badge">
              <span className="tpp-stars">★★★★★</span>
              {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
              <span className="tpp-label-text">Trusted by service bureaus &amp; tax pros</span>
            </div>
          </div>
        </div>
        <div className="tpp-hero-scroll" aria-hidden="true">
          <span className="tpp-scroll-line"></span>
          <span className="tpp-scroll-text">Scroll</span>
        </div>
      </section>

      {/* Stats bar */}
      <section className="tpp-stats">
        <div className="tpp-wrap">
          <div className="tpp-stat tpp-reveal">
            <div className="tpp-stat-num" data-count="50" data-suffix="">50</div>
            <div className="tpp-stat-label">States Served</div>
          </div>
          <div className="tpp-stat tpp-reveal tpp-delay-1">
            <div className="tpp-stat-num" data-count="100" data-suffix="%">100%</div>
            <div className="tpp-stat-label">E-File Accuracy</div>
          </div>
          <div className="tpp-stat tpp-reveal tpp-delay-2">
            <div className="tpp-stat-num" data-count="8" data-suffix="">8</div>
            <div className="tpp-stat-label">Phase Process</div>
          </div>
          <div className="tpp-stat tpp-reveal tpp-delay-3">
            <div className="tpp-stat-num" data-count="30" data-suffix="d">30d</div>
            {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
            <div className="tpp-stat-label">Avg. Bureau Setup</div>
          </div>
        </div>
      </section>

      {/* Services tier cards */}
      <section className="tpp-section tpp-types" id="tpp-services">
        <div className="tpp-wrap">
          <div className="tpp-section-head tpp-reveal">
            {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
            <span className="tpp-section-kicker">Built For Your Bureau</span>
            <h2 className="tpp-h2">
              Find the engagement<br />that fits your <em>practice.</em>
            </h2>
            <p>
              {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
              Pick the option that best describes your bureau. Each one ships a branded SuiteDash workspace, the 8-phase client journey, and member training.
            </p>
          </div>
          <div className="tpp-type-grid">
            <a href="#tpp-book" className="tpp-type-card tpp-reveal tpp-delay-1">
              <div className="tpp-card-shimmer" aria-hidden="true" />
              {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
              <span className="tpp-badge">Managed Setup</span>
              <h3 className="tpp-h3">
                Tax Prep Pro<br />
                <span className="tpp-card-h-accent">Managed</span>
              </h3>
              <div className="tpp-price">
                <span className="tpp-price-currency">$</span>
                <span className="tpp-price-amount">5,000</span>
                <small> setup + $79/mo per active member</small>
              </div>
              <p>
                Productized buildout for solo practitioners and 2–5 person bureaus. Branded portal, journey, member training included.
              </p>
              <span className="tpp-arrow-link">
                Book Discovery <span className="tpp-arrow">→</span>
              </span>
            </a>
            <a href="#tpp-book" className="tpp-type-card tpp-reveal tpp-delay-2">
              <div className="tpp-card-shimmer" aria-hidden="true" />
              {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
              <span className="tpp-badge">TPP + TMP Bundle</span>
              <h3 className="tpp-h3">
                TPP +<br />
                <span className="tpp-card-h-accent">Tax Monitor Pro</span>
              </h3>
              <div className="tpp-price">
                <span className="tpp-price-currency">$</span>
                <span className="tpp-price-amount">8,500</span>
                <small> bundle</small>
              </div>
              <p>
                Pair the TPP buildout with Tax Monitor Pro for transcript monitoring and client retention workflows.
              </p>
              <span className="tpp-arrow-link">
                Book Discovery <span className="tpp-arrow">→</span>
              </span>
            </a>
            <a href="#tpp-book" className="tpp-type-card tpp-reveal tpp-delay-3">
              <div className="tpp-card-shimmer" aria-hidden="true" />
              {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
              <span className="tpp-badge">Ongoing Support</span>
              <h3 className="tpp-h3">
                Ongoing<br />
                <span className="tpp-card-h-accent">Support</span>
              </h3>
              <div className="tpp-price">
                <span className="tpp-price-currency">$</span>
                <span className="tpp-price-amount">497</span>
                <small> /mo or $150/hr</small>
              </div>
              <p>
                Continuous improvement, workflow tuning, and SD admin support after the initial buildout ships.
              </p>
              <span className="tpp-arrow-link">
                Book Discovery <span className="tpp-arrow">→</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* 8-phase rail */}
      <section className="tpp-section tpp-how" id="tpp-how">
        <div className="tpp-wrap">
          <div className="tpp-section-head tpp-reveal">
            <span className="tpp-section-kicker">Our 8-Phase Process</span>
            <h2 className="tpp-h2">
              From booking to delivery —<br />your clients always know <em>where things stand.</em>
            </h2>
            <p>
              {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
              Every taxpayer follows the same clear path inside your branded SuiteDash workspace, with intake adjusted to filing type.
            </p>
          </div>
          <div className="tpp-phase-rail" id="tpp-phase-rail">
            <svg
              className="tpp-phase-line"
              viewBox="0 0 1100 4"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="tpp-phase-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E91E63" stopOpacity="0.2" />
                  <stop offset="20%" stopColor="#E91E63" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#8B1538" stopOpacity="1" />
                  <stop offset="80%" stopColor="#D4A574" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#D4A574" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <line x1="2" y1="2" x2="1098" y2="2" />
            </svg>
            {[
              { n: 1, label: ['Identify', 'Taxpayer Type'] },
              { n: 2, label: ['Intake', 'Form'] },
              { n: 3, label: ['Service', 'Agreement'] },
              { n: 4, label: ['Payment'] },
              { n: 5, label: ['Prep', '& Review'] },
              { n: 6, label: ['E-Sign', '8879'] },
              { n: 7, label: ['File'] },
              { n: 8, label: ['Deliver', '& Close'] },
            ].map((p, i) => (
              <div
                key={p.n}
                className={`tpp-phase tpp-reveal${i > 0 ? ` tpp-delay-${i}` : ''}`}
              >
                <div className="tpp-num">{p.n}</div>
                <div className="tpp-label">
                  {p.label.map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < p.label.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking form section — SuiteDash Discovery Call form */}
      <section className="tpp-section tpp-book" id="tpp-book">
        <div className="tpp-wrap tpp-medium">
          <div className="tpp-form-card tpp-reveal">
            <div className="tpp-form-glow" aria-hidden="true" />
            <div className="tpp-form-badge" aria-hidden="true">
              <span className="tpp-form-badge-line-1">Now</span>
              <span className="tpp-form-badge-line-2">Booking</span>
            </div>
            <div className="tpp-form-head">
              <span className="tpp-section-kicker">For Service Bureaus &amp; Tax Pros</span>
              <h3 className="tpp-h3-large">
                <span className="tpp-h3-line-1">Want a workspace like this</span>
                <em className="tpp-h3-line-2">that does the whole job?</em>
              </h3>
              <p className="tpp-sub">
                {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
                From intake to final return delivery — all from one branded SuiteDash workspace. Book a Discovery Call and we&rsquo;ll show you how.
              </p>
            </div>
            <div className="tpp-form-embed tpp-form-sd">
              <SuiteDashFormEmbed
                formId={tppConfig.suitedashDiscoveryFormId!}
                embedBaseUrl={tppConfig.suitedashEmbedBaseUrl!}
              />
            </div>
          </div>
        </div>
      </section>

      {/* "How We Work" location-style cards (B2B repurposed) */}
      <section className="tpp-section tpp-locations" id="tpp-locations">
        <div className="tpp-wrap">
          <div className="tpp-section-head tpp-reveal">
            <span className="tpp-section-kicker">How We Work</span>
            <h2 className="tpp-h2">
              {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
              Built for your bureau —<br /><em>however you operate.</em>
            </h2>
            <p>
              {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
              Whether you run a storefront practice or a fully remote firm, the TPP buildout adapts to your workflow without forcing your team into a new tool stack.
            </p>
          </div>
          <div className="tpp-loc-grid">
            <div className="tpp-loc-card tpp-reveal tpp-delay-1">
              {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
              <span className="tpp-pin"><span className="tpp-dot"></span> Storefront Bureaus</span>
              <h3 className="tpp-h3">
                Streamline your<br />in-office intake.
              </h3>
              <p className="tpp-addr">
                Replace clipboards and paper checklists with a digital intake your front desk loads on a tablet. Documents drop straight into the client&rsquo;s SD record.
              </p>
              <p className="tpp-phone">Document scanner &amp; barcode workflows supported.</p>
              <a href="#tpp-book" className="tpp-book-here">
                Book a Discovery Call <span className="tpp-arrow">→</span>
              </a>
            </div>
            <div className="tpp-loc-card tpp-reveal tpp-delay-2">
              {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
              <span className="tpp-pin"><span className="tpp-dot"></span> Remote &amp; Hybrid Firms</span>
              <h3 className="tpp-h3">
                Run a paperless<br />practice end-to-end.
              </h3>
              <p className="tpp-addr">
                Clients upload securely, sign electronically, and meet by video when needed. Your team works the same workspace from anywhere — no new tools to learn.
              </p>
              <p className="tpp-phone">Secure portal &amp; e-signature included.</p>
              <a href="#tpp-book" className="tpp-book-here">
                Book a Discovery Call <span className="tpp-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QR strip with flip card */}
      <section className="tpp-qr-strip">
        <div className="tpp-qr-bg-glow" aria-hidden="true" />
        <div className="tpp-wrap">
          <div className="tpp-qr-copy tpp-reveal">
            {/* TODO(copy): QR strip kept on tone — refine wording with Jamie */}
            <span className="tpp-kicker-on-dark">On a Laptop?</span>
            <h2 className="tpp-h2-on-dark">
              Take this with you —<br />
              <em className="tpp-accent-rose">scan to continue on your phone.</em>
            </h2>
            <p>
              Send a copy to your phone, finish booking on the go, or share with a partner. Point your phone&rsquo;s camera at the QR code.
            </p>
            <div className="tpp-qr-steps">
              <div className="tpp-qr-step">
                <span className="tpp-step-num">1</span> Open your phone&rsquo;s camera
              </div>
              <div className="tpp-qr-step">
                <span className="tpp-step-num">2</span> Point it at the code
              </div>
              <div className="tpp-qr-step">
                <span className="tpp-step-num">3</span> Tap the link that appears
              </div>
            </div>
          </div>
          <div className="tpp-qr-card tpp-reveal tpp-delay-1">
            <div className="tpp-qr-card-inner">
              <div className="tpp-qr-card-front">
                {/* TODO(SD-FIDELITY): replace with TPP-hosted QR; SD CDN path
                    will not resolve from the static export. */}
                <img
                  src="https://virtuallaunch.pro/assets/tpp-qr-placeholder.svg"
                  alt="Scan to view this page on your phone"
                />
                <div className="tpp-qr-label">Scan to Book</div>
              </div>
              <div className="tpp-qr-card-back">
                <div className="tpp-qr-back-mark">Tax Prep Pro</div>
                <div className="tpp-qr-back-tag">Step 1 of 8</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="tpp-cta-strip">
        <div className="tpp-cta-glow" aria-hidden="true" />
        <div className="tpp-wrap">
          <h2 className="tpp-h2-on-dark tpp-reveal">
            {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
            Productize your bureau —<br />
            <em className="tpp-accent-rose">in 30 days, end-to-end.</em>
          </h2>
          <p className="tpp-reveal tpp-delay-1">
            {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
            Book a Discovery Call and we&rsquo;ll walk through the 8-phase journey, the SD workspace, and what your team would actually run.
          </p>
          <a href="#tpp-book" className="tpp-btn-primary tpp-cta-btn tpp-reveal tpp-delay-2">
            Book a Discovery Call
            <span className="tpp-arrow">→</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <div className="tpp-footer">
        <div className="tpp-wrap">
          <div>
            <div className="tpp-foot-brand">
              Tax Prep Pro
              {/* TODO(copy): Awaiting final B2B copy from Jamie */}
              <span className="tpp-foot-brand-tag">For Service Bureaus &amp; Tax Pros</span>
            </div>
            <p>
              {/* TODO(copy): Awaiting final B2B copy from Jamie — placeholder rewritten from SD B2C source */}
              Productized SuiteDash buildouts for credentialed tax practitioners. 8-phase client journey, branded portal, member training included.
            </p>
          </div>
          <div>
            <div className="tpp-h4">About</div>
            <a href="#tpp-services">Our Services</a>
            <a href="#tpp-how">How It Works</a>
            <a href="#tpp-book">Book Discovery</a>
            <a href="https://virtuallaunch.pro" target="_blank" rel="noopener">
              Virtual Launch Pro
            </a>
          </div>
          <div>
            <div className="tpp-h4">Contact Us</div>
            <p className="tpp-contact-line">
              {/* TODO(copy): Jamie to confirm TPP-specific contact email */}
              <strong>Email</strong>{tppConfig.businessInfo?.supportEmail}
            </p>
            <p className="tpp-contact-line">
              <strong>Phone</strong>{tppConfig.businessInfo?.phone}
            </p>
            <p className="tpp-contact-line">
              <strong>Hours</strong>Mon–Fri 9:00 AM – 6:00 PM PT
            </p>
            <p className="tpp-contact-line">
              {/* TODO(copy): Awaiting final B2B copy from Jamie */}
              <strong>Service Area</strong>All 50 states — remote &amp; hybrid bureaus
            </p>
          </div>
          <div>
            <div className="tpp-h4">Get Connected</div>
            <div className="tpp-socials">
              {/* TODO(copy): Jamie to confirm TPP-specific social handles */}
              <a href="https://facebook.com/virtuallaunch" target="_blank" rel="noopener" aria-label="Facebook">f</a>
              <a href="https://twitter.com/virtuallaunch" target="_blank" rel="noopener" aria-label="Twitter / X">𝕏</a>
              <a href="https://instagram.com/virtuallaunch" target="_blank" rel="noopener" aria-label="Instagram">IG</a>
            </div>
          </div>
        </div>
        <div className="tpp-copy-bar">
          © {new Date().getFullYear()} Tax Prep Pro. All Rights Reserved. &nbsp;·&nbsp; Powered by Virtual Launch Pro.
        </div>
      </div>
    </div>
  )
}

// Ported SD CSS, namespaced under `.tpp-lp`.
// Per Deviation 9, Cormorant Garamond + Inter @import is removed and the
// font-display / font-body vars resolve to Sora (loaded in app/layout.tsx).
const TPP_LANDING_CSS = `
.tpp-lp {
  --tpp-rose:           #E91E63;
  --tpp-rose-deep:      #C2185B;
  --tpp-rose-glow:      rgba(233, 30, 99, 0.45);
  --tpp-crimson:        #8B1538;
  --tpp-crimson-deep:   #5C0D24;
  --tpp-blush:          #FFE5EC;
  --tpp-blush-tint:     rgba(255, 229, 236, 0.6);
  --tpp-noir:           #1A0B14;
  --tpp-champagne:      #F5E6D3;
  --tpp-champagne-deep: #EBD7BE;
  --tpp-ivory:          #FFFAF4;
  --tpp-gold-leaf:      #D4A574;
  --tpp-gold-bright:    #E8C088;

  --tpp-text:           #2A1820;
  --tpp-text-muted:     #6B5260;
  --tpp-text-on-dark:   #F5E6D3;
  --tpp-text-on-rose:   #FFFFFF;

  --tpp-border:         rgba(139, 21, 56, 0.14);
  --tpp-border-strong:  rgba(139, 21, 56, 0.30);
  --tpp-border-rose:    rgba(233, 30, 99, 0.35);

  --tpp-font-display:   var(--font-sora), system-ui, sans-serif;
  --tpp-font-body:      var(--font-sora), system-ui, sans-serif;
  --tpp-radius-sm:      8px;
  --tpp-radius-md:      14px;
  --tpp-radius-lg:      24px;

  --tpp-shadow-sm:      0 2px 12px rgba(139, 21, 56, 0.08);
  --tpp-shadow-md:      0 16px 40px rgba(139, 21, 56, 0.14);
  --tpp-shadow-lg:      0 28px 70px rgba(139, 21, 56, 0.22);
  --tpp-shadow-rose:    0 16px 50px rgba(233, 30, 99, 0.30);

  --tpp-ease-out:       cubic-bezier(0.16, 1, 0.3, 1);
  --tpp-ease-in-out:    cubic-bezier(0.65, 0, 0.35, 1);
  --tpp-dur-fast:       180ms;
  --tpp-dur-base:       400ms;
  --tpp-dur-slow:       800ms;
  --tpp-dur-reveal:     900ms;
}

.tpp-lp, .tpp-lp * { box-sizing: border-box; }
.tpp-lp {
  font-family: var(--tpp-font-body);
  color: var(--tpp-text);
  background: var(--tpp-champagne);
  line-height: 1.55;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.tpp-lp a, .tpp-lp a:link, .tpp-lp a:visited, .tpp-lp a:hover, .tpp-lp a:focus, .tpp-lp a:active { color: inherit; text-decoration: none !important; }
.tpp-lp a *, .tpp-lp a span, .tpp-lp a em, .tpp-lp a small, .tpp-lp a h1, .tpp-lp a h2, .tpp-lp a h3, .tpp-lp a h4, .tpp-lp a p, .tpp-lp a div { text-decoration: none !important; border-bottom: 0 !important; }
.tpp-lp img { max-width: 100%; display: block; }
.tpp-lp .tpp-wrap { width: 100%; max-width: 1180px; margin: 0 auto; padding: 0 24px; }
.tpp-lp .tpp-narrow { max-width: 760px; }
.tpp-lp .tpp-medium { max-width: 960px; }

.tpp-lp .tpp-hero { position: relative; overflow: hidden; padding: 96px 0 96px; background: linear-gradient(135deg, var(--tpp-champagne) 0%, var(--tpp-blush) 60%, var(--tpp-champagne-deep) 100%); }
.tpp-lp .tpp-hero::before { content: ""; position: absolute; inset: 24px; border: 2px solid rgba(139, 21, 56, 0.25); border-radius: 20px; pointer-events: none; z-index: 1; }
.tpp-lp .tpp-hero::after { content: ""; position: absolute; inset: 40px; border: 1px solid rgba(212, 165, 116, 0.35); border-radius: 14px; pointer-events: none; z-index: 1; }

.tpp-lp .tpp-hero-breath { position: absolute; inset: -10%; background: radial-gradient(ellipse 60% 50% at 22% 18%, rgba(233, 30, 99, 0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 78% 82%, rgba(139, 21, 56, 0.20) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255, 229, 236, 0.55) 0%, transparent 70%); z-index: 0; animation: tpp-breath 14s var(--tpp-ease-in-out) infinite; }
@keyframes tpp-breath { 0%, 100% { transform: scale(1) translate(0, 0); opacity: 1; } 50% { transform: scale(1.08) translate(-1.5%, 1%); opacity: 0.85; } }

.tpp-lp .tpp-hero-orb { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; z-index: 0; }
.tpp-lp .tpp-hero-orb.tpp-one { width: 360px; height: 360px; top: -100px; left: -120px; background: var(--tpp-rose-glow); }
.tpp-lp .tpp-hero-orb.tpp-two { width: 420px; height: 420px; bottom: -160px; right: -140px; background: rgba(139, 21, 56, 0.32); }
.tpp-lp .tpp-hero-orb.tpp-three { width: 240px; height: 240px; top: 30%; right: 30%; background: rgba(212, 165, 116, 0.30); }

.tpp-lp .tpp-hero .tpp-wrap { position: relative; z-index: 1; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 72px; align-items: center; }

.tpp-lp .tpp-hero-kicker { display: inline-flex; align-items: center; gap: 12px; font-size: 11px; font-weight: 700; letter-spacing: 2.4px; text-transform: uppercase; color: var(--tpp-noir); background: var(--tpp-ivory); padding: 10px 22px 10px 18px; border-radius: 999px; margin-bottom: 28px; border: 1.5px solid var(--tpp-crimson); box-shadow: 0 2px 12px rgba(139, 21, 56, 0.10); }
.tpp-lp .tpp-hero-kicker::before { content: ""; display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: var(--tpp-rose); flex: 0 0 auto; box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.18); }

.tpp-lp .tpp-h1 { font-family: var(--tpp-font-display); font-size: clamp(44px, 5.6vw, 72px); font-weight: 600; color: var(--tpp-noir); line-height: 1.02; letter-spacing: -0.8px; margin: 0 0 26px; }
.tpp-lp .tpp-h1 span { display: block; }
.tpp-lp .tpp-accent { color: var(--tpp-rose); font-style: italic; font-weight: 600; -webkit-text-fill-color: var(--tpp-rose); }
.tpp-lp .tpp-accent-rose { color: var(--tpp-rose); font-style: italic; }

.tpp-lp .tpp-lede { font-size: 19px; color: var(--tpp-text-muted); margin: 0 0 36px; max-width: 540px; line-height: 1.6; }

.tpp-lp .tpp-hero-ctas { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 32px; }

.tpp-lp .tpp-btn-primary, .tpp-lp .tpp-btn-primary:link, .tpp-lp .tpp-btn-primary:visited, .tpp-lp .tpp-btn-primary:hover, .tpp-lp .tpp-btn-primary:focus, .tpp-lp .tpp-btn-primary:active, .tpp-lp .tpp-btn-primary span, .tpp-lp .tpp-btn-primary > * { color: #FFFFFF !important; }

.tpp-lp .tpp-btn-primary { display: inline-flex; align-items: center; gap: 10px; background: linear-gradient(135deg, var(--tpp-rose), var(--tpp-crimson)); color: var(--tpp-text-on-rose); padding: 18px 32px; border-radius: 999px; font-weight: 600; font-size: 15px; letter-spacing: 0.4px; position: relative; overflow: hidden; transition: transform var(--tpp-dur-base) var(--tpp-ease-out), box-shadow var(--tpp-dur-base) var(--tpp-ease-out); box-shadow: var(--tpp-shadow-sm); animation: tpp-wiggle 5s var(--tpp-ease-in-out) infinite; transform-origin: center center; }
@keyframes tpp-wiggle { 0%, 100% { transform: translateY(0) rotate(0deg); } 15% { transform: translateY(-10px) rotate(-6deg); } 35% { transform: translateY(8px) rotate(5deg); } 55% { transform: translateY(-6px) rotate(-4deg); } 75% { transform: translateY(5px) rotate(3deg); } 90% { transform: translateY(-2px) rotate(-1deg); } }
.tpp-lp .tpp-btn-primary::before { content: ""; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.45) 50%, transparent 100%); transition: left 700ms var(--tpp-ease-out); pointer-events: none; }
.tpp-lp .tpp-btn-primary > * { position: relative; z-index: 1; }
.tpp-lp .tpp-btn-primary:hover { transform: translateY(-3px); box-shadow: var(--tpp-shadow-rose); animation-play-state: paused; }
.tpp-lp .tpp-btn-primary:hover::before { left: 130%; }

.tpp-lp .tpp-btn-secondary { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: var(--tpp-crimson); padding: 18px 28px; border-radius: 999px; font-weight: 600; font-size: 15px; border: 1.5px solid var(--tpp-crimson); transition: background var(--tpp-dur-base) ease, color var(--tpp-dur-base) ease; }
.tpp-lp .tpp-btn-secondary:hover { background: var(--tpp-crimson); color: var(--tpp-text-on-rose); }

.tpp-lp .tpp-arrow { transition: transform var(--tpp-dur-base) var(--tpp-ease-out); display: inline-block; }
.tpp-lp .tpp-btn-primary:hover .tpp-arrow, .tpp-lp .tpp-btn-secondary:hover .tpp-arrow, .tpp-lp .tpp-arrow-link:hover .tpp-arrow, .tpp-lp .tpp-book-here:hover .tpp-arrow { transform: translateX(5px); }

.tpp-lp .tpp-hero-trust { display: flex; flex-wrap: wrap; gap: 20px; font-size: 13px; color: var(--tpp-text-muted); }
.tpp-lp .tpp-check { color: var(--tpp-rose); font-weight: 700; margin-right: 6px; font-size: 14px; }

.tpp-lp .tpp-hero-photo { position: relative; display: flex; justify-content: center; align-items: center; }
.tpp-lp .tpp-photo-frame { position: relative; width: 100%; max-width: 460px; aspect-ratio: 4 / 5; border-radius: var(--tpp-radius-lg); overflow: visible; box-shadow: var(--tpp-shadow-lg); background: linear-gradient(135deg, var(--tpp-rose) 0%, var(--tpp-crimson) 50%, var(--tpp-gold-leaf) 100%); padding: 10px; transition: transform var(--tpp-dur-base) var(--tpp-ease-out); }
.tpp-lp .tpp-photo-frame::before { content: ""; position: absolute; inset: 10px; border-radius: calc(var(--tpp-radius-lg) - 6px); background: var(--tpp-ivory); z-index: 0; }
.tpp-lp .tpp-photo-frame:hover { transform: translateY(-6px) scale(1.01); }

.tpp-lp .tpp-photo-glow { position: absolute; inset: 22px; border-radius: calc(var(--tpp-radius-lg) - 12px); overflow: hidden; background: radial-gradient(circle at 30% 20%, rgba(233, 30, 99, 0.18), transparent 60%), radial-gradient(circle at 70% 90%, rgba(139, 21, 56, 0.22), transparent 60%); z-index: 0; animation: tpp-glow-rotate 18s linear infinite; }
@keyframes tpp-glow-rotate { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.1); } 100% { transform: rotate(360deg) scale(1); } }
.tpp-lp .tpp-photo-frame img { position: absolute; top: 7px; left: 22px; right: 22px; bottom: 37px; width: calc(100% - 44px); height: calc(100% - 44px); object-fit: cover; object-position: center 20%; border-radius: calc(var(--tpp-radius-lg) - 12px); z-index: 1; }
.tpp-lp .tpp-photo-tag { position: absolute; top: 22px; left: 30px; z-index: 3; background: var(--tpp-noir); color: var(--tpp-text-on-dark); padding: 10px 18px; border-radius: 0; font-size: 11px; font-weight: 700; letter-spacing: 2.2px; text-transform: uppercase; border: 1.5px solid var(--tpp-gold-leaf); box-shadow: 0 4px 16px rgba(26, 11, 20, 0.25); }
.tpp-lp .tpp-photo-badge { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 3; background: var(--tpp-ivory); padding: 16px 22px; border-radius: var(--tpp-radius-md); box-shadow: var(--tpp-shadow-md); display: flex; flex-direction: column; gap: 6px; align-items: center; border: 1.5px solid var(--tpp-gold-leaf); }
.tpp-lp .tpp-stars { color: var(--tpp-gold-leaf); font-size: 18px; letter-spacing: 2px; }
.tpp-lp .tpp-label-text { font-size: 10px; font-weight: 700; color: var(--tpp-text-muted); letter-spacing: 1.2px; text-transform: uppercase; text-align: center; }

.tpp-lp .tpp-hero-scroll { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 14px; opacity: 0.85; }
.tpp-lp .tpp-scroll-line { width: 32px; height: 32px; background-color: transparent; background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none' stroke='%238B1538' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 6 L16 24'/%3E%3Cpath d='M8 17 L16 25 L24 17'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: center; background-size: contain; animation: tpp-scroll-arrow 2.4s var(--tpp-ease-in-out) infinite; transform-origin: center; }
@keyframes tpp-scroll-arrow { 0%, 100% { transform: translateY(0); opacity: 0.55; } 50% { transform: translateY(8px); opacity: 1; } }
.tpp-lp .tpp-scroll-text { font-size: 11px; font-weight: 700; letter-spacing: 2.4px; text-transform: uppercase; color: var(--tpp-crimson); }

.tpp-lp .tpp-stats { background: var(--tpp-noir); color: var(--tpp-text-on-dark); padding: 56px 0; border-top: 1px solid rgba(212, 165, 116, 0.20); border-bottom: 1px solid rgba(212, 165, 116, 0.20); }
.tpp-lp .tpp-stats .tpp-wrap { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }
.tpp-lp .tpp-stat { text-align: center; position: relative; }
.tpp-lp .tpp-stat:not(:last-child)::after { content: ""; position: absolute; right: -16px; top: 50%; transform: translateY(-50%); width: 1px; height: 60%; background: linear-gradient(to bottom, transparent, var(--tpp-gold-leaf), transparent); opacity: 0.4; }
.tpp-lp .tpp-stat-num { font-family: var(--tpp-font-display); font-size: clamp(40px, 5vw, 60px); font-weight: 600; line-height: 1; background: linear-gradient(135deg, var(--tpp-rose) 0%, var(--tpp-gold-bright) 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; letter-spacing: -0.5px; }
.tpp-lp .tpp-stat-label { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(245, 230, 211, 0.70); }

.tpp-lp .tpp-section { padding: 112px 0; }
.tpp-lp .tpp-section-head { text-align: center; max-width: 760px; margin: 0 auto 72px; }
.tpp-lp .tpp-section-kicker { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 2.4px; text-transform: uppercase; color: var(--tpp-rose); margin-bottom: 18px; }
.tpp-lp .tpp-h2 { font-family: var(--tpp-font-display); font-size: clamp(34px, 4.2vw, 52px); font-weight: 600; color: var(--tpp-noir); line-height: 1.08; letter-spacing: -0.5px; margin: 0 0 20px; }
.tpp-lp .tpp-h2 em { background: linear-gradient(120deg, var(--tpp-rose) 0%, var(--tpp-crimson) 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; font-style: italic; font-weight: 600; }
.tpp-lp .tpp-section-head p { font-size: 17px; color: var(--tpp-text-muted); margin: 0; line-height: 1.6; }
.tpp-lp .tpp-h3 { font-family: var(--tpp-font-display); font-size: 28px; font-weight: 600; color: var(--tpp-noir); margin: 0 0 14px; line-height: 1.2; }
.tpp-lp .tpp-card-h-accent { color: var(--tpp-rose); font-style: italic; font-weight: 500; }
.tpp-lp .tpp-h3-large { font-family: var(--tpp-font-display); font-size: clamp(36px, 4.2vw, 54px); font-weight: 600; color: var(--tpp-noir); margin: 0 0 18px; line-height: 1.08; letter-spacing: -0.5px; padding: 4px 0 8px 0; }
.tpp-lp .tpp-h3-line-1, .tpp-lp .tpp-h3-line-2 { display: block; }
.tpp-lp .tpp-h3-line-2 { font-style: italic; background: linear-gradient(120deg, var(--tpp-rose) 0%, var(--tpp-crimson) 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; padding: 4px 16px 8px 0; margin-top: 4px; }
.tpp-lp .tpp-h3-large em { background: linear-gradient(120deg, var(--tpp-rose) 0%, var(--tpp-crimson) 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; font-style: italic; display: inline-block; padding-right: 12px; }
.tpp-lp .tpp-h4 { font-family: var(--tpp-font-body); font-size: 12px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: var(--tpp-rose); margin: 0 0 18px; }

.tpp-lp .tpp-types { background: var(--tpp-ivory); border-top: 1px solid var(--tpp-border); border-bottom: 1px solid var(--tpp-border); }
.tpp-lp .tpp-type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.tpp-lp .tpp-type-card { position: relative; display: block; background: var(--tpp-ivory); border: 1px solid var(--tpp-border); border-radius: var(--tpp-radius-lg); padding: 40px 32px 36px; transition: transform var(--tpp-dur-slow) var(--tpp-ease-out), box-shadow var(--tpp-dur-slow) var(--tpp-ease-out), border-color var(--tpp-dur-base) ease; overflow: hidden; }
.tpp-lp .tpp-card-shimmer { position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent 0%, rgba(233, 30, 99, 0.10) 50%, transparent 100%); transition: left var(--tpp-dur-slow) var(--tpp-ease-out); pointer-events: none; }
.tpp-lp .tpp-type-card:hover { transform: translateY(-10px); box-shadow: var(--tpp-shadow-lg); border-color: var(--tpp-border-rose); }
.tpp-lp .tpp-type-card:hover .tpp-card-shimmer { left: 130%; }

.tpp-lp .tpp-badge { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: var(--tpp-crimson); background: var(--tpp-blush-tint); border: 1px solid var(--tpp-border-rose); padding: 6px 14px; border-radius: 999px; margin-bottom: 22px; }
.tpp-lp .tpp-price { font-family: var(--tpp-font-display); font-weight: 600; color: var(--tpp-noir); margin: 14px 0 18px; line-height: 1.15; display: flex; align-items: baseline; gap: 2px; }
.tpp-lp .tpp-price-currency { font-size: 24px; color: var(--tpp-rose); transform: translateY(-12px); }
.tpp-lp .tpp-price-amount { font-size: 56px; line-height: 1.1; display: inline-block; padding-bottom: 4px; background: linear-gradient(135deg, var(--tpp-noir) 0%, var(--tpp-crimson) 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -1px; }
.tpp-lp .tpp-price small { font-family: var(--tpp-font-body); font-size: 13px; font-weight: 500; color: var(--tpp-text-muted); letter-spacing: 0.2px; margin-left: 6px; }
.tpp-lp .tpp-type-card p { color: var(--tpp-text-muted); font-size: 15px; margin: 0 0 28px; min-height: 70px; line-height: 1.6; }
.tpp-lp .tpp-arrow-link { display: inline-flex; align-items: center; gap: 8px; color: var(--tpp-crimson); font-weight: 600; font-size: 14px; letter-spacing: 0.3px; transition: color var(--tpp-dur-base) ease, gap var(--tpp-dur-base) var(--tpp-ease-out); }
.tpp-lp .tpp-type-card:hover .tpp-arrow-link { color: var(--tpp-rose); gap: 12px; }

.tpp-lp .tpp-how { background: var(--tpp-champagne); position: relative; }
.tpp-lp .tpp-how::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 10% 30%, rgba(233, 30, 99, 0.06), transparent 50%), radial-gradient(circle at 90% 70%, rgba(212, 165, 116, 0.10), transparent 50%); pointer-events: none; }
.tpp-lp .tpp-how .tpp-wrap { position: relative; }

.tpp-lp .tpp-phase-rail { display: grid; grid-template-columns: repeat(8, 1fr); gap: 16px; position: relative; padding-top: 8px; }
.tpp-lp .tpp-phase-line { position: absolute; top: 30px; left: 6%; width: 88%; height: 4px; z-index: 0; overflow: visible; }
.tpp-lp .tpp-phase-line line { stroke: url(#tpp-phase-grad); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 1100; stroke-dashoffset: 1100; transition: stroke-dashoffset 1800ms var(--tpp-ease-out); }
.tpp-lp .tpp-phase-rail.is-drawn .tpp-phase-line line { stroke-dashoffset: 0; }

.tpp-lp .tpp-phase { position: relative; z-index: 1; text-align: center; display: flex; flex-direction: column; align-items: center; }
.tpp-lp .tpp-num { width: 60px; height: 60px; border-radius: 50%; background: var(--tpp-ivory); border: 2px solid var(--tpp-crimson); color: var(--tpp-crimson); font-family: var(--tpp-font-display); font-size: 24px; font-weight: 600; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; box-shadow: var(--tpp-shadow-sm); transition: transform var(--tpp-dur-base) var(--tpp-ease-out), background var(--tpp-dur-base) ease, color var(--tpp-dur-base) ease, box-shadow var(--tpp-dur-base) ease; }
.tpp-lp .tpp-phase:hover .tpp-num { background: linear-gradient(135deg, var(--tpp-rose), var(--tpp-crimson)); color: var(--tpp-text-on-rose); border-color: transparent; transform: scale(1.12) translateY(-4px); box-shadow: var(--tpp-shadow-rose); }
.tpp-lp .tpp-label { font-size: 13px; font-weight: 600; color: var(--tpp-text); line-height: 1.35; letter-spacing: 0.2px; }

.tpp-lp .tpp-book { background: linear-gradient(180deg, var(--tpp-champagne) 0%, var(--tpp-champagne-deep) 100%); border-top: 1px solid var(--tpp-border); border-bottom: 1px solid var(--tpp-border); position: relative; overflow: hidden; }
.tpp-lp .tpp-form-card { position: relative; background: var(--tpp-ivory); border: 1px solid var(--tpp-border); border-radius: var(--tpp-radius-lg); padding: 64px 56px; box-shadow: var(--tpp-shadow-md); }
.tpp-lp .tpp-form-glow { position: absolute; width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(circle, var(--tpp-rose-glow) 0%, transparent 70%); top: 40px; right: 40px; pointer-events: none; filter: blur(60px); opacity: 0.85; z-index: 0; }
.tpp-lp .tpp-form-head, .tpp-lp .tpp-form-embed { position: relative; z-index: 1; }
.tpp-lp .tpp-form-head { text-align: center; margin-bottom: 40px; position: relative; }
.tpp-lp .tpp-sub { font-size: 16px; color: var(--tpp-text-muted); margin: 0; line-height: 1.6; }
.tpp-lp .tpp-form-embed { min-height: 1200px; position: relative; }
.tpp-lp .tpp-form-sd iframe {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 1200px !important;
  border: 0 !important;
  background: transparent !important;
}

.tpp-lp .tpp-form-badge { position: absolute; top: -16px; right: -28px; z-index: 5; width: 180px; padding: 12px 16px; background: linear-gradient(135deg, var(--tpp-rose) 0%, var(--tpp-crimson) 100%); display: flex; align-items: baseline; justify-content: center; gap: 8px; text-align: center; color: #FFFFFF !important; font-family: var(--tpp-font-display); line-height: 1; box-shadow: 0 14px 32px rgba(139, 21, 56, 0.32); transform: rotate(14deg); transform-origin: center center; animation: tpp-badge-wobble 5.5s var(--tpp-ease-in-out) infinite; pointer-events: none; clip-path: polygon( 0% 0%, 100% 0%, 93% 50%, 100% 100%, 0% 100%, 7% 50% ); }
.tpp-lp .tpp-form-badge::before { content: ""; position: absolute; top: 4px; bottom: 4px; left: 14px; right: 14px; border-top: 1px dashed rgba(255, 229, 236, 0.55); border-bottom: 1px dashed rgba(255, 229, 236, 0.55); pointer-events: none; }
.tpp-lp .tpp-form-badge-line-1 { font-size: 16px; font-weight: 500; font-style: italic; color: #FFFFFF !important; letter-spacing: 0.5px; text-transform: lowercase; opacity: 0.92; }
.tpp-lp .tpp-form-badge-line-2 { font-size: 24px; font-weight: 600; font-style: italic; color: #FFFFFF !important; letter-spacing: 0.6px; }
@keyframes tpp-badge-wobble { 0%, 100% { transform: rotate(14deg) translateY(0); } 25% { transform: rotate(11deg) translateY(-3px); } 50% { transform: rotate(16deg) translateY(0); } 75% { transform: rotate(12deg) translateY(-2px); } }

/* SD form embed is iframe — see SuiteDash form-theme settings in SD admin
   for in-iframe styling. Only the iframe wrapper is controllable from here. */

.tpp-lp .tpp-locations { background: var(--tpp-champagne); }
.tpp-lp .tpp-loc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; }
.tpp-lp .tpp-loc-card { background: var(--tpp-ivory); border: 1px solid var(--tpp-border); border-radius: var(--tpp-radius-lg); padding: 40px 36px; transition: transform var(--tpp-dur-base) var(--tpp-ease-out), box-shadow var(--tpp-dur-base) var(--tpp-ease-out); position: relative; overflow: hidden; }
.tpp-lp .tpp-loc-card::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg, var(--tpp-rose), var(--tpp-crimson), var(--tpp-gold-leaf)); transform: scaleX(0); transform-origin: left; transition: transform var(--tpp-dur-slow) var(--tpp-ease-out); }
.tpp-lp .tpp-loc-card:hover { transform: translateY(-6px); box-shadow: var(--tpp-shadow-md); }
.tpp-lp .tpp-loc-card:hover::before { transform: scaleX(1); }
.tpp-lp .tpp-pin { display: inline-flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: var(--tpp-rose); margin-bottom: 14px; }
.tpp-lp .tpp-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--tpp-rose); box-shadow: 0 0 0 4px rgba(233, 30, 99, 0.18); animation: tpp-dot-pulse 2.4s var(--tpp-ease-in-out) infinite; }
@keyframes tpp-dot-pulse { 0%, 100% { box-shadow: 0 0 0 4px rgba(233, 30, 99, 0.18); } 50% { box-shadow: 0 0 0 8px rgba(233, 30, 99, 0.05); } }
.tpp-lp .tpp-addr { font-size: 15px; color: var(--tpp-text); margin: 14px 0 10px; line-height: 1.6; }
.tpp-lp .tpp-phone { font-size: 14px; color: var(--tpp-text-muted); margin: 0 0 24px; }
.tpp-lp .tpp-book-here { display: inline-flex; align-items: center; gap: 8px; color: var(--tpp-crimson); font-weight: 600; font-size: 14px; transition: color var(--tpp-dur-base) ease, gap var(--tpp-dur-base) var(--tpp-ease-out); }
.tpp-lp .tpp-book-here:hover { color: var(--tpp-rose); gap: 12px; }

.tpp-lp .tpp-qr-strip { background: linear-gradient(135deg, var(--tpp-noir) 0%, var(--tpp-crimson-deep) 100%); color: var(--tpp-text-on-dark); padding: 96px 0; position: relative; overflow: hidden; }
.tpp-lp .tpp-qr-bg-glow { position: absolute; width: 720px; height: 720px; border-radius: 50%; background: radial-gradient(circle, rgba(233, 30, 99, 0.20) 0%, transparent 70%); top: -240px; left: -240px; pointer-events: none; filter: blur(60px); animation: tpp-bg-drift 22s var(--tpp-ease-in-out) infinite; }
@keyframes tpp-bg-drift { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(120px, 80px) scale(1.15); } }
.tpp-lp .tpp-qr-strip .tpp-wrap { position: relative; display: grid; grid-template-columns: 1.4fr 1fr; gap: 80px; align-items: center; }
.tpp-lp .tpp-qr-strip .tpp-h2-on-dark { color: #F5E6D3 !important; }
.tpp-lp .tpp-qr-strip .tpp-kicker-on-dark { color: #E8C088 !important; }
.tpp-lp .tpp-qr-strip .tpp-qr-copy p { color: rgba(245, 230, 211, 0.92) !important; }
.tpp-lp .tpp-qr-strip .tpp-qr-step { color: rgba(245, 230, 211, 0.92) !important; }
.tpp-lp .tpp-qr-strip .tpp-step-num { color: #FFFFFF !important; }
.tpp-lp .tpp-cta-strip .tpp-h2-on-dark { color: #F5E6D3 !important; }
.tpp-lp .tpp-cta-strip p { color: rgba(245, 230, 211, 0.85) !important; }

.tpp-lp .tpp-footer { color: rgba(245, 230, 211, 0.78) !important; }
.tpp-lp .tpp-footer .tpp-foot-brand { color: #F5E6D3 !important; }
.tpp-lp .tpp-footer .tpp-foot-brand-tag { color: var(--tpp-rose) !important; }
.tpp-lp .tpp-footer p { color: rgba(245, 230, 211, 0.78) !important; }
.tpp-lp .tpp-footer .tpp-h4 { color: #E8C088 !important; }
.tpp-lp .tpp-footer a, .tpp-lp .tpp-footer a:link, .tpp-lp .tpp-footer a:visited { color: rgba(245, 230, 211, 0.78) !important; }
.tpp-lp .tpp-footer a:hover, .tpp-lp .tpp-footer a:focus { color: var(--tpp-rose) !important; }
.tpp-lp .tpp-footer .tpp-contact-line { color: rgba(245, 230, 211, 0.78) !important; }
.tpp-lp .tpp-footer .tpp-contact-line strong { color: #E8C088 !important; }
.tpp-lp .tpp-footer .tpp-socials a, .tpp-lp .tpp-footer .tpp-socials a:link, .tpp-lp .tpp-footer .tpp-socials a:visited { color: #E8C088 !important; }
.tpp-lp .tpp-footer .tpp-socials a:hover { color: #FFFFFF !important; }
.tpp-lp .tpp-footer .tpp-copy-bar { color: rgba(245, 230, 211, 0.55) !important; }

.tpp-lp .tpp-kicker-on-dark { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 2.4px; text-transform: uppercase; color: var(--tpp-gold-bright); margin-bottom: 18px; }
.tpp-lp .tpp-h2-on-dark { font-family: var(--tpp-font-display); font-size: clamp(32px, 3.8vw, 46px); font-weight: 600; color: var(--tpp-text-on-dark); line-height: 1.15; margin: 0 0 22px; letter-spacing: -0.3px; }
.tpp-lp .tpp-qr-copy p { font-size: 16px; color: rgba(245, 230, 211, 0.80); margin: 0 0 32px; line-height: 1.6; }
.tpp-lp .tpp-qr-steps { display: flex; flex-direction: column; gap: 14px; }
.tpp-lp .tpp-qr-step { display: flex; align-items: center; gap: 16px; font-size: 15px; color: rgba(245, 230, 211, 0.92); }
.tpp-lp .tpp-step-num { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--tpp-rose), var(--tpp-crimson)); color: var(--tpp-text-on-rose); font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; justify-content: center; }

.tpp-lp .tpp-qr-card { perspective: 1200px; width: 320px; max-width: 100%; margin-left: auto; cursor: pointer; }
.tpp-lp .tpp-qr-card-inner { position: relative; width: 100%; height: 320px; aspect-ratio: 1; transform-style: preserve-3d; transition: transform 900ms var(--tpp-ease-out); }
.tpp-lp .tpp-qr-card.is-flipped .tpp-qr-card-inner { transform: rotateY(180deg); }
.tpp-lp .tpp-qr-card-front, .tpp-lp .tpp-qr-card-back { position: absolute; inset: 0; background: var(--tpp-ivory); border-radius: var(--tpp-radius-lg); padding: 28px; text-align: center; box-shadow: var(--tpp-shadow-lg); -webkit-backface-visibility: hidden; backface-visibility: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; }
.tpp-lp .tpp-qr-card-front img { width: 100%; max-width: 220px; height: auto; min-height: 180px; object-fit: contain; margin-bottom: 14px; display: block; }
.tpp-lp .tpp-qr-label { font-family: var(--tpp-font-display); font-size: 18px; font-weight: 600; color: var(--tpp-crimson); }
.tpp-lp .tpp-qr-card-back { transform: rotateY(180deg); background: linear-gradient(135deg, var(--tpp-rose) 0%, var(--tpp-crimson) 100%); color: var(--tpp-text-on-rose); gap: 10px; }
.tpp-lp .tpp-qr-back-mark { font-family: var(--tpp-font-display); font-size: 28px; font-weight: 600; line-height: 1.1; padding: 0 24px; }
.tpp-lp .tpp-qr-back-tag { font-size: 11px; font-weight: 700; letter-spacing: 2.4px; text-transform: uppercase; color: rgba(255, 255, 255, 0.85); }

.tpp-lp .tpp-cta-strip { background: var(--tpp-noir); color: var(--tpp-text-on-dark); padding: 96px 24px; text-align: center; position: relative; overflow: hidden; }
.tpp-lp .tpp-cta-glow { position: absolute; inset: 0; background: radial-gradient(circle at 20% 50%, rgba(233, 30, 99, 0.18) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 21, 56, 0.30) 0%, transparent 50%); pointer-events: none; }
.tpp-lp .tpp-cta-strip .tpp-wrap { position: relative; }
.tpp-lp .tpp-cta-strip .tpp-h2-on-dark { max-width: 760px; margin: 0 auto 18px; }
.tpp-lp .tpp-cta-strip p { font-size: 17px; color: rgba(245, 230, 211, 0.78); max-width: 620px; margin: 0 auto 36px; line-height: 1.6; }
.tpp-lp .tpp-cta-btn { background: linear-gradient(135deg, var(--tpp-rose), var(--tpp-gold-bright)); }
.tpp-lp .tpp-cta-btn:hover { background: linear-gradient(135deg, var(--tpp-rose-deep), var(--tpp-rose)); }

.tpp-lp .tpp-footer { background: var(--tpp-crimson-deep); color: rgba(245, 230, 211, 0.78); padding: 72px 0 0; font-size: 14px; }
.tpp-lp .tpp-footer .tpp-wrap { display: grid; grid-template-columns: 1.6fr 1fr 1.2fr 1fr; gap: 48px; padding-bottom: 56px; }
.tpp-lp .tpp-foot-brand { font-family: var(--tpp-font-display); font-size: 26px; font-weight: 600; color: var(--tpp-text-on-dark); margin-bottom: 16px; line-height: 1.1; }
.tpp-lp .tpp-foot-brand-tag { font-family: var(--tpp-font-body); display: block; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.8px; color: var(--tpp-rose); margin-top: 6px; }
.tpp-lp .tpp-footer p { margin: 0 0 16px; line-height: 1.6; }
.tpp-lp .tpp-footer .tpp-h4 { color: var(--tpp-gold-bright); margin-bottom: 20px; }
.tpp-lp .tpp-footer a { display: block; color: rgba(245, 230, 211, 0.78); margin-bottom: 12px; transition: color var(--tpp-dur-fast) ease, transform var(--tpp-dur-fast) ease; position: relative; }
.tpp-lp .tpp-footer a:hover { color: var(--tpp-rose); transform: translateX(4px); }
.tpp-lp .tpp-contact-line { margin: 0 0 18px; line-height: 1.55; }
.tpp-lp .tpp-contact-line strong { display: block; font-size: 10px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; color: var(--tpp-gold-bright); margin-bottom: 4px; }
.tpp-lp .tpp-socials { display: flex; gap: 12px; }
.tpp-lp .tpp-socials a { width: 42px; height: 42px; border-radius: 50%; background: rgba(212, 165, 116, 0.14); color: var(--tpp-gold-bright); display: inline-flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; margin: 0; border: 1px solid rgba(212, 165, 116, 0.20); transition: background var(--tpp-dur-base) ease, color var(--tpp-dur-base) ease, border-color var(--tpp-dur-base) ease, transform var(--tpp-dur-base) var(--tpp-ease-out); }
.tpp-lp .tpp-socials a:hover { background: var(--tpp-rose); color: var(--tpp-text-on-rose); border-color: var(--tpp-rose); transform: translateY(-3px); }
.tpp-lp .tpp-copy-bar { border-top: 1px solid rgba(212, 165, 116, 0.16); padding: 24px 24px; text-align: center; font-size: 12px; color: rgba(245, 230, 211, 0.55); letter-spacing: 0.4px; }

.tpp-lp.tpp-js .tpp-reveal { opacity: 0; transform: translateY(28px); transition: opacity var(--tpp-dur-reveal) var(--tpp-ease-out), transform var(--tpp-dur-reveal) var(--tpp-ease-out); will-change: opacity, transform; }
.tpp-lp.tpp-js .tpp-reveal.tpp-in { opacity: 1; transform: translateY(0); }
.tpp-lp .tpp-delay-1 { transition-delay: 100ms; }
.tpp-lp .tpp-delay-2 { transition-delay: 200ms; }
.tpp-lp .tpp-delay-3 { transition-delay: 300ms; }
.tpp-lp .tpp-delay-4 { transition-delay: 400ms; }
.tpp-lp .tpp-delay-5 { transition-delay: 500ms; }
.tpp-lp .tpp-delay-6 { transition-delay: 600ms; }
.tpp-lp .tpp-delay-7 { transition-delay: 700ms; }

.tpp-lp.tpp-js .tpp-stagger { opacity: 0; transform: translateY(24px); transition: opacity var(--tpp-dur-reveal) var(--tpp-ease-out), transform var(--tpp-dur-reveal) var(--tpp-ease-out); }
.tpp-lp.tpp-js.tpp-loaded .tpp-stagger { opacity: 1; transform: translateY(0); }
.tpp-lp.tpp-js.tpp-loaded .tpp-hero-kicker { transition-delay: 100ms; }
.tpp-lp.tpp-js.tpp-loaded .tpp-h1 .tpp-stagger:nth-of-type(1) { transition-delay: 220ms; }
.tpp-lp.tpp-js.tpp-loaded .tpp-h1 .tpp-stagger:nth-of-type(2) { transition-delay: 360ms; }
.tpp-lp.tpp-js.tpp-loaded .tpp-lede { transition-delay: 520ms; }
.tpp-lp.tpp-js.tpp-loaded .tpp-hero-ctas { transition-delay: 660ms; }
.tpp-lp.tpp-js.tpp-loaded .tpp-hero-trust { transition-delay: 800ms; }

@media (max-width: 960px) {
  .tpp-lp .tpp-hero { padding: 72px 0 80px; }
  .tpp-lp .tpp-hero .tpp-wrap { grid-template-columns: 1fr; gap: 48px; }
  .tpp-lp .tpp-hero-photo { order: -1; max-width: 380px; margin: 0 auto; }
  .tpp-lp .tpp-hero-scroll { display: none; }
  .tpp-lp .tpp-section { padding: 80px 0; }
  .tpp-lp .tpp-stats .tpp-wrap { grid-template-columns: repeat(2, 1fr); gap: 40px; }
  .tpp-lp .tpp-stat:nth-child(2)::after { display: none; }
  .tpp-lp .tpp-type-grid { grid-template-columns: 1fr; }
  .tpp-lp .tpp-phase-rail { grid-template-columns: repeat(4, 1fr); row-gap: 32px; }
  .tpp-lp .tpp-phase-line { display: none; }
  .tpp-lp .tpp-form-card { padding: 44px 28px; }
  .tpp-lp .tpp-loc-grid { grid-template-columns: 1fr; }
  .tpp-lp .tpp-qr-strip .tpp-wrap { grid-template-columns: 1fr; gap: 48px; }
  .tpp-lp .tpp-qr-card { margin: 0 auto; }
  .tpp-lp .tpp-footer .tpp-wrap { grid-template-columns: 1fr 1fr; gap: 36px; }
}
@media (max-width: 560px) {
  .tpp-lp .tpp-h1 { font-size: 40px; }
  .tpp-lp .tpp-h2 { font-size: 32px; }
  .tpp-lp .tpp-hero-ctas { flex-direction: column; align-items: stretch; }
  .tpp-lp .tpp-btn-primary, .tpp-lp .tpp-btn-secondary { justify-content: center; }
  .tpp-lp .tpp-stats .tpp-wrap { grid-template-columns: 1fr; gap: 32px; }
  .tpp-lp .tpp-stat::after { display: none !important; }
  .tpp-lp .tpp-phase-rail { grid-template-columns: repeat(2, 1fr); }
  .tpp-lp .tpp-footer .tpp-wrap { grid-template-columns: 1fr; }
  .tpp-lp .tpp-form-badge { width: 130px; padding: 9px 12px; top: 18px; right: 12px; }
  .tpp-lp .tpp-form-badge-line-1 { font-size: 12px; }
  .tpp-lp .tpp-form-badge-line-2 { font-size: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .tpp-lp .tpp-hero-breath, .tpp-lp .tpp-photo-glow, .tpp-lp .tpp-qr-bg-glow, .tpp-lp .tpp-dot, .tpp-lp .tpp-scroll-line { animation: none !important; }
  .tpp-lp.tpp-js .tpp-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  .tpp-lp.tpp-js .tpp-stagger { opacity: 1 !important; transform: none !important; transition: none !important; }
  .tpp-lp .tpp-phase-line line { stroke-dashoffset: 0 !important; transition: none !important; }
  .tpp-lp .tpp-btn-primary::before, .tpp-lp .tpp-card-shimmer { display: none; }
  .tpp-lp .tpp-btn-primary, .tpp-lp .tpp-form-badge { animation: none !important; }
}
`
