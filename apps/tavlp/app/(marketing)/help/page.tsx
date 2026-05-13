'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { tavlpConfig } from '@/lib/platform-config';

type FaqItem = { q: string; a: ReactNode };
type FaqCategory = { name: string; items: FaqItem[] };

const FAQS: FaqCategory[] = [
  {
    name: 'Getting Started',
    items: [
      {
        q: 'How does Tax Avatar Pro work?',
        a: 'You subscribe, pick your AI avatar and tax topic, and we handle the rest. Our AI writes video scripts tailored to your specialty. You review and approve each script from your dashboard. Once approved, we render the video with your avatar and publish it to your branded YouTube channel automatically.',
      },
      {
        q: 'How long until my first video is published?',
        a: 'Your channel is set up within 24 hours of subscribing. Once you log in and approve your first scripts, videos are typically rendered and published within a few hours.',
      },
      {
        q: 'What tax topics can I choose?',
        a: 'Any area you specialize in — penalty abatement, IRS collections, audit representation, tax resolution, estate planning, whatever your practice focuses on. Our AI generates scripts specifically for your niche.',
      },
    ],
  },
  {
    name: 'How Your Monthly Cycle Works',
    items: [
      {
        q: 'How does the monthly content cycle work?',
        a: "Every month on your billing date, we automatically generate a fresh batch of video scripts tailored to your tax topic. You'll get an email letting you know they're ready. Log in to your dashboard, review the scripts, and approve the ones you want published. Once you approve, we render the videos with your AI avatar and publish them to your YouTube channel — all automatically. Your only job is to review and click approve.",
      },
      {
        q: "What happens if I don't review my scripts right away?",
        a: "No rush — but your videos can't go live until you approve the scripts. We'll send you a friendly reminder after 3 days, and one more after a week. After that, we won't bug you again. Approve whenever you're ready — it only takes a minute.",
      },
      {
        q: 'Do I have to do anything to keep my channel active?',
        a: "Just approve your scripts each month. That's it. We handle everything else — writing the scripts, rendering the videos, creating thumbnails, uploading to YouTube, and optimizing the metadata. Your channel stays active and growing as long as you keep approving content.",
      },
      {
        q: 'When do my new scripts arrive each month?',
        a: "On your billing date. If you subscribed on the 15th, your new scripts generate on the 15th of each month. You'll get an email notification the moment they're ready for review.",
      },
    ],
  },
  {
    name: 'Your Channel',
    items: [
      {
        q: 'Do I own my channel?',
        a: "You can. We build and manage the channel for you, and you're added as a Channel Manager with full visibility into analytics, comments, and content. When you're ready, request ownership transfer from your dashboard. After a 7-day YouTube transfer process, you become the primary owner with full control.",
      },
      {
        q: 'What happens to my channel if I cancel?',
        a: 'Your channel and all published videos remain live on YouTube. We simply stop producing new content. Your subscribers, views, and SEO rankings stay with the channel.',
      },
      {
        q: "Can I see my channel's performance?",
        a: 'Yes. Your dashboard shows daily-updated stats — subscribers, views, video count, and top performers. No YouTube Studio login needed.',
      },
    ],
  },
  {
    name: 'Videos & Scripts',
    items: [
      {
        q: 'How are the video scripts created?',
        a: 'Our AI generates scripts based on your chosen tax topic. Each script is 250-400 words (about 2 minutes when spoken) and includes a hook, educational content, and a call to action. You review and approve every script before we produce the video.',
      },
      {
        q: "Can I edit a script before it's produced?",
        a: "Not directly in the current version — you can approve or reject scripts. If a script doesn't fit, reject it and generate new ones. Script editing is on our roadmap.",
      },
      {
        q: "What if I don't approve my scripts?",
        a: "We'll send you a reminder after 3 days and again after 7 days. Your videos can't be produced until you approve the scripts — but there's no penalty for waiting. Approve whenever you're ready.",
      },
    ],
  },
  {
    name: 'Avatars',
    items: [
      {
        q: 'Who are the 6 AI avatars?',
        a: 'Annie, Tariq, Genesis, Knox, Denyse, and Griffin — each with a unique delivery style. You choose one when you set up your channel. Growth and Pro plan customers can switch avatars once per month.',
      },
      {
        q: 'Can I use my own face as an avatar?',
        a: 'Yes — Pro plan customers can upload a photo to create a custom AI avatar. Your avatar is generated automatically and ready for video production within minutes.',
      },
      {
        q: "Will viewers know it's an AI avatar?",
        a: 'Modern AI avatars are highly realistic with natural lip sync, expressions, and gestures. Most viewers focus on the content, not whether the presenter is AI. We recommend transparency — many successful channels openly use AI presenters.',
      },
    ],
  },
  {
    name: 'Billing & Plans',
    items: [
      {
        q: "What's included in each plan?",
        a: (
          <>
            Launch ($49/mo): 4 videos/month, 1 avatar. Growth ($99/mo): 8 videos/month, avatar changes. Pro ($149/mo): 12 videos/month, custom avatar from your photo, white-label channel. All plans include channel setup, stats dashboard, and lead generation pipeline. See our{' '}
            <Link href="/pricing" style={{ color: '#ec4899', textDecoration: 'underline' }}>pricing page</Link>{' '}
            for the full comparison.
          </>
        ),
      },
      {
        q: 'Can I upgrade or downgrade my plan?',
        a: 'Yes. Contact us to change your plan at any time. Changes take effect on your next billing cycle.',
      },
      {
        q: 'Is there a setup fee?',
        a: '$99 one-time channel setup fee, waived if you choose annual billing.',
      },
      {
        q: 'Can I get additional videos beyond my plan?',
        a: 'Yes — $15 per additional video on any plan.',
      },
    ],
  },
  {
    name: 'Ownership Transfer',
    items: [
      {
        q: 'How does channel ownership transfer work?',
        a: "From your dashboard, check \"I'd like to transfer ownership of the channel to me\" and click Continue. Your subscription is cancelled immediately. We process the YouTube transfer within 7 business days. After transfer, you're the primary owner with full control. You can always re-subscribe and invite us back as a manager for new videos.",
      },
      {
        q: 'Can I reverse a transfer?',
        a: 'Once a transfer is complete, it cannot be reversed through our system. However, you can re-subscribe and invite us back as a Channel Manager, which restores our ability to upload videos to your channel.',
      },
    ],
  },
];

function AccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-4 py-4 text-left text-white hover:text-white/90 transition-colors"
      >
        <span className="text-sm md:text-base font-medium">{item.q}</span>
        <span
          className="flex-shrink-0 mt-1 transition-transform"
          style={{ color: tavlpConfig.brandColor, transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="pb-5 pr-8 text-sm leading-relaxed text-white/70">{item.a}</div>
      )}
    </div>
  );
}

export default function HelpCenterPage() {
  const calIntroHref = `https://cal.com/${tavlpConfig.calIntroSlug}`;
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 pt-20 pb-12 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Help Center</h1>
        <p className="text-lg text-white/70">
          Everything you need to know about Tax Avatar Pro.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-24">
        <div className="space-y-10">
          {FAQS.map((cat) => (
            <div key={cat.name}>
              <h2
                className="text-xs uppercase tracking-[0.18em] font-semibold mb-2"
                style={{ color: tavlpConfig.brandColor }}
              >
                {cat.name}
              </h2>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-5">
                {cat.items.map((item, i) => (
                  <AccordionItem key={i} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-white mb-3">Still have questions?</h3>
          <p className="text-white/70 mb-6">Our team usually replies within one business day.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-block px-8 py-3 rounded-full text-sm font-semibold transition-all"
              style={{ backgroundColor: tavlpConfig.brandColor, color: '#fff' }}
            >
              Contact Us
            </Link>
            <a
              href={calIntroHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-full text-sm font-semibold border border-white/20 text-white/80 hover:bg-white/[0.04] transition-all"
            >
              Book a Call
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
