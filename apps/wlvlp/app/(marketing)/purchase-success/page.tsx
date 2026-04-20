'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PurchaseBeacon } from '@vlp/member-ui';

const PAGE_BG = 'min-h-screen flex flex-col';
const NAV = 'sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-border-subtle';
const NAV_INNER = 'max-w-[960px] mx-auto px-6 h-[60px] flex items-center';
const NAV_LOGO = 'font-sora font-extrabold text-[1.2rem] text-brand-primary no-underline [text-shadow:0_0_20px_rgba(168,85,247,0.5)]';
const MAIN = 'flex-1 flex flex-col items-center justify-center py-[60px] px-6 gap-5 text-center max-w-[600px] mx-auto';
const ICON = 'text-[5rem] [filter:drop-shadow(0_0_24px_rgba(168,85,247,0.4))]';
const TITLE = 'font-sora text-[2.4rem] font-extrabold text-white tracking-tight';
const DESC = 'text-white/70 text-[1.05rem] leading-relaxed';
const REF_NOTE = 'text-white/40 text-[0.82rem]';
const PRIMARY_BTN = 'inline-block px-7 py-[13px] bg-brand-primary text-white font-bold text-[0.92rem] rounded-lg no-underline transition-all shadow-brand hover:-translate-y-0.5';
const SECONDARY_BTN = 'inline-block px-7 py-[13px] bg-transparent text-brand-primary font-semibold text-[0.92rem] rounded-lg no-underline border border-brand-primary/40 transition-all hover:border-brand-primary hover:bg-brand-primary/10';

function PurchaseSuccessInner() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');

  return (
    <div className={PAGE_BG}>
      <PurchaseBeacon app="wlvlp" sessionId={sessionId ?? undefined} />
      <nav className={NAV}>
        <div className={NAV_INNER}>
          <Link href="/" className={NAV_LOGO}>Website Lotto</Link>
        </div>
      </nav>
      <main className={MAIN}>
        <div className={ICON}>🎉</div>
        <h1 className={TITLE}>Your site has been claimed</h1>
        <p className={DESC}>
          We&apos;ll set it up and send you access details within 24 hours.
        </p>
        {sessionId && (
          <p className={REF_NOTE}>
            Reference: <code className="bg-white/5 px-2 py-0.5 rounded font-mono">{sessionId}</code>
          </p>
        )}
        <div className="flex gap-3 flex-wrap justify-center mt-3">
          <Link href="/" className={PRIMARY_BTN}>Back to Marketplace</Link>
          <Link href="/dashboard" className={SECONDARY_BTN}>Go to Dashboard</Link>
        </div>
      </main>
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={<div className={PAGE_BG} />}>
      <PurchaseSuccessInner />
    </Suspense>
  );
}
