'use client'

import Link from 'next/link'
import { Settings, CreditCard, Shield } from 'lucide-react'
import { ContentCard, useAppShell } from '@vlp/member-ui'
import { useBalance } from '@/lib/balance-context'

export default function AccountClient() {
  const { session } = useAppShell()
  const { data: balance } = useBalance()
  const tokens = balance?.transcript_tokens ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Account</h1>
        <p className="mt-1 text-sm text-white/50">Manage your account settings and billing</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account info */}
        <ContentCard title="Account Details" headerAction={<Settings className="h-4 w-4 text-white/20" />}>
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Email</span>
              <p className="mt-1 text-sm text-white/80">{session.email}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Account ID</span>
              <p className="mt-1 font-mono text-sm text-white/60">{session.account_id}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Plan</span>
              <p className="mt-1 text-sm text-white/80">Token-based</p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Authentication</span>
              <div className="mt-1 flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-teal-400" />
                <span className="text-sm text-teal-400">Authenticated</span>
              </div>
            </div>
          </div>
        </ContentCard>

        {/* Token balance & billing */}
        <ContentCard title="Billing" headerAction={<CreditCard className="h-4 w-4 text-white/20" />}>
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Token Balance</span>
              <p className={`mt-1 text-3xl font-semibold ${tokens > 0 ? 'text-teal-400' : 'text-amber-400'}`}>
                {tokens}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/app/token-usage/"
                className="rounded-lg border border-white/[0.08] px-3.5 py-1.5 text-[13px] font-semibold text-white/60 transition hover:border-white/20 hover:text-white"
              >
                View Usage
              </Link>
              <Link
                href="/app/dashboard/"
                className="rounded-lg bg-teal-500 px-3.5 py-1.5 text-[13px] font-bold text-black transition hover:opacity-90"
              >
                Buy Tokens
              </Link>
            </div>
            <div className="border-t border-[var(--member-border)] pt-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Payment History</span>
              <p className="mt-2 text-sm text-white/40">No payments yet</p>
            </div>
          </div>
        </ContentCard>
      </div>
    </div>
  )
}
