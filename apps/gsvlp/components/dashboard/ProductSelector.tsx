'use client';

import { products } from '@/lib/scripts';

export function ProductSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">
        What are you pitching?
      </div>
      <div className="flex flex-wrap gap-2">
        {products.map((p) => {
          const isActive = p.id === selectedId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              aria-pressed={isActive}
              title={p.name}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                isActive
                  ? 'border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E]'
                  : 'border-white/10 bg-transparent text-white/60 hover:text-white/90'
              }`}
            >
              {p.shortName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
