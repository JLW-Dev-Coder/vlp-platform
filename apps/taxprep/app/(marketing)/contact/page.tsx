import type { Metadata } from 'next'
import { tppConfig } from '@/lib/platform-config'
import { SuiteDashFormEmbed } from '@/components/marketing/SuiteDashFormEmbed'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Book a Tax Prep Pro Discovery Call to walk through the 8-phase client journey and the SuiteDash buildout for your bureau.',
}

// Per Deviation 1 supplemental: SuiteDash Discovery Call form via Pattern A.
// TCVLP's contact page uses a Cal.com embed; TPP swaps that for SD per Deviation 1.

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--tpp-rose)]">Contact</p>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-[var(--color-text-1)]">
          Book a <span className="italic text-[var(--tpp-rose)]">Discovery Call</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-text-2)]">
          {/* TODO(copy): Awaiting final B2B copy from Jamie */}
          A 30-minute conversation about your bureau, your filing types, and how the TPP buildout would fit. No commitment.
        </p>
      </header>

      <div className="tpp-form-sd mt-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
        <SuiteDashFormEmbed
          formId={tppConfig.suitedashDiscoveryFormId!}
          embedBaseUrl={tppConfig.suitedashEmbedBaseUrl!}
        />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 text-sm text-[var(--color-text-2)]">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--tpp-rose)]">Email</div>
          <p className="mt-2">{tppConfig.businessInfo?.supportEmail}</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--tpp-rose)]">Phone</div>
          <p className="mt-2">{tppConfig.businessInfo?.phone}</p>
        </div>
      </div>
    </section>
  )
}
