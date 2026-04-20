'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://api.virtuallaunch.pro';

type Row = Record<string, string>;

function parseCsv(text: string): Row[] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        cur.push(field);
        field = '';
      } else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        cur.push(field);
        field = '';
        if (cur.some((c) => c.length > 0)) rows.push(cur);
        cur = [];
      } else {
        field += ch;
      }
    }
  }
  if (field.length > 0 || cur.length > 0) {
    cur.push(field);
    if (cur.some((c) => c.length > 0)) rows.push(cur);
  }

  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const obj: Row = {};
    headers.forEach((h, idx) => {
      obj[h] = (r[idx] ?? '').trim();
    });
    return obj;
  });
}

const MESSAGE_BASE = 'mt-4 px-3.5 py-3 rounded-md text-[0.88rem] leading-relaxed';
const MESSAGE_VARIANT: Record<'success' | 'error' | 'info', string> = {
  success: 'bg-[rgba(34,197,94,0.12)] border border-[rgba(34,197,94,0.35)] text-[var(--color-success)]',
  error: 'bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.35)] text-[var(--color-error)]',
  info: 'bg-brand-primary/[0.08] border border-brand-primary/25 text-brand-primary',
};

function UploadView() {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ kind: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [previewCount, setPreviewCount] = useState<number | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreviewCount(null);
    setMessage(null);
    if (!f) return;
    setParsing(true);
    try {
      const text = await f.text();
      const rows = parseCsv(text);
      setPreviewCount(rows.length);
      setMessage({ kind: 'info', text: `Parsed ${rows.length} prospect rows. Click Upload to send to the Worker.` });
    } catch (err) {
      setMessage({ kind: 'error', text: `Failed to parse CSV: ${(err as Error).message}` });
    } finally {
      setParsing(false);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const text = await file.text();
      const prospects = parseCsv(text);
      if (prospects.length === 0) {
        setMessage({ kind: 'error', text: 'CSV contained no rows.' });
        setUploading(false);
        return;
      }
      const res = await fetch(`${API_BASE}/v1/wlvlp/admin/upload-prospects`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospects }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`${res.status}: ${errText}`);
      }
      const data = (await res.json().catch(() => ({}))) as { count?: number };
      const count = data.count ?? prospects.length;
      setMessage({ kind: 'success', text: `Uploaded ${count} prospects. The Worker cron will pick them up on the next run.` });
      setFile(null);
      setPreviewCount(null);
    } catch (err) {
      setMessage({ kind: 'error', text: `Upload failed: ${(err as Error).message}` });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col text-white">
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-[900px] mx-auto px-6 h-[60px] flex items-center justify-between">
          <Link href="/" className="font-sora font-extrabold text-[1.2rem] text-brand-primary no-underline [text-shadow:0_0_20px_rgba(168,85,247,0.5)]">
            Website Lotto
          </Link>
          <Link href="/dashboard" className="text-white/70 no-underline text-[0.9rem] hover:text-brand-primary">Dashboard</Link>
        </div>
      </nav>
      <main className="max-w-[720px] w-full mx-auto pt-12 px-6 pb-20">
        <h1 className="font-sora text-3xl font-extrabold m-0 mb-3">Admin — Upload Prospects</h1>
        <p className="text-white/60 text-[0.95rem] leading-relaxed m-0 mb-8">
          Upload the FOIA CSV. The Worker cron handles slug generation, asset page creation,
          email queueing, and sending automatically — no manual batch generation required.
        </p>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-5">
          <label className="flex flex-col gap-2 mb-4 text-[0.9rem] text-white/70">
            <span>Choose CSV file</span>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              disabled={parsing || uploading}
              className="p-3 bg-black/40 border border-white/[0.12] rounded-lg text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>

          {file && (
            <div className="text-[0.85rem] text-white/65 px-3 py-2.5 bg-brand-primary/[0.06] border border-brand-primary/[0.18] rounded-md mb-4">
              <strong>{file.name}</strong> — {(file.size / 1024).toFixed(1)} KB
              {previewCount !== null && <span> — {previewCount} rows</span>}
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || parsing || uploading || previewCount === null || previewCount === 0}
            className="bg-brand-primary text-white border-0 px-6 py-3 rounded-lg font-bold text-[0.95rem] cursor-pointer transition-all shadow-brand hover:enabled:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading…' : 'Upload to Worker'}
          </button>

          {message && (
            <div className={`${MESSAGE_BASE} ${MESSAGE_VARIANT[message.kind]}`}>
              {message.text}
            </div>
          )}
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
          <h2 className="font-sora text-[1.1rem] m-0 mb-3">What happens after upload</h2>
          <ol className="m-0 pl-5 text-white/70 text-[0.9rem] leading-[1.7]">
            <li>Prospects are stored in R2 under <code className="font-mono text-[0.82rem] bg-white/[0.06] px-1.5 py-px rounded">vlp-scale/wlvlp-prospects/</code></li>
            <li>Worker cron selects the next batch using SCALE.md selection logic</li>
            <li>Asset pages and Email 1 / Email 2 are generated automatically</li>
            <li>Gmail sends are queued and tracked by the Worker</li>
          </ol>
        </div>
      </main>
    </div>
  );
}

export default function AdminUploadPage() {
  return <AuthGuard>{() => <UploadView />}</AuthGuard>;
}
