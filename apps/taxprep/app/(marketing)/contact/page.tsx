import type { Metadata } from 'next'
import { tppConfig } from '@/lib/platform-config'
import CalBookingButton from '@/components/marketing/CalBookingButton'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Book a Tax Prep Pro Discovery Call to walk through the 8-phase client journey, or schedule a Support session if you are already a TPP member.',
}

// Cal.com Discovery + Support bookings per canonical-cal-events.md §3 (TPP rows)
// and §7.4 (SD-led app Cal/SD coexistence, adopted 2026-05-09).

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
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

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--tpp-rose)]">New here</div>
          <h2 className="mt-3 font-display text-2xl font-semibold text-[var(--color-text-1)]">Discovery Call</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-2)]">
            For service bureaus and tax pros evaluating Tax Prep Pro. We confirm fit and walk through the 8-phase client journey.
          </p>
          <div className="mt-6">
            <CalBookingButton
              calLink={tppConfig.calIntroSlug}
              namespace={tppConfig.calIntroNamespace}
              brandColor={tppConfig.brandColor}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tpp-rose)] px-5 py-3 font-medium text-white transition hover:bg-[var(--tpp-rose-deep)]"
            >
              Book Discovery Call <span aria-hidden>→</span>
            </CalBookingButton>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--tpp-rose)]">Already a member</div>
          <h2 className="mt-3 font-display text-2xl font-semibold text-[var(--color-text-1)]">Support Call</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-2)]">
            For active TPP members who need workspace help, workflow tuning, or admin coverage. 15-minute slots.
          </p>
          <div className="mt-6">
            <CalBookingButton
              calLink={tppConfig.calBookingSlug}
              namespace={tppConfig.calBookingNamespace}
              brandColor={tppConfig.brandColor}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[var(--tpp-crimson)] bg-transparent px-5 py-3 font-medium text-[var(--tpp-crimson)] transition hover:bg-[var(--tpp-crimson)] hover:text-white"
            >
              Get Support <span aria-hidden>→</span>
            </CalBookingButton>
          </div>
        </div>
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
