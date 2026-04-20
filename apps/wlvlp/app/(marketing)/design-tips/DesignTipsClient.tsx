'use client';

import Link from 'next/link';

const NEON = { blue: '#00D4FF', yellow: '#FFE534', magenta: '#FF2D8A', cyan: '#00F0D0' };

const VIDEOS = [
  { code: 'YT000', title: "Most Websites Fail in Under 3 Seconds, Here's How We Fix That", videoId: 'GeV-2tDTpgU' },
  { code: 'YT001', title: 'Stop Gambling With Your Website. Do This Instead', videoId: 'DPe9qhvEOpg' },
  { code: 'YT002', title: "Why Your Website Isn't Converting (And It's Not What You Think)", videoId: '99dpvaOiAmk' },
  { code: 'YT003', title: "You Don't Have a Traffic Problem. You Have This Problem", videoId: 'KIZujE1wumc' },
  { code: 'YT004', title: 'Fix This One Thing and Get More Clicks', videoId: '3RPVACZ15Dg' },
  { code: 'YT005', title: "Nobody Reads Your Website. They Scan. Here's How to Win", videoId: '4E7Afjoj0zA' },
  { code: 'YT006', title: "Your Homepage Is Wrong. Here's the Right Layout", videoId: 'RMx4jfkwPbE' },
  { code: 'YT007', title: 'Bad Website vs High-Converting Website', videoId: 'yXa6fKgdZVA' },
  { code: 'YT008', title: 'Clarity Beats Design. Every Time', videoId: 'P1yifG1tv70' },
  { code: 'YT009', title: 'This Is What a Converting Website Looks Like', videoId: 'Uk7VFFDyzrQ' },
  { code: 'YT010', title: "You're Getting Traffic... So Why Is Nobody Clicking?", videoId: 'p7jgAGjoP30' },
];

export default function DesignTipsClient() {
  const ordered = [...VIDEOS].reverse();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a2e] text-white">
      <section className="px-6 pt-20 pb-12 text-center">
        <h1
          className="text-5xl md:text-6xl font-bold tracking-tight"
          style={{ color: NEON.yellow, textShadow: `0 0 20px ${NEON.yellow}80, 0 0 40px ${NEON.yellow}40` }}
        >
          Design Tips
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
          Short videos on what makes websites actually convert. No fluff — just what works.
        </p>
      </section>

      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ordered.map((v) => {
            const ep = v.code.replace('YT', '');
            return (
              <article
                key={v.code}
                id={v.code}
                className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden hover:border-white/20 transition-colors"
              >
                <div className="aspect-video bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${v.videoId}`}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <div
                    className="text-xs font-mono tracking-widest mb-2"
                    style={{ color: NEON.cyan }}
                  >
                    EP {ep}
                  </div>
                  <h3 className="text-white font-semibold leading-snug">{v.title}</h3>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-20 text-center border-t border-white/10">
        <h2
          className="text-4xl md:text-5xl font-bold"
          style={{ color: NEON.yellow, textShadow: `0 0 20px ${NEON.yellow}80` }}
        >
          Ready to stop guessing?
        </h2>
        <p className="mt-4 text-lg text-white/70">Get a site built to convert.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="px-8 py-4 rounded-lg font-bold text-black transition-transform hover:scale-105"
            style={{ backgroundColor: NEON.yellow, boxShadow: `0 0 20px ${NEON.yellow}80` }}
          >
            Browse Templates →
          </Link>
          <Link href="/launch" className="text-white/80 underline hover:text-white">
            Or get launched →
          </Link>
        </div>
      </section>
    </main>
  );
}
