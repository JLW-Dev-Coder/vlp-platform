'use client';

import { useEffect, useMemo, useState } from 'react';
import type { GsvlpScript, ScriptLine, ScriptStep, TemplateVars } from '@/lib/scripts';
import { renderTemplate } from '@/lib/scripts';

const VIEW_PREF_KEY = 'gsvlp:scriptView';
type ViewMode = 'guided' | 'full';

function TemplatedText({ text, vars }: { text: string; vars: TemplateVars }) {
  const rendered = renderTemplate(text, vars);
  const parts = rendered.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^\[[^\]]+\]$/.test(part)) {
          return (
            <strong key={i} className="text-[#22C55E]">
              {part}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function StepBody({ step, vars }: { step: ScriptStep; vars: TemplateVars }) {
  const nonObjectionLines = step.lines.filter((l) => l.type !== 'objection');
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-white/80">
      {nonObjectionLines.map((line, i) => {
        if (line.type === 'say') {
          return (
            <p key={i}>
              &ldquo;<TemplatedText text={line.text} vars={vars} />&rdquo;
            </p>
          );
        }
        if (line.type === 'instruction') {
          return (
            <p key={i} className="text-sm italic text-white/50">
              {line.text}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

function ObjectionList({ lines, vars }: { lines: ScriptLine[]; vars: TemplateVars }) {
  const objections = lines.filter((l) => l.type === 'objection') as Array<
    Extract<ScriptLine, { type: 'objection' }>
  >;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (objections.length === 0) return null;
  return (
    <div className="space-y-2">
      {objections.map((o, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-md border border-white/[0.08] bg-black/30"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/[0.04]"
            >
              <span>&ldquo;{o.objectionLabel}&rdquo;</span>
              <span aria-hidden className="text-white/40">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="border-t border-white/[0.06] px-4 py-3 text-[15px] leading-relaxed text-white/80">
                <p>
                  &ldquo;<TemplatedText text={o.text} vars={vars} />&rdquo;
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FullStepBlock({ step, vars }: { step: ScriptStep; vars: TemplateVars }) {
  const hasObjections = step.lines.some((l) => l.type === 'objection');
  return (
    <section className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Step {step.number} — {step.title}
        </h2>
        <span className="text-xs uppercase tracking-widest text-white/40">Script</span>
      </div>
      <StepBody step={step} vars={vars} />
      {hasObjections && (
        <div className="mt-4">
          <ObjectionList lines={step.lines} vars={vars} />
        </div>
      )}
    </section>
  );
}

function GuidedView({
  steps,
  vars,
  allObjections,
  onOpenObjections,
}: {
  steps: ScriptStep[];
  vars: TemplateVars;
  allObjections: Array<Extract<ScriptLine, { type: 'objection' }>>;
  onOpenObjections: () => void;
}) {
  const [index, setIndex] = useState(0);
  const safeIndex = Math.min(index, steps.length - 1);
  const step = steps[safeIndex];
  const isLast = safeIndex === steps.length - 1;

  function go(delta: number) {
    setIndex((i) => Math.max(0, Math.min(steps.length - 1, i + delta)));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-widest text-white/50">
          Step {step.number} of {steps.length}
        </div>
        {allObjections.length > 0 && (
          <button
            type="button"
            onClick={onOpenObjections}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#F59E0B]/40 bg-[#F59E0B]/[0.08] px-3 py-1 text-xs font-semibold text-[#F59E0B] hover:bg-[#F59E0B]/[0.16]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 9v4M12 17h.01" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Objections ({allObjections.length})
          </button>
        )}
      </div>

      <section className="rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/[0.04] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{step.title}</h2>
        </div>
        <StepBody step={step} vars={vars} />
        {step.lines.some((l) => l.type === 'objection') && (
          <div className="mt-5 rounded-md border border-white/[0.06] bg-black/20 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
              Objections at this step
            </div>
            <ObjectionList lines={step.lines} vars={vars} />
          </div>
        )}
      </section>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={safeIndex === 0}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Back
        </button>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {steps.map((s, i) => (
            <button
              key={s.number}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to step ${s.number}: ${s.title}`}
              className={`h-2 w-6 rounded-full transition ${
                i === safeIndex
                  ? 'bg-[#22C55E]'
                  : i < safeIndex
                    ? 'bg-[#22C55E]/40'
                    : 'bg-white/15 hover:bg-white/25'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={isLast}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md bg-[#22C55E] px-4 text-sm font-bold text-black hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function ObjectionsDrawer({
  objections,
  vars,
  onClose,
}: {
  objections: Array<Extract<ScriptLine, { type: 'objection' }>>;
  vars: TemplateVars;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        aria-label="Close objections panel"
        onClick={onClose}
        className="flex-1 bg-black/60"
      />
      <aside className="w-full max-w-md overflow-y-auto bg-[#0a0a0a] p-6 shadow-2xl ring-1 ring-white/10 sm:w-[28rem]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Objection Handler</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mb-4 text-xs text-white/50">
          Tap any objection to see how to respond. Closing this panel returns you to your current step.
        </p>
        <ObjectionList lines={objections} vars={vars} />
      </aside>
    </div>
  );
}

export function CallScript({
  script,
  vars,
  productLabel,
}: {
  script: GsvlpScript;
  vars: TemplateVars;
  productLabel?: string;
}) {
  const [mode, setMode] = useState<ViewMode>('guided');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(VIEW_PREF_KEY);
      if (saved === 'full' || saved === 'guided') setMode(saved);
    } catch {
      // ignore
    }
  }, []);

  function toggleMode() {
    const next: ViewMode = mode === 'guided' ? 'full' : 'guided';
    setMode(next);
    try {
      window.localStorage.setItem(VIEW_PREF_KEY, next);
    } catch {
      // ignore
    }
  }

  const allObjections = useMemo(() => {
    const out: Array<Extract<ScriptLine, { type: 'objection' }>> = [];
    for (const step of script.callDetail.steps) {
      for (const line of step.lines) {
        if (line.type === 'objection') out.push(line);
      }
    }
    return out;
  }, [script]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest">
          <span
            className="rounded-full px-3 py-1"
            style={{
              background: script.role === 'closer' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
              color: script.role === 'closer' ? '#22C55E' : '#F59E0B',
            }}
          >
            {script.role === 'closer' ? 'CLOSER' : 'SETTER'} SCRIPT
          </span>
          {productLabel && (
            <span className="rounded-full bg-white/[0.06] px-3 py-1 text-white/70">
              {productLabel}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={toggleMode}
          className="text-xs font-semibold text-white/60 underline-offset-2 hover:text-white hover:underline"
        >
          {mode === 'guided' ? 'View full script' : 'View step-by-step'}
        </button>
      </div>

      {mode === 'guided' ? (
        <GuidedView
          steps={script.callDetail.steps}
          vars={vars}
          allObjections={allObjections}
          onOpenObjections={() => setDrawerOpen(true)}
        />
      ) : (
        script.callDetail.steps.map((step) => (
          <FullStepBlock key={step.number} step={step} vars={vars} />
        ))
      )}

      {drawerOpen && (
        <ObjectionsDrawer
          objections={allObjections}
          vars={vars}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
}
