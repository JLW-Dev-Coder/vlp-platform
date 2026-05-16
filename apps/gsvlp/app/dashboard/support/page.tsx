'use client';

import { useEffect } from 'react';
import { useAppShell } from '@vlp/member-ui';
import { Phone, MessageCircle, Linkedin, Facebook } from 'lucide-react';

declare global {
  interface Window {
    Cal?: {
      (action: string, ...args: unknown[]): void;
      ns: Record<string, (action: string, ...args: unknown[]) => void>;
      loaded?: boolean;
    };
  }
}

export default function SupportPage() {
  const { config } = useAppShell();
  const brandColor = config.brandColor || '#22C55E';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initCal = () => {
      if (!window.Cal) return;
      window.Cal('init', 'gsvlp-support', { origin: 'https://app.cal.com' });
      window.Cal.ns['gsvlp-support']('ui', {
        cssVarsPerTheme: {
          light: { 'cal-brand': '#292929' },
          dark: { 'cal-brand': brandColor },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    };

    if (window.Cal) {
      initCal();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    script.onload = initCal;
    document.head.appendChild(script);
  }, [brandColor]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Support</h1>
        <p className="mt-1 text-sm text-white/50">
          Get in touch with JLW directly.
        </p>
      </header>

      <section className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Contact JLW</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="tel:+16198005457"
            className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Phone className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Phone</p>
              <p className="text-sm text-white/55">+1 (619) 800-5457</p>
            </div>
          </a>

          <a
            href="https://t.me/virtuallaunchpro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <MessageCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Telegram</p>
              <p className="text-sm text-white/55">@virtuallaunchpro</p>
            </div>
          </a>

          <a
            href="https://www.linkedin.com/in/virtuallaunchpro/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10">
              <Linkedin className="h-5 w-5 text-sky-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">LinkedIn</p>
              <p className="text-sm text-white/55">virtuallaunchpro</p>
            </div>
          </a>

          <a
            href="https://www.facebook.com/jamie.l.williams.10"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.06]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
              <Facebook className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Facebook</p>
              <p className="text-sm text-white/55">Jamie L. Williams</p>
            </div>
          </a>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-semibold text-white mb-1">Book a Support Call</h2>
        <p className="text-sm text-white/55 mb-4">
          Schedule a call with JLW to discuss any questions or issues.
        </p>
        <button
          type="button"
          data-cal-link="tax-monitor-pro/gsvlp-support"
          data-cal-namespace="gsvlp-support"
          data-cal-config='{"layout":"month_view"}'
          className="rounded-md bg-green-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-green-400"
        >
          Book a Call
        </button>
      </section>
    </div>
  );
}
