'use client';

import { useEffect } from 'react';

interface StatCardData {
  big: string;
  label: string;
  explanation: string;
  color: 'green' | 'gold' | 'white';
}

const STATS: StatCardData[] = [
  { big: '50', label: 'Dials per day', explanation: "2 hours of focused calling. That's your target.", color: 'green' },
  { big: '10', label: 'Conversations', explanation: "Out of 50 dials, you'll talk to 8–12 real people.", color: 'green' },
  { big: '1–3', label: 'Appointments', explanation: 'Per 50 dials. One good day = 3 bookings.', color: 'gold' },
  { big: '2.5%', label: 'Average rate', explanation: 'Industry average cold call to meeting. You can beat this.', color: 'white' },
  { big: '5–8%', label: 'Top performers', explanation: 'The best setters book 1 in every 12–20 calls.', color: 'gold' },
  { big: '65%', label: 'Once talking', explanation: 'If they pick up and you deliver the script, 65% book.', color: 'green' },
];

const COLOR_MAP = {
  green: '#22C55E',
  gold: '#F59E0B',
  white: '#FFFFFF',
} as const;

type DayCell = 'best' | 'good' | 'ok' | 'weak';
const DAY_GRID: { row: 'Morning (9–12)' | 'Afternoon (3–5)'; cells: DayCell[] }[] = [
  { row: 'Morning (9–12)', cells: ['ok', 'good', 'good', 'good', 'ok'] },
  { row: 'Afternoon (3–5)', cells: ['ok', 'best', 'best', 'best', 'weak'] },
];

const CELL_STYLE: Record<DayCell, { bg: string; label: string; text: string }> = {
  best: { bg: '#22C55E', label: 'Best', text: '#0A0A0A' },
  good: { bg: 'rgba(34,197,94,0.45)', label: 'Good', text: '#FFFFFF' },
  ok: { bg: 'rgba(255,255,255,0.08)', label: 'OK', text: 'rgba(255,255,255,0.6)' },
  weak: { bg: 'rgba(255,255,255,0.03)', label: 'Weak', text: 'rgba(255,255,255,0.3)' },
};

const PERSISTENCE_STEPS = [
  { label: 'Attempt 1', desc: 'Most setters stop here', fill: 15 },
  { label: 'Attempt 2', desc: 'Still early', fill: 30 },
  { label: 'Attempt 3', desc: 'Getting warmer', fill: 50 },
  { label: 'Attempt 4', desc: '80% of prospects say no 4 times first', fill: 70 },
  { label: 'Attempt 5', desc: 'The majority quit by now', fill: 85 },
  { label: 'Attempt 6+', desc: '93% of conversions happen here', fill: 100, bold: true },
];

const MATH_LINES = [
  { text: '50 dials × 2.5% = 1.25 appointments/day', highlight: false },
  { text: '1.25 appointments × 5 days = 6.25 appointments/week', highlight: false },
  { text: 'If JLW closes 50% = 3 deals/week', highlight: false },
  { text: 'Average deal = $500', highlight: false },
  { text: 'Your 20% = $100/deal × 3 = $300/week', highlight: false },
  { text: '$300/week × 4 = $1,200/month', highlight: false },
];

export default function MotivationPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://tenor.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      try { document.body.removeChild(script); } catch {}
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-white">Motivation</h1>
        <p className="mt-1 text-sm text-white/50">
          The numbers, the timing, and the persistence that turn dials into deals.
        </p>
      </header>

      {/* Section 1 — GIF */}
      <section className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
        <div
          className="tenor-gif-embed"
          data-postid="21860312"
          data-share-method="host"
          data-aspect-ratio="1.77778"
          data-width="100%"
        >
          <a href="https://tenor.com/view/bonfire-bonfire-token-wolf-of-wall-street-buy-start-buying-gif-21860312">
            Bonfire Bonfire Token GIF
          </a>{' '}
          from <a href="https://tenor.com/search/bonfire-gifs">Bonfire GIFs</a>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          Every dial gets you closer.
        </h2>
      </section>

      {/* Section 2 — The Numbers That Matter */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">The Numbers That Matter</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6"
            >
              <div
                className="text-4xl font-bold"
                style={{ color: COLOR_MAP[s.color] }}
              >
                {s.big}
              </div>
              <div className="mt-2 text-sm font-semibold text-white">{s.label}</div>
              <div className="mt-1 text-xs text-white/50">{s.explanation}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 — When to Call */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">Best times to call</h2>
        <div className="overflow-x-auto rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr>
                <th className="px-2 py-2 text-left text-xs uppercase tracking-widest text-white/40" />
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => (
                  <th key={d} className="px-2 py-2 text-center text-xs uppercase tracking-widest text-white/60">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAY_GRID.map((r) => (
                <tr key={r.row}>
                  <td className="px-2 py-2 text-xs font-semibold text-white/70">{r.row}</td>
                  {r.cells.map((c, i) => {
                    const style = CELL_STYLE[c];
                    return (
                      <td key={i} className="p-1">
                        <div
                          className="flex h-12 items-center justify-center rounded text-xs font-bold"
                          style={{ background: style.bg, color: style.text }}
                        >
                          {style.label}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-white/70">
          Wednesday and Thursday afternoons between 3–5 PM are your sweet spot.
        </p>
      </section>

      {/* Section 4 — Persistence */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">The Persistence Rule</h2>
        <div className="space-y-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
          {PERSISTENCE_STEPS.map((step) => (
            <div key={step.label}>
              <div className="flex items-center justify-between text-sm">
                <span
                  className={step.bold ? 'font-bold text-white' : 'font-semibold text-white/80'}
                >
                  {step.label}
                </span>
                <span
                  className={
                    step.bold ? 'text-sm font-bold text-[#22C55E]' : 'text-xs text-white/50'
                  }
                >
                  {step.desc}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded bg-white/[0.04]">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${step.fill}%`,
                    background: '#22C55E',
                    opacity: step.bold ? 1 : 0.55,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-base font-bold text-white">
          Most setters quit after 1–2 tries. The ones who keep going are the ones who earn.
        </p>
      </section>

      {/* Section 5 — Quick Math */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-white">Quick Math</h2>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6 font-mono text-sm">
          {MATH_LINES.map((line, i) => (
            <div
              key={i}
              className="border-l-2 border-white/10 py-2 pl-4 text-white/80"
              style={{ marginLeft: `${i * 8}px` }}
            >
              {line.text}
            </div>
          ))}
          <div
            className="mt-4 rounded-md p-4 text-center text-2xl font-bold"
            style={{ background: 'rgba(245,158,11,0.10)', color: '#F59E0B' }}
          >
            $1,200/month from 2 hours a day
          </div>
        </div>
        <p className="mt-3 text-sm text-white/50">
          These are conservative estimates. Top performers earn 2–3x this.
        </p>
      </section>
    </div>
  );
}
