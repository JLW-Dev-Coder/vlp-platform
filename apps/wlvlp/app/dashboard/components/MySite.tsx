'use client';
import { useBuyer } from '@/lib/account-context';

export default function MySite() {
  const { data: dashboard } = useBuyer();
  if (!dashboard) return null;
  const { template } = dashboard;
  const siteUrl = `https://${template.slug}.websitelotto.virtuallaunch.pro`;
  return (
    <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-7 flex flex-col gap-5">
      <h2 className="font-sora text-[1.3rem] font-bold text-brand-primary -tracking-[0.3px] m-0">My Site</h2>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="font-sora text-[1.1rem] font-semibold text-white">{template.title}</div>
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-brand-primary/10 border border-brand-primary/35 rounded-md text-brand-primary font-semibold text-[0.85rem] no-underline transition-all hover:bg-brand-primary/20 hover:border-brand-primary"
        >
          Visit My Site ↗
        </a>
      </div>
      <div className="relative w-full pt-[60%] rounded-[10px] overflow-hidden border border-white/[0.08] bg-surface-bg">
        <iframe
          src={siteUrl}
          className="absolute inset-0 w-full h-full border-0"
          title="Site Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
