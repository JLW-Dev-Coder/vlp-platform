'use client';

import { useState, type ReactNode } from 'react';

type ProductKey = 'tcvlp' | 'tavlp' | 'tttmp' | 'ttmp' | 'vlp';

interface Product {
  key: ProductKey;
  label: string;
  color: string;
  body: ReactNode;
}

const PRODUCTS: Product[] = [
  {
    key: 'tcvlp',
    label: 'TaxClaim Pro',
    color: '#F59E0B',
    body: (
      <>
        <p>&ldquo;So here&apos;s the thing — JLW has this tool called TaxClaim Pro.&rdquo;</p>
        <p>
          &ldquo;If any of your clients got hit with IRS penalties between January 2020 and
          July 2023, there&apos;s a court ruling called Kwong v. US that could get those
          penalties wiped.&rdquo;
        </p>
        <p>&ldquo;The deadline to file is July 10, 2026 — that&apos;s coming up fast.&rdquo;</p>
        <p>
          &ldquo;JLW built a tool that generates the Form 843 for penalty abatement
          automatically. Your clients submit their info, the tool does the math, and you get a
          ready-to-file form.&rdquo;
        </p>
        <p>
          &ldquo;She can walk you through the whole thing in 15 minutes. Want me to get you on
          her calendar?&rdquo;
        </p>
      </>
    ),
  },
  {
    key: 'tavlp',
    label: 'Tax Avatar Pro',
    color: '#EC4899',
    body: (
      <>
        <p>
          &ldquo;Do you have a YouTube channel for your practice? Most tax pros don&apos;t — it
          takes too much time.&rdquo;
        </p>
        <p>
          &ldquo;JLW has a service called Tax Avatar Pro. She creates an AI avatar — it looks
          and sounds like a real presenter — and publishes tax content on YouTube every week
          under your firm&apos;s name.&rdquo;
        </p>
        <p>
          &ldquo;Your clients and prospects find you through search. The videos drive them to
          your intake page. You never record a single thing.&rdquo;
        </p>
        <p>
          &ldquo;She can set up a channel for you in about a month. Want me to book 15 minutes
          so she can show you a sample?&rdquo;
        </p>
      </>
    ),
  },
  {
    key: 'tttmp',
    label: 'Tax Tools Arcade',
    color: '#8B5CF6',
    body: (
      <>
        <p>
          &ldquo;Have you ever tried to explain estimated tax penalties or Form 2848 to a
          client? It&apos;s painful.&rdquo;
        </p>
        <p>
          &ldquo;JLW built an interactive game arcade — Tax Tools Arcade — where your clients
          can learn tax concepts by playing through them. Form 2848 walkthrough, penalty
          calculators, filing requirement quizzes.&rdquo;
        </p>
        <p>
          &ldquo;You share a link, they play through it, and they show up to your next
          appointment actually understanding what&apos;s going on.&rdquo;
        </p>
        <p>
          &ldquo;It&apos;s token-based — you buy a pack and share access. Want me to book 15
          minutes so she can walk you through it?&rdquo;
        </p>
      </>
    ),
  },
  {
    key: 'ttmp',
    label: 'Transcript AI',
    color: '#14B8A6',
    body: (
      <>
        <p>&ldquo;How long does it take you to read an IRS transcript? 15, 20 minutes?&rdquo;</p>
        <p>
          &ldquo;JLW has a tool called Transcript Tax Monitor Pro. You upload the transcript
          PDF, and in seconds it gives you a plain-English analysis — every transaction code
          explained, every hold flagged, every date interpreted.&rdquo;
        </p>
        <p>
          &ldquo;It costs one token per transcript. No subscription required — buy 10 for $19,
          use them when you need them.&rdquo;
        </p>
        <p>
          &ldquo;Want me to book 15 minutes so she can show you a sample report?&rdquo;
        </p>
      </>
    ),
  },
  {
    key: 'vlp',
    label: 'Virtual Launch Pro',
    color: '#F97316',
    body: (
      <>
        <p>
          &ldquo;Are you getting enough client inquiries? Not leads from some random service —
          actual taxpayers in your area looking for someone with your credential.&rdquo;
        </p>
        <p>
          &ldquo;JLW runs a platform called Virtual Launch Pro. It includes a directory where
          taxpayers search by city, credential, and service type. You set up a profile, toggle
          it on, and start getting matched with people who need your help.&rdquo;
        </p>
        <p>
          &ldquo;It also includes a client pool — pre-qualified, pre-paid cases that show up in
          your dashboard. You claim the ones that fit your practice.&rdquo;
        </p>
        <p>
          &ldquo;Want me to book 15 minutes so she can show you how it works?&rdquo;
        </p>
      </>
    ),
  },
];

export function ProductPitchTabs({
  onBookIt,
  onStillNo,
}: {
  onBookIt: () => void;
  onStillNo: () => void;
}) {
  const [active, setActive] = useState<ProductKey>('tcvlp');
  const product = PRODUCTS.find((p) => p.key === active)!;

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Pick a product to pitch</h2>
        <span className="text-xs uppercase tracking-widest text-white/40">Pitch</span>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {PRODUCTS.map((p) => {
          const isActive = p.key === active;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setActive(p.key)}
              className="rounded-full border px-4 py-2 text-sm font-semibold transition"
              style={{
                borderColor: isActive ? p.color : 'rgba(255,255,255,0.12)',
                background: isActive ? `${p.color}26` : 'transparent',
                color: isActive ? p.color : 'rgba(255,255,255,0.6)',
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <div
        className="rounded-lg border p-5"
        style={{
          borderColor: `${product.color}4d`,
          background: `${product.color}0a`,
        }}
      >
        <div
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: product.color }}
        >
          {product.label} script
        </div>
        <div className="space-y-3 text-[15px] leading-relaxed text-white/80">
          {product.body}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBookIt}
          className="w-full min-h-[56px] rounded-md bg-[#22C55E] px-4 text-base font-bold text-white hover:bg-[#16A34A]"
        >
          They&apos;re in — Book It
        </button>
        <button
          type="button"
          onClick={onStillNo}
          className="w-full min-h-[56px] rounded-md border border-white/15 px-4 text-base font-semibold text-white/70 hover:text-white"
        >
          Still not interested
        </button>
      </div>
    </div>
  );
}
