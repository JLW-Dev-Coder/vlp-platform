'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getTemplatesWithFallback, getSession, voteTemplate, Template } from '@/lib/api';
import { getPriceForSlug } from '@/lib/pricing';

const CATEGORIES = ['All', 'Available', 'health', 'finance', 'legal', 'food/bev', 'creative', 'services', 'other'];

const SECTION = 'py-20 px-6';
const SECTION_INNER = 'max-w-[1280px] mx-auto';
const SECTION_TITLE = 'font-sora text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-center mb-12 text-white -tracking-[0.5px]';
const NEON_LINE = 'h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent';
const BTN_PRIMARY = 'inline-block px-8 py-3.5 bg-brand-primary text-white font-bold text-[0.95rem] rounded-lg no-underline border-0 cursor-pointer transition-all shadow-brand hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(168,85,247,0.55)]';
const BTN_SECONDARY = 'inline-block px-8 py-3.5 bg-transparent text-brand-primary font-semibold text-[0.95rem] rounded-lg no-underline border border-brand-primary/50 cursor-pointer transition-all hover:-translate-y-0.5 hover:border-brand-primary hover:shadow-[0_0_24px_rgba(168,85,247,0.25)]';

function normalizedStatus(status: Template['status'] | undefined | null): 'available' | 'auction' | 'sold' {
  if (status === 'sold' || status === 'auction' || status === 'available') return status;
  return 'available';
}

function statusClasses(status: string) {
  if (status === 'available') return 'bg-[rgba(34,197,94,0.12)] text-[var(--color-success)] border border-[rgba(34,197,94,0.3)]';
  if (status === 'auction') return 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30';
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
      <div className="h-[3px] bg-[linear-gradient(90deg,var(--brand-primary),var(--brand-hover),var(--brand-dark),var(--brand-primary))] bg-[length:200%_100%] motion-safe:animate-[marquee_3s_linear_infinite]" />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-6" id="hero">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,85,247,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(168,85,247,0.1) 0%, transparent 50%), radial-gradient(ellipse 50% 30% at 20% 70%, rgba(168,85,247,0.08) 0%, transparent 50%)',
          }}
        />
        <div className="relative text-center max-w-[800px]">
          <h1 className="font-sora text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[1.05] text-white [text-shadow:0_0_60px_rgba(168,85,247,0.4),0_0_120px_rgba(168,85,247,0.2)] mb-4 -tracking-[2px]">
            Website Lotto
          </h1>
          <p className="font-sora text-[clamp(1.2rem,3vw,1.8rem)] font-semibold text-brand-primary [text-shadow:0_0_30px_rgba(168,85,247,0.5)] mb-5">
            Own your website. One payment. No subscriptions.
          </p>
          <p className="text-[1.05rem] text-white/65 leading-[1.7] max-w-[600px] mx-auto mb-8">
            Browse 210+ professional websites and buy the one that fits your business. One-time payment, 12 months hosting included, Cloudflare-backed security. Plug in your Stripe link and start selling in minutes.
          </p>
          <div className="flex flex-wrap gap-2.5 justify-center mb-8">
            {['From $249 one-time', '12 mo hosting included', 'Cloudflare-backed'].map(b => (
              <span
                key={b}
                className="px-4 py-1.5 border border-brand-primary/35 rounded-full text-[0.82rem] font-medium text-brand-primary bg-brand-primary/[0.06] tracking-wide"
              >
                {b}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3.5 justify-center">
            <a href="#sites" className={BTN_PRIMARY}>See Templates</a>
            <Link href="/scratch" className={BTN_SECONDARY}>Get Free Scratch Ticket</Link>
          </div>
        </div>
      </section>

      <div className={NEON_LINE} />

      {/* HOW IT WORKS */}
      <section className={SECTION} id="how">
        <div className={SECTION_INNER}>
          <h2 className={SECTION_TITLE}>How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '1', t: 'Pick a site', d: 'Browse 210+ templates and choose one that fits your business.' },
              { n: '2', t: 'Connect payments', d: 'Plug in your Stripe account or payment link. Done.' },
              { n: '3', t: 'Launch & sell', d: 'Your site is live on a branded subdomain. Start making money.' },
            ].map(s => (
              <div
                key={s.n}
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 transition-all hover:border-brand-primary/30 hover:-translate-y-1"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-primary/[0.12] border border-brand-primary/35 text-brand-primary font-bold text-[0.95rem] mb-4">
                  {s.n}
                </span>
                <h3 className="font-sora text-[1.1rem] font-semibold mb-2.5 text-white">{s.t}</h3>
                <p className="text-white/60 text-[0.92rem] leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={NEON_LINE} />

      {/* TEMPLATE GALLERY */}
      <section className={SECTION} id="sites">
        <div className={SECTION_INNER}>
          <h2 className={SECTION_TITLE}>Template Library</h2>

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
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[0.9rem] text-white placeholder:text-white/35 outline-none transition-colors focus:border-brand-primary/60 focus:bg-white/[0.05]"
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
                      ? 'bg-brand-primary/10 border-brand-primary/60 text-brand-primary'
                      : 'border-white/[0.12] bg-transparent text-white/60 hover:border-brand-primary/40 hover:text-brand-primary'
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
                        ? 'bg-brand-primary/10 border-brand-primary/50 text-brand-primary'
                        : 'border-white/10 bg-transparent text-white/55 hover:border-brand-primary/40 hover:text-brand-primary'
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
                  className="animate-pulse rounded-[14px] border border-white/[0.08] bg-white/[0.02] overflow-hidden"
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
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-10 text-center">
              <p className="text-white/70">No templates match your search.</p>
              <button
                type="button"
                onClick={() => { setSearchRaw(''); setFilter('All'); }}
                className="mt-4 inline-flex rounded-lg border border-brand-primary/40 bg-brand-primary/10 px-4 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary/20"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(t => (
                <TemplateCard key={t.slug} t={t} onVote={handleVote} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className={NEON_LINE} />

      {/* FEATURES */}
      <section className={SECTION} id="features">
        <div className={SECTION_INNER}>
          <h2 className={SECTION_TITLE}>What&apos;s Included</h2>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: '⚡', title: 'High-converting layout', desc: 'Professionally designed templates built to convert visitors into customers.' },
              { icon: '🌐', title: 'Branded subdomain', desc: 'Your site lives on a memorable .virtuallaunch.pro subdomain.' },
              { icon: '💳', title: 'Stripe-ready', desc: 'Plug in your Stripe link or payment button in seconds.' },
              { icon: '🔒', title: 'Cloudflare security', desc: 'DDoS protection, SSL, and global CDN included.' },
              { icon: '✏️', title: 'Easy customization', desc: 'Edit your content, brand colors, and contact info from the dashboard.' },
              { icon: '🎫', title: 'Scratch to Win', desc: 'Win a free template, discounts, or credits with our scratch ticket mechanic.' },
            ].map(f => (
              <div
                key={f.title}
                className="bg-white/[0.02] border border-white/[0.07] rounded-[14px] p-7 transition-all hover:border-brand-primary/30 hover:-translate-y-[3px]"
              >
                <span className="block text-[2rem] mb-3.5">{f.icon}</span>
                <h3 className="font-sora text-base font-semibold mb-2 text-white">{f.title}</h3>
                <p className="text-white/55 text-[0.88rem] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className={NEON_LINE} />

      {/* PRICING */}
      <section className={SECTION} id="pricing">
        <div className={SECTION_INNER}>
          <h2 className={SECTION_TITLE}>Pricing</h2>
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
              ctaPrimary={false}
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
              ctaPrimary={true}
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
              ctaPrimary={false}
            />
          </div>
        </div>
      </section>

      <div className={NEON_LINE} />

      {/* FAQ */}
      <section className={SECTION} id="faq">
        <div className={SECTION_INNER}>
          <h2 className={SECTION_TITLE}>FAQ</h2>
          <div className="max-w-[720px] mx-auto flex flex-col gap-2">
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
          <div className="text-center max-w-[640px] mx-auto flex flex-col items-center gap-5 py-12 px-6 bg-brand-primary/[0.04] border border-brand-primary/[0.12] rounded-[20px]">
            <h2 className="font-sora text-[clamp(1.4rem,3vw,2rem)] font-bold text-white -tracking-[0.5px] leading-tight">
              210+ professional websites. Ready to launch.
            </h2>
            <p className="text-base text-white/60 leading-[1.7] max-w-[520px]">
              Skip the agency. Get a designer-quality website for your practice or business — one-time payment, 12 months hosting included.
            </p>
            <a href="#sites" className={BTN_PRIMARY}>Browse templates</a>
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
  ctaPrimary: boolean;
}

function PricingBox({ price, suffix, label, badge, features, boldLast, ctaText, ctaPrimary }: PricingBoxProps) {
  return (
    <div className="relative bg-white/[0.03] border border-white/[0.09] rounded-[18px] p-8 flex flex-col gap-4 transition-all hover:border-brand-primary/30 hover:-translate-y-1">
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[0.72rem] font-bold px-3.5 py-[3px] rounded-full whitespace-nowrap">
          {badge}
        </div>
      )}
      <div className="font-sora text-[2.4rem] font-extrabold text-white leading-none">
        {price}<span className="text-base font-normal text-white/50">{suffix}</span>
      </div>
      <div className="text-[0.85rem] font-semibold text-white/50 uppercase tracking-wider">{label}</div>
      <ul className="list-none flex flex-col gap-2 flex-1">
        {features.map(f => (
          <li
            key={f}
            className="text-[0.88rem] text-white/65 pl-[18px] relative before:content-['✓'] before:absolute before:left-0 before:text-brand-primary before:font-bold"
          >
            {f}
          </li>
        ))}
        {boldLast && (
          <li className="text-[0.88rem] text-white/65 pl-[18px] relative before:content-['✓'] before:absolute before:left-0 before:text-brand-primary before:font-bold">
            <strong>{boldLast}</strong>
          </li>
        )}
      </ul>
      <a href="#sites" className={ctaPrimary ? BTN_PRIMARY : BTN_SECONDARY}>{ctaText}</a>
    </div>
  );
}

function TemplateCard({ t, onVote }: { t: Template; onVote: (slug: string) => void }) {
  const status = normalizedStatus(t.status);
  const voteCount = t.vote_count ?? 0;
  const bidCount = t.bid_count ?? 0;
  const highBid = t.high_bid ?? t.current_bid ?? null;

  return (
    <div className="group bg-white/[0.02] border border-white/[0.08] rounded-[14px] overflow-hidden transition-all flex flex-col hover:border-brand-primary/25 hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <Link
        href={`/sites/${t.slug}`}
        className="block aspect-[16/9] bg-white/[0.04] overflow-hidden relative no-underline"
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
        <div className="font-sora text-[1.1rem] font-extrabold text-brand-primary [text-shadow:0_0_12px_rgba(168,85,247,0.35)] mt-1">
          ${getPriceForSlug(t.slug)}
        </div>
        {status === 'auction' && highBid != null && (
          <div className="text-[0.8rem] text-brand-primary font-medium">High bid: ${highBid}</div>
        )}
        <div className="flex items-center gap-3 text-[0.72rem] text-white/50">
          <span className="inline-flex items-center gap-1">
            <span className="text-brand-primary">♥</span>
            {voteCount} vote{voteCount === 1 ? '' : 's'}
          </span>
          {bidCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <span>⚖</span>
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
                  className="inline-block px-3 py-[5px] rounded-md text-[0.75rem] font-semibold no-underline border border-brand-primary/35 text-brand-primary bg-brand-primary/[0.06] cursor-pointer transition-all hover:bg-brand-primary/[0.14] hover:border-brand-primary"
                >
                  Buy Now — ${getPriceForSlug(t.slug)}
                </Link>
              )}
              <Link
                href={`/sites/${t.slug}`}
                className="inline-block px-3 py-[5px] rounded-md text-[0.75rem] font-semibold no-underline border border-brand-primary/35 text-brand-primary bg-brand-primary/[0.06] cursor-pointer transition-all hover:bg-brand-primary/[0.14] hover:border-brand-primary"
              >
                {status === 'auction' ? `Bid${highBid ? ` $${highBid}` : ''}` : 'Place Bid'}
              </Link>
              <button
                className="inline-block px-3 py-[5px] rounded-md text-[0.75rem] font-semibold border border-brand-primary/35 text-brand-primary bg-brand-primary/[0.06] cursor-pointer transition-all hover:bg-brand-primary/[0.14] hover:border-brand-primary"
                onClick={() => onVote(t.slug)}
              >
                Vote
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
        <p className="text-xs uppercase tracking-widest text-white/40">Featured — most voted</p>
        <div className="flex items-center gap-1.5">
          {templates.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-brand-primary' : 'w-1.5 bg-white/20 hover:bg-white/40'
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
              className="relative snap-start shrink-0 w-[min(420px,calc(100vw-3rem))] rounded-2xl overflow-hidden border border-brand-primary/20 bg-gradient-to-br from-brand-primary/[0.08] to-white/[0.02]"
            >
              <Link href={`/sites/${t.slug}`} className="block aspect-[16/9] relative bg-white/[0.04]">
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
              </Link>
              <div className="p-5 flex flex-col gap-2">
                <div className={`inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold w-fit ${statusClasses(status)}`}>
                  {status === 'available' ? 'Available' : status === 'auction' ? 'Auction' : 'Sold'}
                </div>
                <div className="font-sora text-lg font-semibold text-white">{t.title}</div>
                <div className="flex items-center gap-4 text-[0.8rem] text-white/50">
                  <span>♥ {t.vote_count ?? 0}</span>
                  {bidCount > 0 && <span>⚖ {bidCount}</span>}
                  {highBid != null && <span className="text-brand-primary">High bid: ${highBid}</span>}
                </div>
                <div className="flex gap-2 mt-1">
                  <Link
                    href={`/sites/${t.slug}`}
                    className="inline-block px-3 py-1.5 rounded-md text-[0.8rem] font-semibold no-underline bg-brand-primary text-white hover:bg-brand-primary/90"
                  >
                    View
                  </Link>
                  {status !== 'sold' && (
                    <button
                      type="button"
                      onClick={() => onVote(t.slug)}
                      className="inline-block px-3 py-1.5 rounded-md text-[0.8rem] font-semibold border border-brand-primary/40 text-brand-primary bg-brand-primary/[0.06] hover:bg-brand-primary/[0.14]"
                    >
                      Vote
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
    <div className="border border-white/[0.08] rounded-[10px] overflow-hidden mb-2 bg-white/[0.02]">
      <button
        className="w-full bg-transparent border-0 text-white px-5 py-[18px] text-[0.95rem] font-medium text-left cursor-pointer flex justify-between items-center transition-colors hover:text-brand-primary"
        onClick={() => setOpen(!open)}
      >
        {q}<span className="text-[1.3rem] text-white/40 leading-none">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="px-5 pb-[18px] text-white/60 text-[0.9rem] leading-[1.7]">{a}</div>}
    </div>
  );
}
