'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppShell } from '@vlp/member-ui';
import {
  getMySites,
  getScratchPrizes,
  getMyBids,
  getMyVotes,
  type PurchasedSite,
} from '@/lib/api';

const MAIN = 'flex-1 w-full pb-16';
const SECTION_TITLE = 'font-sora text-xs font-bold uppercase tracking-wider text-white/50 mb-3';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  href: string;
  color: 'blue' | 'yellow' | 'magenta' | 'cyan';
  external?: boolean;
}

function StatCard({ icon, label, value, href, color, external }: StatCardProps) {
  const accent = {
    blue: 'border-neon-blue/30 hover:border-neon-blue/60 text-neon-blue',
    yellow: 'border-neon-yellow/30 hover:border-neon-yellow/60 text-neon-yellow',
    magenta: 'border-neon-magenta/30 hover:border-neon-magenta/60 text-neon-magenta',
    cyan: 'border-neon-cyan/30 hover:border-neon-cyan/60 text-neon-cyan',
  }[color];
  const className = `glass-card rounded-2xl p-5 border flex flex-col gap-2 transition-all hover:-translate-y-0.5 no-underline ${accent}`;
  const body = (
    <>
      <div className="text-3xl leading-none">{icon}</div>
      <div className={`font-sora text-2xl font-extrabold ${accent}`}>{value}</div>
      <div className="text-white/60 text-[0.85rem] font-medium">{label}</div>
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }
  return <Link href={href} className={className}>{body}</Link>;
}

export default function DashboardPage() {
  const { session } = useAppShell();
  const accountId = session.account_id;
  const firstName = (session as { first_name?: string; name?: string }).first_name
    || (session as { name?: string }).name
    || '';
  const [sites, setSites] = useState<PurchasedSite[] | null>(null);
  const [scratchCount, setScratchCount] = useState<number | null>(null);
  const [voteCount, setVoteCount] = useState<number | null>(null);
  const [bidCount, setBidCount] = useState<number | null>(null);

  useEffect(() => {
    if (!accountId) return;
    getMySites(accountId).then(setSites).catch(() => setSites([]));
    getScratchPrizes(accountId).then(p => setScratchCount(p.length)).catch(() => setScratchCount(0));
    getMyVotes(accountId).then(v => setVoteCount(v.length)).catch(() => setVoteCount(0));
    getMyBids(accountId)
      .then(b => setBidCount(b.filter(x => x.template_status === 'auction').length))
      .catch(() => setBidCount(0));
  }, [accountId]);

  const siteCount = sites?.length ?? 0;
  const fmt = (n: number | null) => (n === null ? '—' : n);

  return (
    <main className={MAIN}>
      <header className="mb-7">
        <h1 className="font-sora text-3xl font-extrabold text-white mt-0 mb-2 -tracking-[0.5px]">
          Welcome{firstName ? `, ${firstName}` : ''} to Website Lotto
        </h1>
        <p className="text-white/55 text-[0.95rem] m-0">
          Your neon-lit control room — claim sites, scratch tickets, and track everything here.
        </p>
      </header>

      <section className="mb-10">
        <h2 className={SECTION_TITLE}>Your Activity</h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <StatCard icon="🎰" label="My Sites" value={siteCount} href="/dashboard/sites" color="blue" />
          <StatCard icon="🎫" label="Scratch Tickets" value={fmt(scratchCount)} href="/scratch/" color="yellow" external />
          <StatCard icon="📊" label="Votes Cast" value={fmt(voteCount)} href="/dashboard/voting" color="magenta" />
          <StatCard icon="💰" label="Active Bids" value={fmt(bidCount)} href="/dashboard/bidding" color="cyan" />
        </div>
      </section>

      <section className="mb-10">
        <h2 className={SECTION_TITLE}>Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-neon-yellow text-[#07070A] font-bold text-[0.9rem] no-underline btn-glow-yellow hover:-translate-y-0.5 transition-transform"
          >
            🎨 Browse Templates
          </a>
          <a
            href="/scratch/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[rgba(0,212,255,0.08)] border border-neon-blue/40 text-neon-blue font-bold text-[0.9rem] no-underline hover:-translate-y-0.5 transition-transform"
          >
            🎫 Free Scratch Ticket
          </a>
          <Link
            href="/dashboard/affiliate"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[rgba(255,45,138,0.08)] border border-neon-magenta/40 text-neon-magenta font-bold text-[0.9rem] no-underline hover:-translate-y-0.5 transition-transform"
          >
            🤝 Refer a Friend
          </Link>
        </div>
      </section>

      {sites && sites.length > 0 && (
        <section>
          <h2 className={SECTION_TITLE}>Recent Sites</h2>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
            {sites.slice(0, 4).map(s => (
              <Link
                key={s.slug}
                href={`/dashboard/sites/${s.slug}/edit`}
                className="glass-card neon-border rounded-xl p-4 no-underline hover:-translate-y-0.5 transition-transform"
              >
                <div className="font-sora text-white font-bold text-[0.95rem] mb-1">{s.title}</div>
                <div className="text-white/50 text-[0.78rem] uppercase tracking-wider">{s.category || s.slug}</div>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/dashboard/sites" className="text-neon-blue text-[0.9rem] hover:underline">
              View all sites →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
