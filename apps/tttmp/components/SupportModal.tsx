"use client";

import { useEffect, useCallback } from "react";
import Script from "next/script";
import { tttmpConfig } from "@/lib/platform-config";
import styles from "./SupportModal.module.css";

const CAL_NAMESPACE = tttmpConfig.calBookingNamespace;
const CAL_LINK = tttmpConfig.calBookingSlug;
const CAL_CONFIG = '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}';

interface SupportModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SupportModal({ open, onClose }: SupportModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.close}
          onClick={onClose}
          aria-label="Close support modal"
        >
          &times;
        </button>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem', fontWeight: 600 }}>Schedule Support</p>
          <button
            type="button"
            data-cal-namespace={CAL_NAMESPACE}
            data-cal-link={CAL_LINK}
            data-cal-config={CAL_CONFIG}
            className={styles.supportButton}
          >
            Open scheduler
          </button>
        </div>
      </div>
    </div>
  );
}

interface SupportButtonProps {
  label?: string;
  className?: string;
}

export function SupportButton({
  label = "Schedule Support",
  className,
}: SupportButtonProps) {
  return (
    <button
      type="button"
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-link={CAL_LINK}
      data-cal-config={CAL_CONFIG}
      className={`${styles.supportButton} ${className || ""}`}
    >
      {label}
    </button>
  );
}

export function SupportCalInit() {
  return (
    <Script id="cal-init-tttmp-support" strategy="afterInteractive">{`
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", ${JSON.stringify(CAL_NAMESPACE)}, {origin:"https://app.cal.com"});
Cal.ns[${JSON.stringify(CAL_NAMESPACE)}]("ui", {"cssVarsPerTheme":{"light":{"cal-brand":"#292929"},"dark":{"cal-brand":${JSON.stringify(tttmpConfig.brandColor)}}},"hideEventTypeDetails":false,"layout":"month_view"});
`}</Script>
  );
}
