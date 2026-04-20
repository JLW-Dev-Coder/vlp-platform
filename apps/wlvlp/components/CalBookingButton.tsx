'use client';

import { useEffect, type ReactNode } from 'react';
import { wlvlpConfig } from '@/lib/platform-config';

const CAL_CONFIG = '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}';
const CAL_EMBED_SRC = 'https://app.cal.com/embed/embed.js';
const CAL_INIT_SCRIPT_ID = 'cal-embed-init';
const initializedNamespaces = new Set<string>();

declare global {
  interface Window {
    Cal?: {
      (action: string, ...args: unknown[]): void;
      ns: Record<string, (action: string, ...args: unknown[]) => void>;
      loaded?: boolean;
    };
  }
}

function ensureCalLoaded(): void {
  if (typeof window === 'undefined') return;
  if (window.Cal) return;
  if (document.getElementById(CAL_INIT_SCRIPT_ID)) return;
  // Official Cal.com loader snippet — appends embed.js once and stubs window.Cal.
  const initScript = document.createElement('script');
  initScript.id = CAL_INIT_SCRIPT_ID;
  initScript.text = `(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "${CAL_EMBED_SRC}", "init");`;
  document.head.appendChild(initScript);
}

export interface CalBookingButtonProps {
  /** Cal.com slug, e.g. "tax-monitor-pro/wlvlp-intro". Defaults to `wlvlpConfig.calIntroSlug`. */
  calLink?: string;
  /** Cal namespace, e.g. "wlvlp-intro". Defaults to `wlvlpConfig.calIntroNamespace`. */
  namespace?: string;
  /** Dark-mode `cal-brand` override. Defaults to `wlvlpConfig.brandColor`. */
  brandColor?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Element-click Cal.com booking embed. Renders a button that opens the Cal.com
 * popup on click. Loads the embed script lazily on mount; init runs once per
 * namespace per page lifetime.
 *
 * See canonical-app-components.md §11.2 and canonical-cal-events.md §4.
 */
export default function CalBookingButton({
  calLink = wlvlpConfig.calIntroSlug,
  namespace = wlvlpConfig.calIntroNamespace,
  brandColor = wlvlpConfig.brandColor,
  className,
  children,
}: CalBookingButtonProps) {
  useEffect(() => {
    if (initializedNamespaces.has(namespace)) return;
    ensureCalLoaded();
    const cal = window.Cal;
    if (!cal) return;
    cal('init', namespace, { origin: 'https://app.cal.com' });
    const ns = cal.ns[namespace];
    if (ns) {
      ns('ui', {
        cssVarsPerTheme: {
          light: { 'cal-brand': '#292929' },
          dark: { 'cal-brand': brandColor },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    }
    initializedNamespaces.add(namespace);
  }, [namespace, brandColor]);

  return (
    <button
      type="button"
      data-cal-link={calLink}
      data-cal-namespace={namespace}
      data-cal-config={CAL_CONFIG}
      className={className}
    >
      {children}
    </button>
  );
}
