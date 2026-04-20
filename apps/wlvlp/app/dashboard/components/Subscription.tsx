'use client';
import { logout } from '@/lib/api';
import { useBuyer } from '@/lib/account-context';
import { useRouter } from 'next/navigation';

export default function Subscription() {
  const { data: dashboard } = useBuyer();
  const router = useRouter();

  if (!dashboard) return null;
  const { subscription_status, stripe_portal_url } = dashboard;

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  const statusClass = subscription_status === 'active'
    ? 'bg-[rgba(34,197,94,0.12)] text-[var(--color-success)] border border-[rgba(34,197,94,0.3)]'
    : 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)] border border-[rgba(239,68,68,0.25)]';

  return (
    <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-7 flex flex-col gap-5">
      <h2 className="font-sora text-[1.3rem] font-bold text-brand-primary -tracking-[0.3px] m-0">Hosting</h2>
      <div className="flex items-center gap-3.5 flex-wrap">
        <div className="font-sora text-base font-semibold text-white">Website Lotto · 12 months included</div>
        <div className={`px-3 py-[3px] rounded-full text-[0.78rem] font-semibold ${statusClass}`}>
          {subscription_status}
        </div>
      </div>
      {stripe_portal_url && (
        <a
          href={stripe_portal_url}
          className="inline-block px-5 py-2.5 bg-brand-primary/10 border border-brand-primary/35 rounded-lg text-brand-primary font-semibold text-[0.88rem] no-underline transition-all w-fit hover:bg-brand-primary/20 hover:border-brand-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Manage Billing ↗
        </a>
      )}
      <div className="bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.15)] rounded-[10px] px-4 py-3.5">
        <p className="text-white/55 text-[0.85rem] leading-relaxed">
          Your one-time purchase includes 12 months of hosting. After that, hosting continues at $14/mo (standard) or $49/mo (premium with content updates, SEO, and priority support).
        </p>
      </div>
      <button
        className="px-5 py-2.5 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)] rounded-lg text-[var(--color-error)] font-semibold text-[0.88rem] cursor-pointer transition-all w-fit hover:bg-[rgba(239,68,68,0.15)] hover:border-[var(--color-error)]"
        onClick={handleLogout}
      >
        Sign Out
      </button>
    </div>
  );
}
