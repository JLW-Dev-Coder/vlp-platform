'use client'

import { Coins, TrendingUp, ShoppingCart } from 'lucide-react'
import { KPICard, ContentCard } from '@vlp/member-ui'
import { useBalance } from '@/lib/balance-context'

export default function TokenUsageClient() {
  const { data: balance } = useBalance()
  const tokens = balance?.transcript_tokens ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Token Usage</h1>
        <p className="mt-1 text-sm text-white/50">Track your token balance and consumption</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard label="Available" value={String(tokens)} icon={Coins} />
        <KPICard label="Used This Month" value="—" icon={TrendingUp} />
        <KPICard label="Total Purchased" value="—" icon={ShoppingCart} />
      </div>

      <ContentCard title="Usage History">
        <div className="py-8 text-center">
          <p className="text-sm text-white/40">Usage history coming soon</p>
          <p className="mt-1 text-xs text-white/25">Individual token transactions will appear here</p>
        </div>
      </ContentCard>
    </div>
  )
}
