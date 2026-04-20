'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TEMPLATES, type TemplateEntry } from '@/lib/templates';

const SECTION = 'relative py-16 px-6';
const SECTION_INNER = 'max-w-[1280px] mx-auto relative z-10';
const SECTION_TITLE = 'font-sora text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-center mb-8 text-white -tracking-[0.5px]';

type BusinessKey =
  | 'service'
  | 'finance'
  | 'local'
  | 'ecommerce'
  | 'creative'
  | 'tech'
  | 'realestate'
  | 'general';

type BusinessType = {
  key: BusinessKey;
  label: string;
  icon: string;
  description: string;
  border: string;
  borderClass: string;
};

const BUSINESS_TYPES: BusinessType[] = [
  { key: 'service', label: 'Service Business', icon: '🛠️', description: 'Consulting, coaching, agencies', border: '#00D4FF', borderClass: 'neon-border' },
  { key: 'finance', label: 'Finance & Tax', icon: '📊', description: 'Accounting, tax, wealth advisory', border: '#FFE534', borderClass: 'neon-border-yellow' },
  { key: 'local', label: 'Local Business', icon: '📍', description: 'Restaurants, salons, contractors', border: '#FF2D8A', borderClass: 'neon-border-magenta' },
  { key: 'ecommerce', label: 'Ecommerce', icon: '🛒', description: 'Online stores, product catalogs', border: '#00F0D0', borderClass: 'neon-border-cyan' },
  { key: 'creative', label: 'Creative & Portfolio', icon: '🎨', description: 'Studios, galleries, photography', border: '#00D4FF', borderClass: 'neon-border' },
  { key: 'tech', label: 'Tech & SaaS', icon: '⚡', description: 'Software, AI tools, platforms', border: '#FFE534', borderClass: 'neon-border-yellow' },
  { key: 'realestate', label: 'Real Estate', icon: '🏠', description: 'Property, agents, interiors', border: '#FF2D8A', borderClass: 'neon-border-magenta' },
  { key: 'general', label: 'Not Sure Yet', icon: '🎯', description: 'Show me the best of everything', border: '#00F0D0', borderClass: 'neon-border-cyan' },
];

const RESPONSES: Record<BusinessKey, string> = {
  service:
    "Service businesses convert best with a clear headline about outcomes, social proof from past clients, and one obvious CTA — usually 'Book a Call' or 'Get a Quote'. The templates below are built around that exact flow.",
  finance:
    'Trust is everything in finance. Your visitors need to see credentials, compliance language, and a professional tone before they’ll share any information. These templates lead with authority.',
  local:
    'Local businesses need three things above the fold: what you do, where you are, and how to reach you. No scrolling required. These templates put contact info and location front and center.',
  ecommerce:
    'Product pages need fast load times, clear pricing, and a frictionless path to checkout. These templates minimize clicks between landing and buying.',
  creative:
    'Creative portfolios are about visual impact first, details second. These templates use full-bleed imagery, minimal text, and let your work speak.',
  tech:
    'SaaS and tech sites need to explain what you do in one sentence, show a product screenshot, and offer a free trial or demo. These templates follow that proven structure.',
  realestate:
    'Property sites need high-quality imagery, easy filtering, and a way to schedule viewings. These templates are built around visual listings and lead capture.',
  general:
    "Not sure what vertical you're in? These are our most versatile, highest-voted templates — they work across industries and can be customized to fit anything.",
};

const LABEL_BY_KEY: Record<BusinessKey, string> = BUSINESS_TYPES.reduce(
  (acc, b) => ({ ...acc, [b.key]: b.label }),
  {} as Record<BusinessKey, string>,
);

export default function GetStartedClient() {
  const [selected, setSelected] = useState<BusinessKey | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    if (!selected) return;
    setShowResponse(false);
    setShowTemplates(false);
    const t1 = setTimeout(() => setShowResponse(true), 60);
    const t2 = setTimeout(() => setShowTemplates(true), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [selected]);

  const recommended: TemplateEntry[] = selected
    ? TEMPLATES.filter(t => t.category === selected).slice(0, 9)
    : [];
  const totalForCategory = selected
    ? TEMPLATES.filter(t => t.category === selected).length
    : 0;

  const handleSelect = (key: BusinessKey) => {
    setSelected(key);
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        document.getElementById('xavier-response')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  };

  return (
    <>
      <style>{`
        @keyframes cardFloat-1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes cardFloat-2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes cardFloat-3 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes cardFloat-4 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: no-preference) {
          .xavier-card-1 { animation: cardFloat-1 2.5s ease-in-out infinite; }
          .xavier-card-2 { animation: cardFloat-2 3s ease-in-out infinite 0.2s; }
          .xavier-card-3 { animation: cardFloat-3 3.5s ease-in-out infinite 0.4s; }
          .xavier-card-4 { animation: cardFloat-4 4s ease-in-out infinite 0.6s; }
          .xavier-fade-up { animation: fadeUp 500ms ease-out both; }
        }
        .xavier-card-selected { transform: scale(1.05); box-shadow: 0 0 32px rgba(255,229,52,0.45); }
        .xavier-card-dim { opacity: 0.4; transition: opacity 300ms; }
        .xavier-card { transition: transform 200ms, box-shadow 200ms, opacity 300ms; cursor: pointer; }
        .xavier-card:hover { transform: scale(1.03); }
      `}</style>

      {/* STAGE 1: Intro video + heading */}
      <section className={SECTION}>
        <div className={SECTION_INNER}>
          <div
            className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-2xl border border-neon-cyan/30"
            style={{ aspectRatio: '16/9' }}
          >
            <iframe
              src="https://www.youtube.com/embed/DPe9qhvEOpg?autoplay=1&mute=1&rel=0&modestbranding=1"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
              loading="eager"
              title="Xavier intro"
            />
          </div>

          <h1 className="font-sora text-[clamp(2rem,5vw,3.4rem)] font-bold text-center mt-10 mb-4 -tracking-[0.5px]">
            <span className="glow-yellow text-neon-yellow">What kind of business are you building?</span>
          </h1>
          <p className="text-white/70 text-center max-w-2xl mx-auto text-[0.98rem] leading-relaxed mb-8">
            Xavier will recommend templates that fit your industry — no guesswork, no typing.
          </p>

          <div className="flex justify-center">
            <a
              href="#business-select"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-yellow text-black font-semibold btn-glow-yellow transition-transform hover:scale-[1.03]"
            >
              Pick Your Business Type
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <div className="neon-line" />

      {/* STAGE 2: Business type selection */}
      <section className={SECTION} id="business-select">
        <div className={SECTION_INNER}>
          <h2 className={SECTION_TITLE}>
            <span className="glow-blue">Choose your industry</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BUSINESS_TYPES.map((b, i) => {
              const animCls = `xavier-card-${(i % 4) + 1}`;
              const isSelected = selected === b.key;
              const isDimmed = selected !== null && !isSelected;
              return (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => handleSelect(b.key)}
                  className={`xavier-card ${animCls} ${b.borderClass} glass-card rounded-2xl p-5 text-left flex flex-col items-center justify-center text-center ${
                    isSelected ? 'xavier-card-selected' : ''
                  } ${isDimmed ? 'xavier-card-dim' : ''}`}
                  style={{ minHeight: '160px' }}
                  aria-pressed={isSelected}
                >
                  <div className="text-4xl mb-3" aria-hidden="true">{b.icon}</div>
                  <div className="font-sora font-semibold text-white mb-1">{b.label}</div>
                  <div className="text-sm text-white/60">{b.description}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* STAGE 3 + 4: Xavier response and template recommendations */}
      {selected && (
        <>
          <div className="neon-line" />

          <section className={SECTION} id="xavier-response">
            <div className={SECTION_INNER}>
              {showResponse && (
                <div className="xavier-fade-up max-w-3xl mx-auto text-center">
                  <h2 className="font-sora text-[clamp(1.6rem,3.5vw,2.3rem)] font-bold mb-6 -tracking-[0.5px]">
                    <span className="glow-yellow text-neon-yellow">
                      Great choice — here&apos;s what works for {LABEL_BY_KEY[selected]} websites
                    </span>
                  </h2>
                  <p className="text-white/80 text-[1.02rem] leading-relaxed">{RESPONSES[selected]}</p>
                  {/* Future: R2-hosted Xavier video per category */}
                  {/* <video src={`/videos/xavier-${selected}.mp4`} autoPlay muted playsInline /> */}
                </div>
              )}
            </div>
          </section>

          {showTemplates && (
            <>
              <div className="neon-line" />

              <section className={SECTION} id="xavier-templates">
                <div className={SECTION_INNER}>
                  <div className="xavier-fade-up">
                    <h2 className={SECTION_TITLE}>
                      <span className="glow-blue">✨ Templates Xavier picked for you</span>
                    </h2>

                    {recommended.length === 0 ? (
                      <p className="text-white/70 text-center">
                        No templates found for this category yet — browse{' '}
                        <Link href="/" className="text-neon-yellow underline">
                          all templates
                        </Link>
                        .
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recommended.map(t => (
                          <Link
                            key={t.slug}
                            href={`/sites/${t.slug}`}
                            className="glass-card rounded-2xl p-6 neon-border transition-transform hover:scale-[1.02] block"
                          >
                            <div className="aspect-video rounded-lg overflow-hidden mb-4 border border-neon-cyan/20 bg-black/30">
                              <img
                                src={`/sites/${t.slug}/thumb.png`}
                                alt={t.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={e => {
                                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                            <h3 className="font-sora font-bold text-white text-lg mb-1">{t.title}</h3>
                            <p className="text-white/60 text-sm">View template →</p>
                          </Link>
                        ))}
                      </div>
                    )}

                    {totalForCategory > 9 && (
                      <div className="text-center mt-8">
                        <Link href="/" className="text-neon-yellow underline text-[0.95rem]">
                          View all {totalForCategory} {LABEL_BY_KEY[selected]} templates →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <div className="neon-line" />

              {/* STAGE 5: Final CTA */}
              <section className={SECTION}>
                <div className={SECTION_INNER}>
                  <div className="xavier-fade-up max-w-3xl mx-auto text-center">
                    <h2 className="font-sora text-[clamp(1.8rem,4vw,2.6rem)] font-bold mb-8 -tracking-[0.5px]">
                      <span className="glow-yellow text-neon-yellow">Ready to claim yours?</span>
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                      <Link
                        href="/"
                        className="px-6 py-3 rounded-xl bg-neon-yellow text-black font-semibold btn-glow-yellow transition-transform hover:scale-[1.03]"
                      >
                        Browse All Templates
                      </Link>
                      <Link
                        href="/launch"
                        className="px-6 py-3 rounded-xl border border-neon-blue text-neon-blue font-semibold btn-glow-blue transition-transform hover:scale-[1.03]"
                      >
                        Get Launched
                      </Link>
                      <a
                        href="https://cal.com/tax-monitor-pro/wlvlp-intro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-xl text-white/80 font-medium transition-colors hover:text-white"
                      >
                        Book a Demo
                      </a>
                    </div>
                    <Link href="/scratch" className="text-white/60 hover:text-neon-cyan text-sm underline">
                      Or try your luck →
                    </Link>
                  </div>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </>
  );
}
