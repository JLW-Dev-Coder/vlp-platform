'use client';

import { useEffect, useState } from 'react';
import { useAppShell } from '@vlp/member-ui';
import {
  buildProductVars,
  DEFAULT_PRODUCT_ID,
  getActiveScript,
  getProductById,
  renderTemplate,
} from '@/lib/scripts';

const LAST_PRODUCT_KEY = 'gsvlp:lastProduct';

type Outcome = 'yes' | 'maybe' | 'no';

function firstName(session: { email: string | null }): string {
  if (!session.email) return 'there';
  const local = session.email.split('@')[0];
  const first = local.split(/[._-]/)[0];
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : 'there';
}

export function ScriptCard() {
  const { session } = useAppShell();
  const script = getActiveScript(session.email);
  const preview = script.dashboardPreview;
  const setterName = firstName(session);

  const responseKey = (label: 'No' | 'Maybe' | 'Yes'): Outcome =>
    label.toLowerCase() as Outcome;
  const defaultActive: Outcome = preview.responseOptions.includes('Yes') ? 'yes' : responseKey(preview.responseOptions[0]);
  const [active, setActive] = useState<Outcome>(defaultActive);

  const [productId, setProductId] = useState<string>(DEFAULT_PRODUCT_ID);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LAST_PRODUCT_KEY);
      if (saved) setProductId(saved);
    } catch {
      // ignore
    }
  }, []);
  const product = getProductById(productId);

  const vars = {
    setter_name: setterName,
    full_name: '[Tax Pro Name]',
    firm_name: '[Firm Name]',
    credential: 'CPAs / EAs / tax attorneys',
    state: '[State]',
    first_name: '[First Name]',
    ...buildProductVars(product),
  };

  const renderLines = (lines: string[]) =>
    lines.map((line, i) => (
      <p key={i} className={i > 0 ? 'mt-2' : undefined}>
        &ldquo;{renderTemplate(line, vars)}&rdquo;
      </p>
    ));

  const pillBase =
    'rounded-full px-4 py-1.5 text-sm font-medium border transition';
  const pillStyles: Record<Outcome, { active: string }> = {
    no: { active: 'bg-white/[0.08] border-white/30 text-white' },
    maybe: { active: 'border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10' },
    yes: { active: 'border-[#22C55E] text-[#22C55E] bg-[#22C55E]/10' },
  };
  const inactive = 'bg-transparent border-white/10 text-white/50 hover:text-white/80';

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Your Script</h2>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
          <span>{preview.label}</span>
          <span aria-hidden>·</span>
          <span className="text-[#22C55E]">{product.shortName}</span>
        </div>
      </div>

      <div className="space-y-3 text-[15px] leading-relaxed text-white/80">
        {renderLines(preview.opening)}
      </div>

      <div className="mt-6 mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
        How did they respond?
      </div>

      <div className="flex flex-wrap gap-2" role="tablist">
        {preview.responseOptions.map((label) => {
          const key = responseKey(label);
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              aria-pressed={isActive}
              className={`${pillBase} ${isActive ? pillStyles[key].active : inactive}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-md border border-white/[0.06] bg-black/20 p-4 text-[15px] leading-relaxed text-white/80">
        {renderLines(preview.followUp[active])}
      </div>
    </div>
  );
}
