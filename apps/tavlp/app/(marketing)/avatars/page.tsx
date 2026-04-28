import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Avatars',
  description: 'Browse the Tax Avatar Pro avatar roster. Choose the AI host that fits your tax practice.',
};

// TODO: replace placeholder roster with real avatar lineup
const AVATARS = [
  { code: 'A', name: 'Avery' },
  { code: 'B', name: 'Bennett' },
  { code: 'C', name: 'Camille' },
  { code: 'D', name: 'Dorian' },
  { code: 'E', name: 'Elise' },
  { code: 'F', name: 'Felix' },
];

const R2_BASE = 'https://api.virtuallaunch.pro/tavlp';

export default function AvatarsPage() {
  return (
    <section className="mx-auto max-w-[77.5rem] px-4 pb-20 pt-16 md:pt-24">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-text-primary">
          Choose your{' '}
          <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
            avatar
          </span>
        </h1>
        <p className="text-lg text-text-muted max-w-2xl mx-auto">
          Pick the AI host who will represent your tax practice on YouTube. Each avatar is HeyGen-powered, professionally trained, and ready to launch your channel.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {AVATARS.map((a) => {
          const slug = `${a.code}-${a.name.toLowerCase()}`;
          const videoUrl = `${R2_BASE}/videos/${slug}-intro.mp4`;
          const looksUrl = `${R2_BASE}/avatars/${slug}-looks.png`;
          return (
            <div
              key={a.code}
              className="rounded-2xl bg-surface-card border border-subtle overflow-hidden hover:border-brand-primary/40 transition-all duration-base"
            >
              <div className="aspect-video bg-surface-bg">
                <video
                  src={videoUrl}
                  poster={looksUrl}
                  controls
                  preload="none"
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={looksUrl}
                  alt={`${a.name} looks`}
                  className="w-full h-32 object-cover rounded-lg mb-4 bg-surface-bg"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-text-primary">{a.name}</div>
                    <div className="text-xs text-text-muted uppercase tracking-wide">Avatar {a.code}</div>
                  </div>
                  <Link
                    href="/#start"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-br from-brand-primary to-brand-gradient-to text-brand-text-on-primary hover:shadow-lg transition-all"
                  >
                    Choose {a.name}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
