'use client';
import { useState, useEffect } from 'react';
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
  const [session, setSession] = useState<{ account_id: string } | null>(null);

  useEffect(() => {
    getTemplatesWithFallback()
      .then(setTemplates)
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
    getSession().then(setSession).catch(() => {});
  }, []);

  const filtered = templates
    .filter(t => {
      if (filter === 'All') return true;
      if (filter === 'Available') return t.status === 'available';
      return t.category === filter;
    })
    .sort((a, b) => {
      if (sort === 'votes') return b.vote_count - a.vote_count;
      if (sort === 'price') return a.price_monthly - b.price_monthly;
      return 0;
    });

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

          <div className="flex items-center gap-2 mb-8 text-white/50 text-[0.85rem]">
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

          {loading ? (
            <div className="flex justify-center py-20"><span className="spinner" /></div>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(t => (
                <div
                  key={t.slug}
                  className="group bg-white/[0.02] border border-white/[0.08] rounded-[14px] overflow-hidden transition-all flex flex-col hover:border-brand-primary/25 hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                >
                  <Link href={`/sites/${t.slug}`} className="block aspect-[16/9] bg-white/[0.04] overflow-hidden relative no-underline">
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
                  </Link>
                  <div className="p-4 flex flex-col gap-1.5 flex-1">
                    <div className={`inline-block px-2.5 py-0.5 rounded-full text-[0.72rem] font-semibold tracking-wide w-fit ${statusClasses(t.status)}`}>
                      {t.status === 'available' ? 'Available' : t.status === 'auction' ? 'Auction' : 'Sold'}
                    </div>
                    <div className="font-sora text-[0.9rem] font-semibold text-white leading-snug">{t.title}</div>
                    <div className="text-[0.75rem] text-white/40 uppercase tracking-wider">{t.category}</div>
                    <div className="font-sora text-[1.1rem] font-extrabold text-brand-primary [text-shadow:0_0_12px_rgba(168,85,247,0.35)] mt-1">
                      ${getPriceForSlug(t.slug)}
                    </div>
                    {t.status === 'auction' && t.current_bid && (
                      <div className="text-[0.8rem] text-brand-primary font-medium">Bid: ${t.current_bid}</div>
                    )}
                    <div className="text-[0.78rem] text-white/40">▲ {t.vote_count} votes</div>
                    <div className="flex gap-1.5 flex-wrap mt-auto pt-2">
                      {t.status === 'sold' ? (
                        <span className="inline-block px-3 py-[5px] rounded-md text-[0.75rem] font-semibold text-white/[0.35] bg-white/[0.04] border border-white/[0.08]">
                          Sold
                        </span>
                      ) : (
                        <>
                          {t.status === 'available' && (
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
                            {t.status === 'auction' ? `Bid $${t.current_bid ?? ''}` : 'Place Bid'}
                          </Link>
                          <button
                            className="inline-block px-3 py-[5px] rounded-md text-[0.75rem] font-semibold border border-brand-primary/35 text-brand-primary bg-brand-primary/[0.06] cursor-pointer transition-all hover:bg-brand-primary/[0.14] hover:border-brand-primary"
                            onClick={() => handleVote(t.slug)}
                          >
                            Vote
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
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
