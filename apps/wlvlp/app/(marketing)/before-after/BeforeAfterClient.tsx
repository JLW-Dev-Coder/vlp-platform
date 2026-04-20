'use client';

import Link from 'next/link';

const NEON = { blue: '#00D4FF', yellow: '#FFE534', magenta: '#FF2D8A', cyan: '#00F0D0' };

type Comparison = {
  beforeTitle: string;
  beforeBody: string;
  afterTitle: string;
  afterBody: string;
  videoCode: string;
  videoTitle: string;
};

const COMPARISONS: Comparison[] = [
  {
    beforeTitle: 'Vague headline',
    beforeBody: '"Welcome to Our Company" — tells visitors nothing about what you do.',
    afterTitle: 'Clear headline',
    afterBody: '"Professional Websites for Small Businesses — Live in 48 Hours" — outcome-driven, specific.',
    videoCode: 'YT002',
    videoTitle: "Why Your Website Isn't Converting",
  },
  {
    beforeTitle: 'Buried CTA',
    beforeBody: 'Call-to-action hidden below the fold, multiple competing buttons.',
    afterTitle: 'Above-fold CTA',
    afterBody: 'Single clear action visible without scrolling.',
    videoCode: 'YT004',
    videoTitle: 'Fix This One Thing and Get More Clicks',
  },
  {
    beforeTitle: 'Wall of text',
    beforeBody: 'Long paragraphs nobody reads, no visual hierarchy.',
    afterTitle: 'Scannable layout',
    afterBody: 'Short blocks, bold headers, clear visual hierarchy.',
    videoCode: 'YT005',
    videoTitle: 'Nobody Reads Your Website. They Scan.',
  },
  {
    beforeTitle: 'Wrong homepage structure',
    beforeBody: 'About Us as the hero, services buried in subpages.',
    afterTitle: 'Conversion layout',
    afterBody: 'Value prop → proof → CTA in a single scroll.',
    videoCode: 'YT006',
    videoTitle: "Your Homepage Is Wrong. Here's the Right Layout",
  },
  {
    beforeTitle: 'Pretty but unclear',
    beforeBody: 'Beautiful design with no clear purpose or next step.',
    afterTitle: 'Clear and converting',
    afterBody: 'Clean design where every element drives toward one action.',
    videoCode: 'YT008',
    videoTitle: 'Clarity Beats Design. Every Time',
  },
  {
    beforeTitle: 'Traffic with no conversions',
    beforeBody: 'Getting visitors but nobody clicks or buys.',
    afterTitle: 'Traffic that converts',
    afterBody: 'Clear offer, visible CTA, reduced friction.',
    videoCode: 'YT010',
    videoTitle: "You're Getting Traffic... So Why Is Nobody Clicking?",
  },
];

export default function BeforeAfterClient() {
  return (
    <div className="text-white">
      <section className="px-6 pt-20 pb-12 text-center">
        <h1
          className="text-5xl md:text-6xl font-bold tracking-tight"
          style={{ color: NEON.yellow, textShadow: `0 0 20px ${NEON.yellow}80, 0 0 40px ${NEON.yellow}40` }}
        >
          Before &amp; After
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
          See the difference between a website that looks nice and one that actually converts.
        </p>
      </section>

      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/yXa6fKgdZVA"
              title="Bad Website vs High-Converting Website"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        <p className="mt-4 text-center text-white/60 text-sm">
          Featured: Bad Website vs High-Converting Website
        </p>
      </section>

      <section className="px-6 pb-24 max-w-6xl mx-auto space-y-6">
        {COMPARISONS.map((c, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="rounded-xl border-l-4 bg-white/5 backdrop-blur-md p-6"
              style={{ borderLeftColor: NEON.magenta, backgroundColor: `${NEON.magenta}0D` }}
            >
              <div
                className="text-xs uppercase tracking-widest font-bold mb-3"
                style={{ color: NEON.magenta }}
              >
                Before
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{c.beforeTitle}</h3>
              <p className="text-white/70 leading-relaxed">{c.beforeBody}</p>
            </div>
            <div
              className="rounded-xl border-l-4 bg-white/5 backdrop-blur-md p-6"
              style={{ borderLeftColor: NEON.cyan, backgroundColor: `${NEON.cyan}0D` }}
            >
              <div
                className="text-xs uppercase tracking-widest font-bold mb-3"
                style={{ color: NEON.cyan }}
              >
                After
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{c.afterTitle}</h3>
              <p className="text-white/70 leading-relaxed">{c.afterBody}</p>
              <Link
                href={`/design-tips#${c.videoCode}`}
                className="inline-block mt-4 text-sm underline"
                style={{ color: NEON.blue }}
              >
                Watch: {c.videoTitle} →
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="px-6 py-20 text-center border-t border-white/10">
        <h2
          className="text-4xl md:text-5xl font-bold"
          style={{ color: NEON.yellow, textShadow: `0 0 20px ${NEON.yellow}80` }}
        >
          Ready for the &ldquo;after&rdquo; version?
        </h2>
        <p className="mt-4 text-lg text-white/70">Pick a template that&rsquo;s already built to convert.</p>
        <Link
          href="/"
          className="inline-block mt-8 px-8 py-4 rounded-lg font-bold text-black transition-transform hover:scale-105"
          style={{ backgroundColor: NEON.yellow, boxShadow: `0 0 20px ${NEON.yellow}80` }}
        >
          Browse Templates →
        </Link>
      </section>
    </div>
  );
}
