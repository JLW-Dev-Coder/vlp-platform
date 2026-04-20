'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ThumbsUp, Inbox, AlertCircle } from 'lucide-react';
import {
  getTemplatesWithFallback,
  voteTemplate,
  type Template,
} from '@/lib/api';

export default function VotingPage() {
  const [templates, setTemplates] = useState<Template[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voting, setVoting] = useState<string | null>(null);
  const [voteError, setVoteError] = useState('');

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    setError('');
    getTemplatesWithFallback()
      .then(setTemplates)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Failed to load templates')
      )
      .finally(() => setLoading(false));
  }

  async function handleVote(slug: string) {
    setVoting(slug);
    setVoteError('');
    try {
      const res = await voteTemplate(slug);
      setTemplates((prev) =>
        prev?.map((t) =>
          t.slug === slug ? { ...t, vote_count: res.vote_count ?? t.vote_count } : t
        ) ?? null
      );
    } catch (e: unknown) {
      setVoteError(e instanceof Error ? e.message : 'Vote failed');
    } finally {
      setVoting(null);
    }
  }

  const top = (templates ?? [])
    .filter((t) => t.status === 'available' || t.status === 'auction')
    .sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0))
    .slice(0, 12);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Voting</h1>
        <p className="mt-1 text-sm text-white/50">
          Vote on designs to help decide which templates get priority hosting and polish. Your votes
          shape what we build next.
        </p>
      </div>

      {loading && (
        <div className="h-40 animate-pulse rounded-xl border border-[var(--member-border)] bg-[var(--member-card)]" />
      )}

      {!loading && error && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Couldn&apos;t load templates</p>
            <p className="mt-1 text-amber-200/70">{error}</p>
            <button
              type="button"
              onClick={load}
              className="mt-3 inline-flex rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-400/20"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {voteError && !error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-2.5 text-sm text-rose-300">
          {voteError}
        </div>
      )}

      {!loading && !error && top.length === 0 && (
        <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
            <ThumbsUp className="h-6 w-6 text-brand-primary" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-white">No templates to vote on yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
            Templates will appear here as new designs are added to the marketplace. Check back soon
            — or browse the full template gallery to see what&apos;s already live.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
            <Inbox className="h-3.5 w-3.5" />
            <span>Voting opens for every new design.</span>
          </div>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-hover px-4 py-2 text-sm font-medium text-white shadow transition hover:opacity-90"
          >
            Browse Templates
          </Link>
        </div>
      )}

      {!loading && !error && top.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Top templates — vote to prioritize
            </p>
            <Link href="/" className="text-xs text-brand-primary hover:underline">
              See all templates →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {top.map((t) => (
              <div
                key={t.slug}
                className="flex flex-col gap-3 rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/sites/${t.slug}`}
                    className="text-sm font-semibold text-white hover:text-brand-primary"
                  >
                    {t.title}
                  </Link>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/60">
                    {t.status}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{t.vote_count ?? 0} votes</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleVote(t.slug)}
                    disabled={voting === t.slug}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/30 px-3 py-1.5 text-xs font-medium text-brand-primary hover:bg-brand-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    {voting === t.slug ? 'Voting…' : 'Vote'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
