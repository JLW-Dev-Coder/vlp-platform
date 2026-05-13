'use client'

import { useCallback, useEffect, useState } from 'react'

const API_BASE = 'https://api.virtuallaunch.pro'

type Subscriber = {
  account_id: string
  tier: string | null
  status: string | null
  stripe_subscription_id: string | null
  channel_name: string | null
  channel_id: string | null
  videos_published: number
  transfer_status: string
  created_at: string
}

type Transfer = {
  account_id: string
  channel_name: string
  transfer_status: 'requested' | 'approved' | 'completed' | string
  requested_at: string
  approved_at: string | null
  completed_at: string | null
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    requested: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    approved: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    cancelled_transfer: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    cancelled: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    none: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  }
  return map[status] || 'bg-slate-500/20 text-slate-300 border-slate-500/30'
}

export default function ScaleTavlpPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  // Forms.
  const [regForm, setRegForm] = useState({ account_id: '', channel_id: '', channel_name: '', channel_url: '' })
  const [scriptForm, setScriptForm] = useState({ account_id: '', topic: '', count: '5' })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [sRes, tRes] = await Promise.all([
        fetch(`${API_BASE}/v1/tavlp/subscribers`, { credentials: 'include' }),
        fetch(`${API_BASE}/v1/tavlp/transfers`, { credentials: 'include' }),
      ])
      const sJson = await sRes.json()
      const tJson = await tRes.json()
      if (!sRes.ok || !sJson.ok) throw new Error(sJson.message || sJson.error || 'subscribers failed')
      if (!tRes.ok || !tJson.ok) throw new Error(tJson.message || tJson.error || 'transfers failed')
      setSubscribers(sJson.subscribers || [])
      setTransfers(tJson.transfers || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  async function postJson(path: string, body: unknown) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const j = await res.json().catch(() => ({}))
    if (!res.ok || !j.ok) throw new Error(j.message || j.error || `HTTP ${res.status}`)
    return j
  }

  async function approveTransfer(account_id: string) {
    setBusy(`approve:${account_id}`)
    setActionMsg(null)
    try {
      await postJson('/v1/tavlp/transfer/approve', { account_id })
      setActionMsg(`Transfer approved for ${account_id}`)
      await load()
    } catch (e) {
      setActionMsg(`Approve failed: ${e instanceof Error ? e.message : String(e)}`)
    } finally { setBusy(null) }
  }

  async function completeTransfer(account_id: string) {
    setBusy(`complete:${account_id}`)
    setActionMsg(null)
    try {
      await postJson('/v1/tavlp/transfer/complete', { account_id })
      setActionMsg(`Transfer completed for ${account_id}`)
      await load()
    } catch (e) {
      setActionMsg(`Complete failed: ${e instanceof Error ? e.message : String(e)}`)
    } finally { setBusy(null) }
  }

  async function registerChannel(e: React.FormEvent) {
    e.preventDefault()
    if (!regForm.account_id || !regForm.channel_id || !regForm.channel_name) return
    setBusy('register')
    setActionMsg(null)
    try {
      const res = await fetch(`${API_BASE}/v1/tavlp/channels/${encodeURIComponent(regForm.account_id)}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel_id: regForm.channel_id,
          channel_name: regForm.channel_name,
          channel_url: regForm.channel_url || null,
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || !j.ok) throw new Error(j.message || j.error || `HTTP ${res.status}`)
      setActionMsg(`Channel registered for ${regForm.account_id}`)
      setRegForm({ account_id: '', channel_id: '', channel_name: '', channel_url: '' })
      await load()
    } catch (err) {
      setActionMsg(`Register failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally { setBusy(null) }
  }

  async function generateScripts(e: React.FormEvent) {
    e.preventDefault()
    if (!scriptForm.account_id || !scriptForm.topic) return
    setBusy('generate')
    setActionMsg(null)
    try {
      const j = await postJson('/v1/tavlp/scripts/generate', {
        account_id: scriptForm.account_id,
        topic: scriptForm.topic,
        count: Number(scriptForm.count) || 5,
      })
      setActionMsg(`Generated ${j.scripts?.length ?? '?'} scripts for ${scriptForm.account_id}`)
    } catch (err) {
      setActionMsg(`Generate failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally { setBusy(null) }
  }

  async function seedAvatars() {
    setBusy('seed')
    setActionMsg(null)
    try {
      const res = await fetch(`${API_BASE}/v1/tavlp/avatars?rebuild=1`, { credentials: 'include' })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || !j.ok) throw new Error(j.message || j.error || `HTTP ${res.status}`)
      setActionMsg(`Avatar registry seeded (${j.count ?? 0} avatars)`)
    } catch (err) {
      setActionMsg(`Seed failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally { setBusy(null) }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">TAVLP</h1>
        <p className="mt-1 text-sm text-slate-500 italic">
          Tax Avatar Pro subscribers, channel ownership transfers, and pipeline quick actions
        </p>
      </div>

      {actionMsg && (
        <div className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-200">
          {actionMsg}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-700/40 bg-red-900/20 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Section 1: Subscribers */}
      <section className="rounded-xl border border-slate-800/80 bg-slate-900/40">
        <header className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3">
          <h2 className="text-sm font-semibold text-white">Subscribers ({subscribers.length})</h2>
          <button onClick={() => void load()} className="text-xs text-slate-400 hover:text-white">Refresh</button>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2">Account ID</th>
                <th className="px-4 py-2">Tier</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Channel</th>
                <th className="px-4 py-2 text-right">Videos</th>
                <th className="px-4 py-2">Transfer</th>
                <th className="px-4 py-2">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-500">Loading…</td></tr>
              )}
              {!loading && subscribers.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-500">No subscribers yet.</td></tr>
              )}
              {subscribers.map((s) => (
                <tr key={s.account_id} className="border-t border-slate-800/60 text-slate-300">
                  <td className="px-4 py-2 font-mono text-xs">{s.account_id}</td>
                  <td className="px-4 py-2">{s.tier || '—'}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${statusBadge(s.status || 'none')}`}>{s.status || 'none'}</span>
                  </td>
                  <td className="px-4 py-2">{s.channel_name || <span className="text-slate-600">—</span>}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{s.videos_published}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${statusBadge(s.transfer_status)}`}>{s.transfer_status}</span>
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-400">{s.created_at?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Transfers */}
      <section className="rounded-xl border border-slate-800/80 bg-slate-900/40">
        <header className="flex items-center justify-between border-b border-slate-800/80 px-5 py-3">
          <h2 className="text-sm font-semibold text-white">Transfer Requests ({transfers.length})</h2>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2">Channel</th>
                <th className="px-4 py-2">Account</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Requested</th>
                <th className="px-4 py-2">Approved</th>
                <th className="px-4 py-2">Completed</th>
                <th className="px-4 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-500">Loading…</td></tr>
              )}
              {!loading && transfers.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-500">No transfer requests.</td></tr>
              )}
              {transfers.map((t) => (
                <tr key={t.account_id} className="border-t border-slate-800/60 text-slate-300">
                  <td className="px-4 py-2">{t.channel_name}</td>
                  <td className="px-4 py-2 font-mono text-xs">{t.account_id}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${statusBadge(t.transfer_status)}`}>{t.transfer_status}</span>
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-400">{t.requested_at?.slice(0, 10)}</td>
                  <td className="px-4 py-2 text-xs text-slate-400">{t.approved_at?.slice(0, 10) || '—'}</td>
                  <td className="px-4 py-2 text-xs text-slate-400">{t.completed_at?.slice(0, 10) || '—'}</td>
                  <td className="px-4 py-2 text-right">
                    {t.transfer_status === 'requested' && (
                      <button
                        type="button"
                        disabled={busy === `approve:${t.account_id}`}
                        onClick={() => void approveTransfer(t.account_id)}
                        className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-500 disabled:opacity-50"
                      >
                        {busy === `approve:${t.account_id}` ? 'Approving…' : 'Approve Transfer'}
                      </button>
                    )}
                    {t.transfer_status === 'approved' && (
                      <button
                        type="button"
                        disabled={busy === `complete:${t.account_id}`}
                        onClick={() => void completeTransfer(t.account_id)}
                        className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                      >
                        {busy === `complete:${t.account_id}` ? 'Marking…' : 'Mark Complete'}
                      </button>
                    )}
                    {t.transfer_status === 'completed' && <span className="text-xs text-emerald-400">Done</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Quick actions */}
      <section className="grid gap-4 md:grid-cols-3">
        <form onSubmit={registerChannel} className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
          <h3 className="text-sm font-semibold text-white">Register Channel</h3>
          <div className="mt-3 space-y-2">
            <input value={regForm.account_id} onChange={(e) => setRegForm({ ...regForm, account_id: e.target.value })}
              placeholder="account_id" className="w-full rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-sm text-white placeholder:text-slate-500" />
            <input value={regForm.channel_id} onChange={(e) => setRegForm({ ...regForm, channel_id: e.target.value })}
              placeholder="channel_id (UC...)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-sm text-white placeholder:text-slate-500" />
            <input value={regForm.channel_name} onChange={(e) => setRegForm({ ...regForm, channel_name: e.target.value })}
              placeholder="channel_name" className="w-full rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-sm text-white placeholder:text-slate-500" />
            <input value={regForm.channel_url} onChange={(e) => setRegForm({ ...regForm, channel_url: e.target.value })}
              placeholder="channel_url (optional)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-sm text-white placeholder:text-slate-500" />
            <button type="submit" disabled={busy === 'register'} className="w-full rounded-md bg-pink-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-pink-500 disabled:opacity-50">
              {busy === 'register' ? 'Registering…' : 'Register Channel'}
            </button>
          </div>
        </form>

        <form onSubmit={generateScripts} className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
          <h3 className="text-sm font-semibold text-white">Generate Scripts</h3>
          <div className="mt-3 space-y-2">
            <input value={scriptForm.account_id} onChange={(e) => setScriptForm({ ...scriptForm, account_id: e.target.value })}
              placeholder="account_id" className="w-full rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-sm text-white placeholder:text-slate-500" />
            <input value={scriptForm.topic} onChange={(e) => setScriptForm({ ...scriptForm, topic: e.target.value })}
              placeholder="topic (e.g., IRS audit defense)" className="w-full rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-sm text-white placeholder:text-slate-500" />
            <input value={scriptForm.count} onChange={(e) => setScriptForm({ ...scriptForm, count: e.target.value })}
              placeholder="count" type="number" min={1} max={20}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-sm text-white placeholder:text-slate-500" />
            <button type="submit" disabled={busy === 'generate'} className="w-full rounded-md bg-pink-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-pink-500 disabled:opacity-50">
              {busy === 'generate' ? 'Generating…' : 'Generate Scripts'}
            </button>
          </div>
        </form>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
          <h3 className="text-sm font-semibold text-white">Avatar Registry</h3>
          <p className="mt-2 text-xs text-slate-400">Rebuilds the TAVLP avatar registry from HeyGen.</p>
          <button onClick={() => void seedAvatars()} disabled={busy === 'seed'} className="mt-3 w-full rounded-md bg-slate-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-600 disabled:opacity-50">
            {busy === 'seed' ? 'Seeding…' : 'Seed Avatar Registry'}
          </button>
        </div>
      </section>
    </div>
  )
}
