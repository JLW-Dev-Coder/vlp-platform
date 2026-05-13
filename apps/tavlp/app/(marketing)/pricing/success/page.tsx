import type { Metadata } from 'next';
import Link from 'next/link';
import { tavlpConfig } from '@/lib/platform-config';

export const metadata: Metadata = {
  title: 'Welcome to Tax Avatar Pro',
  description: 'Your Tax Avatar Pro channel is being set up.',
};

const STEPS = [
  {
    title: 'Check your email',
    body: "We just sent you a welcome message. Save it — your channel-ready notification will come from the same address (noreply@virtuallaunch.pro).",
  },
  {
    title: 'We set up your channel (within 24 hours)',
    body: "We'll configure your branded YouTube channel with your firm's name, colors, and SEO settings. You'll get an email the moment it's live.",
  },
  {
    title: 'Log in and finish setup',
    body: 'Open your dashboard, pick your AI avatar, and confirm your tax topic. Pro tier customers can upload a photo for a custom avatar.',
  },
  {
    title: 'Approve scripts → videos go live',
    body: "Your first batch of scripts will be ready for review within 48 hours. Approve them and we render and publish to your channel automatically.",
  },
];

export default function PricingSuccessPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center text-white">
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
        style={{ backgroundColor: `${tavlpConfig.brandColor}20`, color: tavlpConfig.brandColor }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Welcome to Tax Avatar Pro!
      </h1>
      <p className="text-lg text-white/70 mb-10">
        Your subscription is confirmed. Here&apos;s how to finish your setup:
      </p>
      <ol className="text-left max-w-xl mx-auto space-y-4 mb-12">
        {STEPS.map((step, i) => (
          <li
            key={i}
            className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5"
          >
            <span
              className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
              style={{ backgroundColor: tavlpConfig.brandColor, color: '#fff' }}
            >
              {i + 1}
            </span>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">{step.title}</div>
              <div className="text-white/70 text-sm leading-relaxed mt-1">{step.body}</div>
            </div>
          </li>
        ))}
      </ol>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/dashboard"
          className="inline-block px-8 py-3 rounded-full text-sm font-semibold transition-all"
          style={{ backgroundColor: tavlpConfig.brandColor, color: '#fff' }}
        >
          Go to dashboard
        </Link>
        <Link
          href="/help"
          className="inline-block px-8 py-3 rounded-full text-sm font-semibold border border-white/20 text-white/80 hover:bg-white/[0.04] transition-all"
        >
          Visit Help Center
        </Link>
      </div>
    </section>
  );
}
