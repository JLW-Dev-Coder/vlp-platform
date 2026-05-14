'use client';

export function TCVLPPitchScript({
  onBookIt,
  onStillNo,
}: {
  onBookIt: () => void;
  onStillNo: () => void;
}) {
  return (
    <div className="rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/[0.04] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Tell them about TaxClaim Pro</h2>
        <span className="text-xs uppercase tracking-widest text-[#F59E0B]">Pitch</span>
      </div>
      <div className="space-y-4 text-[15px] leading-relaxed text-white/80">
        <p>
          &ldquo;So here&apos;s the thing — JLW has this tool called TaxClaim Pro.
          If any of your clients got hit with IRS penalties between January 2020
          and July 2023, there&apos;s a ruling called Kwong v. US that could get
          those penalties wiped.&rdquo;
        </p>
        <p>
          &ldquo;It&apos;s a real court ruling. The deadline to file is July 10,
          2026 — that&apos;s coming up fast.&rdquo;
        </p>
        <p>
          &ldquo;JLW built a tool that generates the Form 843 for penalty
          abatement automatically. Your clients submit their info, the tool does
          the math, and you get a ready-to-file form.&rdquo;
        </p>
        <p>
          &ldquo;She can walk you through the whole thing in 15 minutes. Want me
          to get you on her calendar?&rdquo;
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBookIt}
          className="w-full rounded-md bg-[#22C55E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#16A34A] sm:w-auto"
        >
          They&apos;re in — Book It
        </button>
        <button
          type="button"
          onClick={onStillNo}
          className="w-full rounded-md border border-white/10 px-4 py-3 text-sm font-semibold text-white/70 hover:text-white sm:w-auto"
        >
          Still not interested
        </button>
      </div>
    </div>
  );
}
