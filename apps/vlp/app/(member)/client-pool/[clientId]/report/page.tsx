'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react'
import {
  getComplianceReport,
  type ComplianceReport,
} from '@/lib/api/compliance-records'

export default function ComplianceReportPage() {
  const params = useParams<{ clientId: string }>()
  const clientId = params?.clientId ?? ''

  const [report, setReport] = useState<ComplianceReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    if (!clientId) return
    setLoading(true)
    setError(null)
    setNotFound(false)
    ;(async () => {
      try {
        const res = await getComplianceReport(clientId)
        if (cancelled) return
        if (res.ok && res.report) {
          setReport(res.report)
        } else if (res.error === 'not_found') {
          setNotFound(true)
        } else {
          setError(res.message ?? res.error ?? 'Could not load compliance report.')
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load compliance report.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [clientId])

  const isFinal = report?.compliance_record_status === 'Final'

  return (
    <div className="space-y-6">
      <Link
        href={`/client-pool/${clientId}`}
        className="inline-flex items-center gap-1.5 text-sm text-brand-primary transition hover:text-brand-hover"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Client Record
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Compliance Report</h1>
          <p className="mt-1 text-sm text-white/40">
            Client-visible projection of the compliance record for this case.
          </p>
        </div>
        {report && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide ${
              isFinal
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
            }`}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            {isFinal ? 'Final' : 'Draft Preview'}
          </span>
        )}
      </div>

      {loading && (
        <div className="rounded-2xl border border-[--member-border] bg-[--member-card] px-6 py-10 text-center text-sm text-white/40">
          Loading compliance report…
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {!loading && notFound && (
        <div className="rounded-2xl border border-[--member-border] bg-[--member-card] px-6 py-10 text-center">
          <ClipboardList className="mx-auto h-8 w-8 text-white/20" />
          <h2 className="mt-3 text-base font-semibold text-white">No report yet</h2>
          <p className="mt-1 text-sm text-white/50">
            Compliance report will appear here after the compliance flow is completed.
          </p>
          <Link
            href={`/client-pool/${clientId}/compliance`}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/30 bg-brand-primary/10 px-4 py-2 text-sm font-medium text-brand-primary transition hover:bg-brand-primary/20"
          >
            Go to Compliance
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {!loading && !notFound && !error && report && (
        <div className="overflow-hidden rounded-2xl border border-[--member-border] bg-[--member-card]">
          <div className="border-b border-[--member-border] bg-white/5 px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                  Prepared for
                </p>
                <p className="mt-0.5 text-xl font-semibold text-white">
                  {report.client_name ?? '—'}
                </p>
              </div>
              <div className="flex flex-wrap gap-6 text-xs">
                <div>
                  <p className="font-medium uppercase tracking-wider text-white/40">Order</p>
                  <p className="mt-0.5 font-mono text-white/70">{report.order_id}</p>
                </div>
                {report.compliance_prepared_date && (
                  <div>
                    <p className="font-medium uppercase tracking-wider text-white/40">Prepared</p>
                    <p className="mt-0.5 text-white/70">{report.compliance_prepared_date}</p>
                  </div>
                )}
                {report.compliance_tax_year != null && (
                  <div>
                    <p className="font-medium uppercase tracking-wider text-white/40">Tax Year</p>
                    <p className="mt-0.5 text-white/70">{report.compliance_tax_year}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {report.compliance_client_summary && (
            <Section icon={FileText} title="Summary">
              <p className="text-sm leading-relaxed text-white/70">
                {report.compliance_client_summary}
              </p>
            </Section>
          )}

          <Section icon={DollarSign} title="IRS Account Status">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Metric
                label="Total IRS Balance"
                value={report.total_irs_balance ?? '—'}
                emphasis
              />
              <Metric label="Account Status" value={report.irs_account_status ?? '—'} />
            </div>
          </Section>

          <Section icon={ShieldCheck} title="Filing & Return Status">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Metric label="Filing Status" value={report.filing_status ?? '—'} />
              <Metric
                label="Return Processing"
                value={report.return_processing_status ?? '—'}
              />
              <Metric label="Date Filed" value={report.return_date_filed ?? '—'} />
              <Metric label="Tax Liability" value={report.return_tax_liability ?? '—'} />
            </div>
          </Section>

          <Section icon={AlertTriangle} title="IRS Notices">
            {report.notices && report.notices.length > 0 ? (
              <div className="space-y-3">
                {report.notices.map((notice, i) => (
                  <div
                    key={`${notice.cp_number ?? 'notice'}-${i}`}
                    className="rounded-lg border border-white/10 bg-white/[0.02] p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {notice.cp_number && (
                          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400">
                            {notice.cp_number}
                          </span>
                        )}
                        {notice.type && (
                          <span className="text-xs text-white/40">{notice.type}</span>
                        )}
                      </div>
                      {notice.date && (
                        <span className="flex items-center gap-1 text-xs text-white/40">
                          <Calendar className="h-3 w-3" />
                          {notice.date}
                        </span>
                      )}
                    </div>
                    {notice.details && (
                      <p className="mt-2 text-sm text-white/70">{notice.details}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">No IRS notices recorded.</p>
            )}
          </Section>

          <Section icon={ClipboardList} title="Installment Agreement">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Metric label="IA Established" value={report.ia_established ?? '—'} />
              {report.ia_payment_amount && (
                <Metric label="Payment Amount" value={report.ia_payment_amount} />
              )}
              {report.ia_payment_date && (
                <Metric label="Payment Date" value={report.ia_payment_date} />
              )}
            </div>
          </Section>
        </div>
      )}

      {!loading && !notFound && !error && report && !isFinal && (
        <div className="flex items-center justify-end gap-2 text-xs text-white/40">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Finalize this report from the Compliance page when ready.
        </div>
      )}
    </div>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-[--member-border] px-6 py-5 last:border-b-0">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

function Metric({
  label,
  value,
  emphasis,
}: {
  label: string
  value: string | number
  emphasis?: boolean
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">{label}</p>
      <p
        className={`mt-1 ${
          emphasis ? 'text-lg font-semibold text-brand-primary' : 'text-sm text-white/80'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
