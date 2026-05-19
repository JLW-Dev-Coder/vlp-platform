'use client';

import { useState } from 'react';
import type { GsvlpScript, ScriptLine, TemplateVars } from '@/lib/scripts';
import { renderTemplate } from '@/lib/scripts';

function TemplatedText({ text, vars }: { text: string; vars: TemplateVars }) {
  const rendered = renderTemplate(text, vars);
  const parts = rendered.split(/(\{[^}]+\}|\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^\{[^}]+\}$/.test(part) || /^\[[^\]]+\]$/.test(part)) {
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

function ObjectionAccordion({ lines, vars }: { lines: ScriptLine[]; vars: TemplateVars }) {
  const objections = lines.filter((l) => l.type === 'objection') as Array<
    Extract<ScriptLine, { type: 'objection' }>
  >;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {objections.map((o, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-md border border-white/[0.08] bg-black/20"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-white/[0.03]"
            >
              <span>&ldquo;{o.objectionLabel}&rdquo;</span>
              <span aria-hidden className="text-white/40">
                {isOpen ? '−' : '+'}
              </span>
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

function StepBlock({ step, vars }: { step: GsvlpScript['callDetail']['steps'][number]; vars: TemplateVars }) {
  const nonObjectionLines = step.lines.filter((l) => l.type !== 'objection');
  const hasObjections = step.lines.some((l) => l.type === 'objection');

  return (
    <section className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Step {step.number} — {step.title}
        </h2>
        <span className="text-xs uppercase tracking-widest text-white/40">Script</span>
      </div>
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
        {hasObjections && <ObjectionAccordion lines={step.lines} vars={vars} />}
      </div>
    </section>
  );
}

export function CallScript({
  script,
  vars,
}: {
  script: GsvlpScript;
  vars: TemplateVars;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
        <span
          className="rounded-full px-3 py-1"
          style={{
            background: script.role === 'closer' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
            color: script.role === 'closer' ? '#22C55E' : '#F59E0B',
          }}
        >
          {script.role === 'closer' ? 'CLOSER' : 'SETTER'} SCRIPT
        </span>
      </div>
      {script.callDetail.steps.map((step) => (
        <StepBlock key={step.number} step={step} vars={vars} />
      ))}
    </div>
  );
}
