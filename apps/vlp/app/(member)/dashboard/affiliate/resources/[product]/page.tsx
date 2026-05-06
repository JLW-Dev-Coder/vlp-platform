'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getDashboard } from '@/lib/api/dashboard'
import { getAffiliate, getAccount } from '@/lib/api/member'
import { ASSET_CATEGORIES, PRODUCTS } from '../resources-data'

interface PageProps {
  params: Promise<{ product: string }>
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1') // bold
    .replace(/\*(.+?)\*/g, '$1') // italic
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/^[-*+]\s+/gm, '') // unordered list bullets
    .replace(/^\d+\.\s+/gm, '') // ordered list numbers
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text only
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select and prompt user; for now silently fail
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-md border border-[--member-border] bg-[--member-bg] px-3 py-1.5 text-xs font-medium text-[--member-text] transition hover:border-brand-primary/50 hover:text-brand-primary"
      type="button"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {label}
        </>
      )}
    </button>
  )
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
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-primary">
                  {ASSET_CATEGORIES[asset.category].label}
                </span>
                <h2 className="text-lg font-semibold text-[--member-text]">{asset.title}</h2>
              </div>
              <CopyButton text={stripMarkdown(substitute(asset.body))} label="Copy script" />
            </div>
            {asset.subject && (
              <div className="mb-3 flex items-center justify-between gap-3 rounded-md border border-[--member-border] bg-[--member-bg] px-3 py-2">
                <p className="text-sm">
                  <span className="text-[--member-muted]">Subject: </span>
                  <span className="font-medium text-[--member-text]">{substitute(asset.subject)}</span>
                </p>
                <CopyButton text={substitute(asset.subject)} label="Copy subject" />
              </div>
            )}
            <div className="rounded-lg bg-[--member-bg] p-4 prose prose-sm prose-invert max-w-none prose-headings:text-[--member-text] prose-strong:text-[--member-text] prose-p:text-[--member-text] prose-li:text-[--member-text] prose-em:text-[--member-text] prose-code:text-[--member-text] prose-code:bg-[--member-card] prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
              <ReactMarkdown>{substitute(asset.body)}</ReactMarkdown>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
