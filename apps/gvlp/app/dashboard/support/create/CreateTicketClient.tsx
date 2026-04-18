'use client';

import { useState } from 'react';
import { ArrowLeft, Send, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAppShell } from '@vlp/member-ui';

const API_BASE = 'https://api.virtuallaunch.pro';

const labelCls = 'block text-[11px] uppercase tracking-widest text-white/40 mb-1.5';
const inputCls =
  'w-full rounded-lg border border-[var(--member-border)] bg-[var(--member-card)] px-4 py-2.5 text-sm text-white placeholder-white/30 transition focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/30';
const selectCls =
  'w-full appearance-none rounded-lg border border-[var(--member-border)] bg-[var(--member-card)] px-4 py-2.5 text-sm text-white transition focus:border-brand-primary/50 focus:outline-none focus:ring-1 focus:ring-brand-primary/30';

export default function CreateTicketClient() {
  const { session } = useAppShell();

  const [fullName, setFullName] = useState('');
  const [emailAddr, setEmailAddr] = useState(session.email || '');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session.account_id) return;
    if (!subject.trim() || !message.trim()) {
      setSubmitError('Subject and message are required');
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const ticketId = `TKT_${crypto.randomUUID()}`;
      const res = await fetch(`${API_BASE}/v1/support/tickets`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: session.account_id,
          ticketId,
          subject: subject.trim(),
          message: message.trim(),
          priority,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        setSubmitError(data.message || `Failed to create ticket (HTTP ${res.status})`);
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create ticket');
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="space-y-8">
        <div>
          <a
            href="/dashboard/support"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/40 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Support
          </a>
          <h1 className="text-2xl font-semibold text-white">Ticket Submitted</h1>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-sm text-emerald-200">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Your ticket has been created</p>
            <p className="mt-1 text-emerald-200/70">
              Our team will respond within 2–4 hours during business hours.
            </p>
          </div>
        </div>
        <a
          href="/dashboard/support"
          className="inline-flex items-center gap-2 rounded-lg border border-brand-primary/30 px-5 py-2.5 text-sm font-medium text-brand-primary transition hover:bg-brand-primary/10"
        >
          Return to Support
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <a
          href="/dashboard/support"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Support
        </a>
        <h1 className="text-2xl font-semibold text-white">Create Support Ticket</h1>
        <p className="mt-1 text-sm text-white/50">
          Submit a new support request and our team will respond promptly.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
          <h3 className="text-xs uppercase tracking-widest text-white/40">Contact Information</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Email Address</label>
              <input
                type="email"
                value={emailAddr}
                onChange={(e) => setEmailAddr(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
          <h3 className="text-xs uppercase tracking-widest text-white/40">Ticket Classification</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectCls}
              >
                <option value="">Select category</option>
                <option value="billing">Billing</option>
                <option value="games">Games</option>
                <option value="tokens">Tokens</option>
                <option value="embed">Embed</option>
                <option value="reports">Reports</option>
                <option value="profile">Profile</option>
                <option value="technical">Technical Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
                className={selectCls}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
          <h3 className="text-xs uppercase tracking-widest text-white/40">Issue Details</h3>
          <div className="mt-5 space-y-4">
            <div>
              <label className={labelCls}>Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your issue"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Message</label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue in detail. Include steps to reproduce, expected behavior, and any error messages you've encountered."
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
        </div>

        {submitError && (
          <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{submitError}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={submitting || !session.account_id}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-hover px-5 py-2.5 text-sm font-medium text-white shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? 'Submitting…' : 'Submit Ticket'}
          </button>
          <a
            href="/dashboard/support"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--member-border)] px-5 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/[0.04] hover:text-white"
          >
            <X className="h-4 w-4" />
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
