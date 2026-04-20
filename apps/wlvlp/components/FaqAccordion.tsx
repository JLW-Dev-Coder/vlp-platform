type Faq = { q: string; a: string }

export function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {items.map((f) => (
        <details
          key={f.q}
          className="glass-card rounded-lg p-5 group neon-border open:shadow-[0_0_40px_rgba(0,212,255,0.3)]"
        >
          <summary className="font-bold text-white cursor-pointer list-none flex justify-between items-center">
            <span>{f.q}</span>
            <span className="text-neon-blue text-xl group-open:rotate-45 transition-transform">
              +
            </span>
          </summary>
          <p className="mt-3 text-white/70 leading-relaxed">{f.a}</p>
        </details>
      ))}
    </div>
  )
}
