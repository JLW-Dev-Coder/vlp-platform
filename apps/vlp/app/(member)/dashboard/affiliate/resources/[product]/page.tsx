'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { getDashboard } from '@/lib/api/dashboard'
import { getAffiliate, getAccount } from '@/lib/api/member'
import { ASSET_CATEGORIES, PRODUCTS } from '../resources-data'

interface PageProps {
  params: Promise<{ product: string }>
}

export default function ProductResourcesPage({ params }: PageProps) {
  const { product: slug } = use(params)
  const product = PRODUCTS.find((p) => p.slug === slug)

  const [referralLink, setReferralLink] = useState('{{REFERRAL_LINK}}')
  const [affiliateName, setAffiliateName] = useState('{{AFFILIATE_NAME}}')

  useEffect(() => {
    if (product) document.title = `${product.name} — Affiliate Resources`
    else document.title = 'Affiliate Resources'
  }, [product])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const dashboard = await getDashboard()
        if (cancelled) return
        const accountId = dashboard.account.account_id
        const [affiliate, account] = await Promise.all([
          getAffiliate(accountId),
          getAccount(accountId).catch(() => null),
        ])
        if (cancelled) return
        if (affiliate?.referral_url) setReferralLink(affiliate.referral_url)
        const name = [account?.first_name, account?.last_name].filter(Boolean).join(' ').trim()
        if (name) setAffiliateName(name)
      } catch {
        // Fall back to placeholders if fetch fails — affiliate can still see content
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/dashboard/affiliate/resources"
            className="text-sm text-[--member-muted] transition hover:text-[--member-text]"
          >
            ← Back to all products
          </Link>
        </div>
        <h1 className="text-2xl font-semibold text-[--member-text]">Product not found</h1>
        <p className="mt-2 text-sm text-[--member-muted]">
          Pick a product from the resources index.
        </p>
      </div>
    )
  }

  const substitute = (text: string) =>
    text.replace(/\{\{REFERRAL_LINK\}\}/g, referralLink).replace(/\{\{AFFILIATE_NAME\}\}/g, affiliateName)

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <Link
          href="/dashboard/affiliate/resources"
          className="text-sm text-[--member-muted] transition hover:text-[--member-text]"
        >
          ← Back to all products
        </Link>
      </div>

      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-semibold text-[--member-text]">{product.name}</h1>
        <p className="mb-1 text-xs uppercase tracking-wider text-brand-primary">{product.tagline}</p>
        <p className="text-sm leading-relaxed text-[--member-muted]">{product.summary}</p>
        <p className="mt-2 text-xs text-[--member-muted]">
          Domain: <a href={`https://${product.domain}`} className="text-brand-primary hover:underline" target="_blank" rel="noreferrer">{product.domain}</a>
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-[--member-border] bg-[--member-card] p-4 text-xs text-[--member-muted]">
        Your referral link and name are auto-inserted into every script below. Other placeholders (like <code>{`{{FIRST_NAME}}`}</code> and <code>{`{{TIER}}`}</code>) are intentional — fill those in based on the prospect.
      </div>

      <div className="space-y-8">
        {product.assets.map((asset, idx) => (
          <article
            key={`${asset.category}-${idx}`}
            className="rounded-xl border border-[--member-border] bg-[--member-card] p-6"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-primary">
                {ASSET_CATEGORIES[asset.category].label}
              </span>
              <h2 className="text-lg font-semibold text-[--member-text]">{asset.title}</h2>
            </div>
            {asset.subject && (
              <p className="mb-3 text-sm">
                <span className="text-[--member-muted]">Subject: </span>
                <span className="font-medium text-[--member-text]">{substitute(asset.subject)}</span>
              </p>
            )}
            <pre className="whitespace-pre-wrap rounded-lg bg-[--member-bg] p-4 text-sm leading-relaxed text-[--member-text]">
{substitute(asset.body)}
            </pre>
          </article>
        ))}
      </div>
    </div>
  )
}
