'use client';
import type { CSSProperties } from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getTemplatesWithFallback, getSession, voteTemplate, Template } from '@/lib/api';
import { getPriceForSlug } from '@/lib/pricing';

const CATEGORIES = ['All', 'Available', 'health', 'finance', 'legal', 'food/bev', 'creative', 'services', 'other'];

const SECTION = 'relative py-20 px-6';
const SECTION_INNER = 'max-w-[1280px] mx-auto relative z-10';
const SECTION_TITLE = 'font-sora text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-center mb-12 text-white -tracking-[0.5px]';

function normalizedStatus(status: Template['status'] | undefined | null): 'available' | 'auction' | 'sold' {
  if (status === 'sold' || status === 'auction' || status === 'available') return status;
  return 'available';
}

function statusClasses(status: string) {
  if (status === 'available') return 'bg-[rgba(34,197,94,0.12)] text-[var(--color-success)] border border-[rgba(34,197,94,0.3)]';
  if (status === 'auction') return 'bg-[rgba(255,229,52,0.12)] text-neon-yellow border border-[rgba(255,229,52,0.4)]';
  return 'bg-white/[0.06] text-white/40 border border-white/10';
}

export default function HomePage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState<'votes' | 'newest' | 'price'>('votes');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [session, setSession] = useState<{ account_id: string } | null>(null);

  const [searchRaw, setSearchRaw] = useState('');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);
  const prevVisibleCount = useRef(24);

  useEffect(() => {
    loadTemplates();
    getSession().then(setSession).catch(() => {});
  }, []);

  function loadTemplates() {
    setLoading(true);
    setLoadError(false);
    getTemplatesWithFallback()
      .then(list => setTemplates(list))
      .catch(() => {
        setTemplates([]);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchRaw.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [searchRaw]);

  const filtered = useMemo(() => {
    return templates
      .filter(t => {
        if (filter === 'All') return true;
        if (filter === 'Available') return normalizedStatus(t.status) === 'available';
        return t.category === filter;
      })
      .filter(t => {
        if (!search) return true;
        return (
          t.title.toLowerCase().includes(search) ||
          (t.category || '').toLowerCase().includes(search)
        );
      })
      .sort((a, b) => {
        if (sort === 'votes') return (b.vote_count ?? 0) - (a.vote_count ?? 0);
        if (sort === 'price') return getPriceForSlug(a.slug) - getPriceForSlug(b.slug);
        return 0;
      });
  }, [templates, filter, search, sort]);

  useEffect(() => {
    prevVisibleCount.current = 24;
    setVisibleCount(24);
  }, [filter, search, sort]);

  const visibleTemplates = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  const featured = useMemo(() => {
    return [...templates]
      .filter(t => normalizedStatus(t.status) !== 'sold')
      .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
      .slice(0, 8);
  }, [templates]);

  async function handleVote(slug: string) {
    if (!session) {
      router.push('/sign-in?redirect=/');
      return;
    }
    try {
      const res = await voteTemplate(slug);
      setTemplates(prev => prev.map(t => t.slug === slug ? { ...t, vote_count: res.vote_count } : t));
    } catch {}
  }

  return (
    <div className="min-h-screen">
      {/* HERO — Vegas/lotto neon aesthetic */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-6" id="hero">
        {/* Bokeh floating orbs (multi-color) */}
        <div className="bokeh hidden md:block" style={{ top: '10%', left: '8%', width: '280px', height: '280px', background: 'radial-gradient(circle, #00D4FF, transparent 70%)', animationDelay: '0s' }} />
        <div className="bokeh hidden md:block" style={{ top: '55%', left: '70%', width: '320px', height: '320px', background: 'radial-gradient(circle, #FF2D8A, transparent 70%)', animationDelay: '2s' }} />
        <div className="bokeh hidden md:block" style={{ top: '70%', left: '15%', width: '220px', height: '220px', background: 'radial-gradient(circle, #FFE534, transparent 70%)', animationDelay: '4s' }} />
        <div className="bokeh hidden md:block" style={{ top: '5%', left: '75%', width: '240px', height: '240px', background: 'radial-gradient(circle, #00F0D0, transparent 70%)', animationDelay: '6s' }} />

        {/* Light beam behind headline */}
        <div className="light-beam" aria-hidden="true" />

        {/* Lotto ball orbs (decorative, hidden on mobile) */}
        <span className="lotto-ball hidden md:flex" style={{ top: '18%', left: '12%', width: '48px', height: '48px', fontSize: '1rem', color: '#00D4FF', animationDelay: '0s' }} aria-hidden="true">7</span>
        <span className="lotto-ball hidden md:flex" style={{ top: '72%', left: '8%', width: '56px', height: '56px', fontSize: '1.1rem', color: '#FFE534', animationDelay: '0.6s' }} aria-hidden="true">21</span>
        <span className="lotto-ball hidden md:flex" style={{ top: '24%', left: '82%', width: '52px', height: '52px', fontSize: '1.05rem', color: '#FF2D8A', animationDelay: '1.2s' }} aria-hidden="true">13</span>
        <span className="lotto-ball hidden md:flex" style={{ top: '65%', left: '85%', width: '44px', height: '44px', fontSize: '0.95rem', color: '#00F0D0', animationDelay: '1.8s' }} aria-hidden="true">3</span>
        <span className="lotto-ball hidden md:flex" style={{ top: '45%', left: '6%', width: '40px', height: '40px', fontSize: '0.9rem', color: '#a855f7', animationDelay: '2.4s' }} aria-hidden="true">42</span>
        <span className="lotto-ball hidden md:flex" style={{ top: '12%', left: '50%', width: '38px', height: '38px', fontSize: '0.85rem', color: '#00D4FF', animationDelay: '3s' }} aria-hidden="true">9</span>
        <span className="lotto-ball hidden md:flex" style={{ top: '80%', left: '55%', width: '42px', height: '42px', fontSize: '0.9rem', color: '#FFE534', animationDelay: '3.6s' }} aria-hidden="true">17</span>

        <div className="relative z-10 text-center max-w-[820px]">
          <h1 className="font-sora text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[1.05] text-white glow-blue mb-4 -tracking-[2px]">
            Website Lotto
          </h1>
          <p className="font-sora text-[clamp(1.2rem,3vw,1.8rem)] font-semibold text-neon-yellow glow-yellow mb-5">
            Don&apos;t gamble on your website design.
          </p>
          <p className="text-[1.05rem] text-white/70 leading-[1.7] max-w-[600px] mx-auto mb-8">
            Browse 210+ professional websites and buy the one that fits your business. One-time payment, 12 months hosting included, Cloudflare-backed security. Plug in your Stripe link and start selling in minutes.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <span className="px-4 py-1.5 rounded-full text-[0.82rem] font-bold text-neon-blue bg-[rgba(0,212,255,0.08)] neon-border">
              $99/mo after year 1
            </span>
            <span className="px-4 py-1.5 rounded-full text-[0.82rem] font-bold text-neon-yellow bg-[rgba(255,229,52,0.08)] neon-border-yellow">
              Easy to transfer
            </span>
            <span className="px-4 py-1.5 rounded-full text-[0.82rem] font-bold text-neon-cyan bg-[rgba(0,240,208,0.08)] neon-border-cyan">
              Cloudflare-backed security
            </span>
          </div>
          <div className="flex flex-wrap gap-3.5 justify-center">
            <a
              href="#sites"
              className="inline-block px-8 py-3.5 bg-neon-yellow text-[#07070A] font-extrabold text-[0.95rem] rounded-lg no-underline cursor-pointer transition-all btn-glow-yellow hover:-translate-y-0.5"
            >
              See templates →
            </a>
            <Link
              href="#how"
              className="inline-block px-8 py-3.5 bg-[rgba(0,212,255,0.06)] text-neon-blue font-bold text-[0.95rem] rounded-lg no-underline cursor-pointer transition-all neon-border hover:-translate-y-0.5"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      <div className="neon-line" />

      {/* HOW IT WORKS */}
      <section className={SECTION} id="how">
        <div className={SECTION_INNER}>
          <h2 className={SECTION_TITLE}>
            <span className="glow-blue">How It Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '1', t: 'Pick a site', d: 'Browse 210+ templates and choose one that fits your business.', color: 'blue' },
              { n: '2', t: 'Connect payments', d: 'Plug in your Stripe account or payment link. Done.', color: 'yellow' },
              { n: '3', t: 'Launch & sell', d: 'Your site is live on a branded subdomain. Start making money.', color: 'magenta' },
            ].map((s, i) => {
              const borderCls = s.color === 'blue' ? 'neon-border' : s.color === 'yellow' ? 'neon-border-yellow' : 'neon-border-magenta';
              const animCls = i === 0 ? 'anim-float' : i === 1 ? 'anim-dance' : 'anim-sway';
              const textCls = s.color === 'blue' ? 'text-neon-blue' : s.color === 'yellow' ? 'text-neon-yellow' : 'text-neon-magenta';
              return (
                <div
                  key={s.n}
                  className={`glass-card rounded-2xl p-8 transition-transform ${borderCls} ${animCls}`}
                >
                  <span className={`inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/[0.05] border ${textCls} font-extrabold text-lg mb-4`}>
                    {s.n}
                  </span>
                  <h3 className={`font-sora text-[1.15rem] font-bold mb-2.5 ${textCls}`}>{s.t}</h3>
                  <p className="text-white/65 text-[0.92rem] leading-relaxed">{s.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="neon-line" />

      {/* TEMPLATE GALLERY */}
      <section className={SECTION} id="sites">
        <div className={SECTION_INNER}>
          <h2 className={SECTION_TITLE}>
            <span className="glow-yellow text-neon-yellow">Template Library</span>
          </h2>

          {featured.length > 0 && (
            <FeaturedCarousel templates={featured} onVote={handleVote} />
          )}

          <div className="mb-4">
            <label className="relative block">
              <span className="sr-only">Search templates</span>
              <input
                type="search"
                value={searchRaw}
                onChange={e => setSearchRaw(e.target.value)}
                placeholder="Search templates by name or category…"
                className="w-full rounded-xl border border-glassBorder bg-glass px-4 py-3 text-[0.9rem] text-white placeholder:text-white/35 outline-none transition-colors focus:border-neon-blue/70 focus:shadow-[0_0_20px_rgba(0,212,255,0.25)]"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map(cat => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  className={`px-4 py-[7px] rounded-full text-[0.85rem] cursor-pointer transition-all border ${
                    active
                      ? 'category-filter-active'
                      : 'border-white/[0.12] bg-transparent text-white/60 hover:border-neon-blue/50 hover:text-neon-blue'
                  }`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4 mb-8 text-white/50 text-[0.85rem] flex-wrap">
            <div className="flex items-center gap-2">
              <span>Sort:</span>
              {(['votes', 'newest', 'price'] as const).map(s => {
                const active = sort === s;
                return (
                  <button
                    key={s}
                    className={`px-3.5 py-[5px] rounded-md text-[0.82rem] cursor-pointer transition-all border ${
                      active
                        ? 'bg-[rgba(0,212,255,0.12)] border-neon-blue/60 text-neon-blue'
                        : 'border-white/10 bg-transparent text-white/55 hover:border-neon-blue/40 hover:text-neon-blue'
                    }`}
                    onClick={() => setSort(s)}
                  >
                    {s === 'votes' ? 'Most Voted' : s === 'newest' ? 'Newest' : 'Price'}
                  </button>
                );
              })}
            </div>
            <div className="text-[0.8rem] text-white/40">
              {loading ? '' : `${filtered.length} template${filtered.length === 1 ? '' : 's'}`}
            </div>
          </div>

          {loading ? (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-[14px] border border-glassBorder bg-glass overflow-hidden"
                >
                  <div className="aspect-[16/9] bg-white/[0.04]" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-16 rounded bg-white/[0.06]" />
                    <div className="h-4 w-3/4 rounded bg-white/[0.06]" />
                    <div className="h-3 w-1/2 rounded bg-white/[0.06]" />
                  </div>
                </div>
              ))}
            </div>
          ) : loadError ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-8 text-center">
              <p className="text-amber-200 font-medium">Couldn&apos;t load templates. Try refreshing.</p>
              <button
                type="button"
                onClick={loadTemplates}
                className="mt-4 inline-flex rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-100 hover:bg-amber-400/20"
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-glassBorder bg-glass p-10 text-center">
              <p className="text-white/70">No templates match your search.</p>
              <button
                type="button"
                onClick={() => { setSearchRaw(''); setFilter('All'); }}
                className="mt-4 inline-flex rounded-lg border border-neon-blue/40 bg-[rgba(0,212,255,0.08)] px-4 py-2 text-sm font-medium text-neon-blue hover:bg-[rgba(0,212,255,0.16)]"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleTemplates.map((t, i) => (
                  <TemplateCard
                    key={t.slug}
                    t={t}
                    onVote={handleVote}
                    fadeIn={i >= prevVisibleCount.current}
                    fadeDelayMs={(i - prevVisibleCount.current) * 30}
                  />
                ))}
              </div>
              {visibleCount < filtered.length && (
                <div className="flex flex-col items-center gap-3 py-12">
                  <button
                    type="button"
                    onClick={() => {
                      prevVisibleCount.current = visibleCount;
                      setVisibleCount(prev => Math.min(prev + 24, filtered.length));
                    }}
                    className="group flex flex-col items-center gap-2 text-center transition-transform hover:scale-105 active:scale-95"
                  >
                    <span className="text-sm font-semibold text-neon-yellow tracking-wide uppercase">
                      Load More Templates
                    </span>
                    <span className="text-xs text-white/50">
                      Showing {visibleTemplates.length} of {filtered.length}
                    </span>
                    <div className="mt-2 flex h-12 w-12 items-center justify-center rounded-full border border-neon-yellow/40 bg-neon-yellow/10 cta-glow-pulse">
                      <svg
                        width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="text-neon-yellow animate-bounce-slow"
                        aria-hidden
                      >
                        <path d="M12 5v14" />
                        <path d="m19 12-7 7-7-7" />
                      </svg>
                    </div>
                  </button>
                  {visibleCount >= 96 && visibleCount < filtered.length && (
                    <button
                      type="button"
                      onClick={() => {
                        prevVisibleCount.current = visibleCount;
                        setVisibleCount(filtered.length);
                      }}
                      className="mt-2 text-xs text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors"
                    >
                      Show all {filtered.length} templates
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <div className="neon-line" />

      {/* FEATURES */}
      <section className={SECTION} id="features">
        <div className={SECTION_INNER}>
          <h2 className={SECTION_TITLE}>
            <span className="glow-magenta text-neon-magenta">What&apos;s Included</span>
          </h2>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: '⚡', title: 'High-converting layout', desc: 'Professionally designed templates built to convert visitors into customers.', color: 'blue' },
              { icon: '🌐', title: 'Branded subdomain', desc: 'Your site lives on a memorable .virtuallaunch.pro subdomain.', color: 'yellow' },
              { icon: '💳', title: 'Stripe-ready', desc: 'Plug in your Stripe link or payment button in seconds.', color: 'magenta' },
              { icon: '🔒', title: 'Cloudflare security', desc: 'DDoS protection, SSL, and global CDN included.', color: 'cyan' },
              { icon: '✏️', title: 'Easy customization', desc: 'Edit your content, brand colors, and contact info from the dashboard.', color: 'blue' },
              { icon: '🎫', title: 'Scratch to Win', desc: 'Win a free template, discounts, or credits with our scratch ticket mechanic.', color: 'yellow' },
            ].map((f, i) => {
              const borderCls = f.color === 'blue' ? 'neon-border' : f.color === 'yellow' ? 'neon-border-yellow' : f.color === 'magenta' ? 'neon-border-magenta' : 'neon-border-cyan';
              const animCls = i % 3 === 0 ? 'anim-float' : i % 3 === 1 ? 'anim-sway' : 'anim-dance';
              return (
                <div
                  key={f.title}
                  className={`glass-card rounded-[14px] p-7 ${borderCls} ${animCls}`}
                >
                  <span className="block text-[2rem] mb-3.5 anim-icon-bounce">{f.icon}</span>
                  <h3 className="font-sora text-base font-bold mb-2 text-white">{f.title}</h3>
                  <p className="text-white/60 text-[0.88rem] leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="neon-line" />

      {/* PRICING */}
      <section className={SECTION} id="pricing">
        <div className={SECTION_INNER}>
          <h2 className={SECTION_TITLE}>
            <span className="glow-yellow text-neon-yellow">Pricing</span>
          </h2>
          <div className="grid gap-6 max-w-[960px] mx-auto md:grid-cols-3 grid-cols-1">
            <PricingBox
              price="$249"
              suffix=" one-time"
              label="Standard Site"
              features={[
                'Professional website template',
                'Lifestyle, hobby, food, beauty, entertainment & sports niches',
                '12 months hosting included',
                'Branded subdomain',
                'Cloudflare CDN + SSL',
                'Mobile responsive',
              ]}
              ctaText="Browse Standard Sites"
              variant="blue"
            />
            <PricingBox
              price="$399"
              suffix=" one-time"
              label="Premium Site"
              badge="Most Popular"
              features={[
                'Niche-specific professional website',
                'Tax, legal, services, real estate & tech niches',
                '12 months hosting included',
                'Branded subdomain',
                'Cloudflare CDN + SSL',
                'Mobile responsive',
              ]}
              ctaText="Browse Premium Sites"
              variant="yellow"
            />
            <PricingBox
              price="$14"
              suffix="/mo"
              label="After Year 1"
              features={[
                'Standard hosting: $14/mo',
                'Premium hosting: $49/mo',
                'Premium includes content updates',
                'Premium includes SEO',
                'Premium includes priority support',
              ]}
              boldLast="First 12 months included with purchase"
              ctaText="See Templates"
              variant="magenta"
            />
          </div>
        </div>
      </section>

      <div className="neon-line" />

      {/* FAQ */}
      <section className={SECTION} id="faq">
        <div className={SECTION_INNER}>
          <h2 className={SECTION_TITLE}>
            <span className="glow-blue">FAQ</span>
          </h2>
          <div className="max-w-[720px] mx-auto flex flex-col gap-3">
            {[
              { q: 'Is this a subscription?', a: 'No. You pay one time ($249 standard or $399 premium) and own the site. Hosting for the first 12 months is included.' },
              { q: 'What happens after 12 months?', a: 'Continue with standard hosting at $14/mo or upgrade to premium hosting at $49/mo (includes content updates, SEO, and priority support).' },
              { q: 'What is the difference between standard and premium?', a: 'Premium sites cover higher-value niches (tax, legal, services, real estate, tech). Standard sites cover lifestyle, hobby, food, beauty, entertainment, and sports.' },
              { q: 'What happens when a template is sold?', a: 'It is marked Sold and removed from the available pool. The buyer has exclusive use.' },
              { q: 'Can I use my own domain?', a: 'Your site runs on a .virtuallaunch.pro subdomain. Custom domain support is coming soon.' },
            ].map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className={SECTION} id="cta">
        <div className={SECTION_INNER}>
          <div className="text-center max-w-[640px] mx-auto flex flex-col items-center gap-5 py-12 px-6 glass-card rounded-[20px] neon-border">
            <h2 className="font-sora text-[clamp(1.4rem,3vw,2rem)] font-bold text-white -tracking-[0.5px] leading-tight glow-blue">
              210+ professional websites. Ready to launch.
            </h2>
            <p className="text-base text-white/65 leading-[1.7] max-w-[520px]">
              Skip the agency. Get a designer-quality website for your practice or business — one-time payment, 12 months hosting included.
            </p>
            <a
              href="#sites"
              className="inline-block px-8 py-3.5 bg-neon-yellow text-[#07070A] font-extrabold text-[0.95rem] rounded-lg no-underline cursor-pointer transition-all btn-glow-yellow hover:-translate-y-0.5"
            >
              Browse templates →
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

interface PricingBoxProps {
  price: string;
  suffix: string;
  label: string;
  badge?: string;
  features: string[];
  boldLast?: string;
  ctaText: string;
  variant: 'blue' | 'yellow' | 'magenta';
}

function PricingBox({ price, suffix, label, badge, features, boldLast, ctaText, variant }: PricingBoxProps) {
  const borderCls = variant === 'blue' ? 'neon-border' : variant === 'yellow' ? 'neon-border-yellow' : 'neon-border-magenta';
  const textCls = variant === 'blue' ? 'text-neon-blue' : variant === 'yellow' ? 'text-neon-yellow' : 'text-neon-magenta';
  const glowCls = variant === 'blue' ? 'glow-blue' : variant === 'yellow' ? 'glow-yellow' : 'glow-magenta';
  const btnCls =
    variant === 'yellow'
      ? 'bg-neon-yellow text-[#07070A] btn-glow-yellow'
      : variant === 'blue'
      ? 'bg-[rgba(0,212,255,0.08)] text-neon-blue neon-border'
      : 'bg-[rgba(255,45,138,0.08)] text-neon-magenta neon-border-magenta';
  const animCls = variant === 'yellow' ? 'anim-wobble' : variant === 'blue' ? 'anim-float' : 'anim-sway';

  return (
    <div className={`relative glass-card rounded-[18px] p-8 flex flex-col gap-4 ${borderCls} ${animCls}`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neon-yellow text-[#07070A] text-[0.72rem] font-extrabold px-3.5 py-[4px] rounded-full whitespace-nowrap btn-glow-yellow">
          {badge}
        </div>
      )}
      <div className={`font-sora text-[2.4rem] font-extrabold text-white leading-none ${glowCls}`}>
        {price}<span className="text-base font-normal text-white/50">{suffix}</span>
      </div>
      <div className={`text-[0.85rem] font-bold uppercase tracking-wider ${textCls}`}>{label}</div>
      <ul className="list-none flex flex-col gap-2 flex-1">
        {features.map(f => (
          <li
            key={f}
            className={`text-[0.88rem] text-white/70 pl-[18px] relative before:content-['✓'] before:absolute before:left-0 ${textCls} before:font-bold`}
          >
            <span className="text-white/70">{f}</span>
          </li>
        ))}
        {boldLast && (
          <li className={`text-[0.88rem] pl-[18px] relative before:content-['✓'] before:absolute before:left-0 ${textCls} before:font-bold`}>
            <strong className="text-white/85">{boldLast}</strong>
          </li>
        )}
      </ul>
      <a
        href="#sites"
        className={`inline-block text-center px-6 py-3 font-extrabold text-[0.9rem] rounded-lg no-underline cursor-pointer transition-all hover:-translate-y-0.5 ${btnCls}`}
      >
        {ctaText}
      </a>
    </div>
  );
}

function TemplateCard({ t, onVote, fadeIn, fadeDelayMs }: { t: Template; onVote: (slug: string) => void; fadeIn?: boolean; fadeDelayMs?: number }) {
  const status = normalizedStatus(t.status);
  const voteCount = t.vote_count ?? 0;
  const bidCount = t.bid_count ?? 0;
  const highBid = t.high_bid ?? t.current_bid ?? null;
  const fadeStyle: CSSProperties | undefined = fadeIn
    ? { animation: `cardFadeIn 0.4s ease-out ${Math.max(0, fadeDelayMs ?? 0)}ms both` }
    : undefined;

  return (
    <div style={fadeStyle} className="group glass-card card-glow rounded-[14px] overflow-hidden flex flex-col hover:border-neon-blue/50">
      <Link
        href={`/sites/${t.slug}`}
        className="block aspect-[16/9] bg-gradient-to-br from-[rgba(0,212,255,0.06)] to-[rgba(255,45,138,0.04)] overflow-hidden relative no-underline"
      >
        {t.thumbnail_url ? (
          <Image
            src={t.thumbnail_url}
            alt={t.title}
            fill
            unoptimized
            sizes="(max-width: 540px) 100vw, (max-width: 860px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-[2.5rem]">🌐</span>
        )}
        {status === 'sold' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-[0.75rem] font-bold uppercase tracking-widest text-white/80">
              Sold
            </span>
          </div>
        )}
      </Link>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <div className={`inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold tracking-wide w-fit ${statusClasses(status)}`}>
          {status === 'available' ? 'Available' : status === 'auction' ? 'Auction' : 'Sold'}
        </div>
        <div className="font-sora text-[0.9rem] font-semibold text-white leading-snug">{t.title}</div>
        <div className="text-[0.75rem] text-white/40 uppercase tracking-wider">{t.category}</div>
        <div className="font-sora text-[1.1rem] font-extrabold text-neon-blue glow-blue mt-1">
          ${getPriceForSlug(t.slug)}
        </div>
        {status === 'auction' && highBid != null && (
          <div className="text-[0.8rem] text-neon-yellow font-medium">High bid: ${highBid}</div>
        )}
        <div className="flex items-center gap-3 text-[0.72rem] text-white/50">
          <span className="inline-flex items-center gap-1">
            <span className="text-neon-magenta">♥</span>
            {voteCount} vote{voteCount === 1 ? '' : 's'}
          </span>
          {bidCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <span className="text-neon-yellow">⚖</span>
              {bidCount} bid{bidCount === 1 ? '' : 's'}
            </span>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap mt-auto pt-2">
          {status === 'sold' ? (
            <span className="inline-block px-3 py-[5px] rounded-md text-[0.75rem] font-semibold text-white/[0.35] bg-white/[0.04] border border-white/[0.08]">
              Sold
            </span>
          ) : (
            <>
              {status === 'available' && (
                <Link
                  href={`/sites/${t.slug}`}
                  className="inline-block px-3 py-[5px] rounded-md text-[0.75rem] font-bold no-underline border border-neon-blue/40 text-neon-blue bg-[rgba(0,212,255,0.06)] cursor-pointer transition-all hover:bg-[rgba(0,212,255,0.14)] hover:border-neon-blue"
                >
                  Buy Now — ${getPriceForSlug(t.slug)}
                </Link>
              )}
              <Link
                href={`/sites/${t.slug}`}
                className="inline-block px-3 py-[5px] rounded-md text-[0.75rem] font-bold no-underline border border-neon-yellow/40 text-neon-yellow bg-[rgba(255,229,52,0.06)] cursor-pointer transition-all hover:bg-[rgba(255,229,52,0.14)] hover:border-neon-yellow"
              >
                {status === 'auction' ? `Bid${highBid ? ` $${highBid}` : ''}` : 'Place Bid'}
              </Link>
              <button
                className="inline-block px-3 py-[5px] rounded-md text-[0.75rem] font-bold border border-neon-magenta/40 text-neon-magenta bg-[rgba(255,45,138,0.06)] cursor-pointer transition-all hover:bg-[rgba(255,45,138,0.14)] hover:border-neon-magenta"
                onClick={() => onVote(t.slug)}
              >
                ♥ Vote
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FeaturedCarousel({
  templates,
  onVote,
}: {
  templates: Template[];
  onVote: (slug: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (paused || templates.length <= 1) return;
    const id = setInterval(() => {
      setIndex(i => (i + 1) % templates.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, templates.length]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  }, [index]);

  if (!templates.length) return null;

  return (
    <div
      className="mb-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-neon-blue glow-blue font-bold">★ Featured — most voted</p>
        <div className="flex items-center gap-1.5">
          {templates.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-neon-blue shadow-[0_0_12px_rgba(0,212,255,0.8)]' : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden motion-safe:scroll-smooth"
      >
        {templates.map(t => {
          const status = normalizedStatus(t.status);
          const bidCount = t.bid_count ?? 0;
          const highBid = t.high_bid ?? t.current_bid ?? null;
          return (
            <div
              key={t.slug}
              className="relative snap-start shrink-0 w-[min(420px,calc(100vw-3rem))] rounded-2xl overflow-hidden glass-card neon-border"
            >
              <Link href={`/sites/${t.slug}`} className="block aspect-[16/9] relative bg-gradient-to-br from-[rgba(0,212,255,0.08)] to-[rgba(255,45,138,0.04)]">
                {t.thumbnail_url ? (
                  <Image
                    src={t.thumbnail_url}
                    alt={t.title}
                    fill
                    unoptimized
                    sizes="(max-width: 860px) 100vw, 420px"
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-[3.5rem]">🌐</span>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold bg-[rgba(255,229,52,0.15)] border border-neon-yellow/50 text-neon-yellow">
                  ★ Featured
                </span>
              </Link>
              <div className="p-5 flex flex-col gap-2">
                <div className={`inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold w-fit ${statusClasses(status)}`}>
                  {status === 'available' ? 'Available' : status === 'auction' ? 'Auction' : 'Sold'}
                </div>
                <div className="font-sora text-lg font-bold text-white">{t.title}</div>
                <div className="flex items-center gap-4 text-[0.8rem] text-white/50">
                  <span><span className="text-neon-magenta">♥</span> {t.vote_count ?? 0}</span>
                  {bidCount > 0 && <span><span className="text-neon-yellow">⚖</span> {bidCount}</span>}
                  {highBid != null && <span className="text-neon-yellow">High bid: ${highBid}</span>}
                </div>
                <div className="flex gap-2 mt-1">
                  <Link
                    href={`/sites/${t.slug}`}
                    className="inline-block px-3 py-1.5 rounded-md text-[0.8rem] font-bold no-underline bg-neon-yellow text-[#07070A] hover:-translate-y-0.5 transition-transform btn-glow-yellow"
                  >
                    View
                  </Link>
                  {status !== 'sold' && (
                    <button
                      type="button"
                      onClick={() => onVote(t.slug)}
                      className="inline-block px-3 py-1.5 rounded-md text-[0.8rem] font-bold border border-neon-magenta/40 text-neon-magenta bg-[rgba(255,45,138,0.06)] hover:bg-[rgba(255,45,138,0.16)]"
                    >
                      ♥ Vote
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`glass-card rounded-[12px] overflow-hidden ${open ? 'neon-border' : 'border border-glassBorder'}`}>
      <button
        className="w-full bg-transparent border-0 text-white px-5 py-[18px] text-[0.95rem] font-semibold text-left cursor-pointer flex justify-between items-center transition-colors hover:text-neon-blue"
        onClick={() => setOpen(!open)}
      >
        {q}<span className="text-[1.3rem] text-neon-blue leading-none">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-5 pb-[18px] text-white/70 text-[0.9rem] leading-[1.7]">{a}</div>}
    </div>
  );
}
