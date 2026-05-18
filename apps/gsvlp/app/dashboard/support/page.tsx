'use client';

import { useEffect } from 'react';
import { useAppShell } from '@vlp/member-ui';
import { Phone, MessageCircle, Linkedin, Facebook, Calendar } from 'lucide-react';

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
  const calNamespace = config.calIntroNamespace;
  const calSlug = config.calIntroSlug;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.Cal && !document.getElementById('cal-embed-init')) {
      const initScript = document.createElement('script');
      initScript.id = 'cal-embed-init';
      initScript.text = `(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");`;
      document.head.appendChild(initScript);
    }

    const cal = window.Cal;
    if (!cal) return;
    cal('init', calNamespace, { origin: 'https://app.cal.com' });
    const ns = cal.ns[calNamespace];
    if (ns) {
      ns('ui', {
        cssVarsPerTheme: {
          light: { 'cal-brand': '#292929' },
          dark: { 'cal-brand': '#f97316' },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    }
  }, [calNamespace]);

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
        <h2 className="text-lg font-semibold text-white mb-1">Need help?</h2>
        <p className="text-sm text-white/55 mb-4">
          Book a 15-minute call with JLW.
        </p>
        <button
          type="button"
          data-cal-link={calSlug}
          data-cal-namespace={calNamespace}
          data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#f97316] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ea6c0a] sm:w-auto"
        >
          <Calendar className="h-4 w-4" />
          Book a Call with JLW
        </button>
      </section>
    </div>
  );
}
