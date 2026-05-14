'use client';

export function CallScript({
  leadName,
  firmName,
  setterName,
}: {
  leadName: string;
  firmName: string;
  setterName: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Step 1 — Opening</h2>
        <span className="text-xs uppercase tracking-widest text-white/40">Script</span>
      </div>
      <div className="space-y-4 text-[15px] leading-relaxed text-white/80">
        <p>
          &ldquo;Hi, may I speak with{' '}
          <strong className="text-[#22C55E]">{leadName}</strong>? Is this the{' '}
          <strong className="text-[#22C55E]">{firmName}</strong> firm?&rdquo;
        </p>
        <p className="text-sm italic text-white/50">Wait for them to confirm.</p>
        <p>
          &ldquo;Great. I&apos;m <strong className="text-white">{setterName}</strong>.
          I&apos;m working with JLW at Virtual Launch Pro. She helps tax pros like
          you get more clients. Can she show you how in 15 minutes?&rdquo;
        </p>
        <p className="text-sm italic text-white/50">Pause. Let them respond.</p>
      </div>
    </div>
  );
}
