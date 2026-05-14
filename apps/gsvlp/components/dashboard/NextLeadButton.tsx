'use client';

import Link from 'next/link';
import type { TaxPro } from './CallListTable';

export function NextLeadButton({
  currentRowNumber,
  batch,
}: {
  currentRowNumber: string;
  batch: TaxPro[];
}) {
  const idx = batch.findIndex((r) => r.id === currentRowNumber);
  const next = batch
    .slice(idx + 1)
    .concat(batch.slice(0, Math.max(idx, 0)))
    .find((r) => r.status === 'not_called');

  if (!next) {
    return (
      <div className="rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/[0.06] p-6 text-center">
        <div className="text-lg font-semibold text-white">
          You&apos;ve called everyone in your batch! 🎉
        </div>
        <Link
          href="/dashboard/calls"
          className="mt-3 inline-block rounded-md border border-white/10 px-4 py-2 text-sm text-white/80 hover:text-white"
        >
          Back to Call List
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={`/dashboard/calls/${next.id}`}
      className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-md bg-[#22C55E] px-4 text-base font-bold text-white hover:bg-[#16A34A]"
    >
      Next Call →
    </Link>
  );
}
