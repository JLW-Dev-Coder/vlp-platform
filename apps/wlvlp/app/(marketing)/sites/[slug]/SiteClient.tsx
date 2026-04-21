'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTemplate, getTemplateBids, voteTemplate, placeBid, createCheckout, getSession, Template, Bid } from '@/lib/api';
import { capture } from '@vlp/member-ui';
import { getTierForSlug, getPrice } from '@/lib/pricing';
import { TEMPLATES, getCategoryLabel } from '@/lib/templates';

interface Props {
  slug: string;
}

const STATUS_AVAILABLE = 'bg-[rgba(34,197,94,0.12)] text-[var(--color-success)] border border-[rgba(34,197,94,0.3)]';
const STATUS_AUCTION = 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30';
const STATUS_SOLD = 'bg-white/[0.06] text-white/40 border border-white/10';

function statusClass(status: string) {
  if (status === 'available') return STATUS_AVAILABLE;
  if (status === 'auction') return STATUS_AUCTION;
  return STATUS_SOLD;
}

export default function SiteClient({ slug }: Props) {
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [session, setSession] = useState<{ account_id: string } | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    Promise.all([
      getTemplate(slug).catch(() => null),
      getTemplateBids(slug).catch(() => [] as Bid[]),
      getSession().catch(() => null),
    ]).then(([t, b, s]) => {
      if (t) {
        setTemplate(t);
      } else {
        const entry = TEMPLATES.find(e => e.slug === slug);
        if (entry) {
          setTemplate({
            slug: entry.slug,
            title: entry.title,
            category: getCategoryLabel(entry.categories),
            status: 'available',
            vote_count: 0,
            price_monthly: 0,
          });
        }
      }
      setBids(b);
      setSession(s);
    }).finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!template?.auction_ends_at) return;
    const tick = () => {
      const diff = new Date(template.auction_ends_at!).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Ended'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [template]);

  async function handleVote() {
    if (!session) { router.push('/sign-in?redirect=/sites/' + slug); return; }
    try {
      const res = await voteTemplate(slug);
      setTemplate(t => t ? { ...t, vote_count: res.vote_count } : t);
    } catch {}
  }

  const tier = getTierForSlug(slug);
  const price = getPrice(tier);

  async function handleBuyNow() {
    setError('');
    setCheckoutLoading(true);
    try {
      const res = await createCheckout(slug, tier);
      const url = res.session_url ?? res.url;
      if (url) {
        capture({
          name: 'checkout_started',
          props: { app: 'wlvlp', sku: `${slug}:${tier}`, amount_cents: price * 100 },
        });
        window.location.href = url;
        return;
      }
      setError('Checkout failed. Please try again.');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handlePlaceBid() {
    if (!session) { router.push('/sign-in?redirect=/sites/' + slug); return; }
    const amount = Number(bidAmount);
    if (amount < 29) { setError('Minimum bid is $29'); return; }
    try {
      await placeBid(slug, amount);
      const [t, b] = await Promise.all([getTemplate(slug), getTemplateBids(slug)]);
      setTemplate(t); setBids(b); setBidAmount(''); setError('');
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Bid failed'); }
  }

  if (loading) return <div className="loadingScreen"><span className="spinner" /></div>;
  if (!template) return <div className="loadingScreen"><p>Template not found.</p></div>;

  const bidBtnClass = 'inline-block text-center whitespace-nowrap px-5 py-2.5 bg-brand-primary/10 border border-brand-primary/40 rounded-lg text-brand-primary font-semibold text-[0.88rem] cursor-pointer no-underline transition-all hover:bg-brand-primary/20 hover:border-brand-primary';

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-[3px] bg-[linear-gradient(90deg,var(--brand-primary),var(--brand-hover),var(--brand-dark),var(--brand-primary))] bg-[length:200%_100%] motion-safe:animate-[marquee_3s_linear_infinite]" />

      <nav className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 h-[60px] flex items-center justify-between">
          <Link href="/" className="font-sora font-extrabold text-[1.2rem] text-brand-primary no-underline [text-shadow:0_0_20px_rgba(168,85,247,0.5)]">
            Website Lotto
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-white/65 no-underline text-[0.88rem] font-medium transition-colors hover:text-brand-primary">← Back to Gallery</Link>
            {session ? (
              <Link href="/dashboard" className="text-white/65 no-underline text-[0.88rem] font-medium transition-colors hover:text-brand-primary">Dashboard</Link>
            ) : (
              <Link href="/sign-in" className="text-white/65 no-underline text-[0.88rem] font-medium transition-colors hover:text-brand-primary">Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex flex-1 min-h-[calc(100vh-63px)] gap-0 max-md:flex-col max-md:min-h-0 md:flex-row">
        <div className="flex-1 relative bg-surface-bg border-r border-white/[0.06] min-h-[400px]">
          <iframe
            src={`/sites/${slug}/preview.html`}
            className="absolute inset-0 w-full h-full border-0 block"
            title={template.title}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>

        <div className="w-full md:w-[380px] flex-shrink-0 px-7 py-8 bg-black/95 overflow-y-auto flex flex-col gap-4 max-md:border-t max-md:border-white/[0.06]">
          <div className={`inline-block px-3 py-[3px] rounded-full text-[0.75rem] font-semibold tracking-wide w-fit ${statusClass(template.status)}`}>
            {template.status === 'available' ? 'Available' : template.status === 'auction' ? 'Auction' : 'Sold'}
          </div>
          <h1 className="font-sora text-2xl font-bold text-white leading-tight -tracking-[0.5px]">{template.title}</h1>
          <div className="text-[0.8rem] text-white/40 uppercase tracking-wider">{template.category}</div>
          {template.description && <p className="text-white/60 text-[0.88rem] leading-relaxed">{template.description}</p>}

          <div className="flex items-center gap-3 py-3 border-y border-white/[0.06] text-white/50 text-[0.88rem]">
            <span>▲ {template.vote_count} votes</span>
            <button
              className="px-4 py-1.5 rounded-md text-[0.8rem] font-semibold border border-brand-primary/35 text-brand-primary bg-brand-primary/[0.06] cursor-pointer transition-all hover:bg-brand-primary/[0.14] hover:border-brand-primary"
              onClick={handleVote}
            >
              Vote
            </button>
          </div>

          {error && (
            <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-lg px-3.5 py-2.5 text-[var(--color-error)] text-[0.85rem]">
              {error}
            </div>
          )}

          {template.status === 'available' && (
            <div className="flex flex-col gap-3.5">
              <button
                className="w-full px-6 py-3.5 bg-brand-primary text-white font-bold text-[0.95rem] rounded-lg border-0 cursor-pointer transition-all shadow-brand text-center hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(168,85,247,0.55)]"
                onClick={handleBuyNow}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? 'Opening checkout…' : `Buy Now — $${price}`}
              </button>
              <div className="flex flex-col gap-2">
                <p className="text-[0.82rem] text-white/50">Or place a bid (min $29):</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="flex-1 bg-white/[0.04] border border-white/[0.12] rounded-lg px-3.5 py-2.5 text-white text-[0.9rem] outline-none transition-colors focus:border-brand-primary/50 placeholder:text-white/30"
                    placeholder="$29"
                    min={29}
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                  />
                  <button className={bidBtnClass} onClick={handlePlaceBid}>Place Bid</button>
                </div>
              </div>
            </div>
          )}

          {template.status === 'auction' && (
            <div className="flex flex-col gap-3.5">
              {template.auction_ends_at && (
                <div className="bg-brand-primary/[0.08] border border-brand-primary/20 rounded-lg px-3.5 py-2.5 text-brand-primary text-[0.9rem] font-semibold text-center">
                  Ends in: {timeLeft}
                </div>
              )}
              <div className="text-base font-semibold text-brand-primary">Current bid: ${template.current_bid ?? 0}</div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="flex-1 bg-white/[0.04] border border-white/[0.12] rounded-lg px-3.5 py-2.5 text-white text-[0.9rem] outline-none transition-colors focus:border-brand-primary/50 placeholder:text-white/30"
                    placeholder={`$${(template.current_bid ?? 28) + 1}`}
                    min={(template.current_bid ?? 28) + 1}
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                  />
                  <button className={bidBtnClass} onClick={handlePlaceBid}>Place Bid</button>
                </div>
              </div>
              {bids.length > 0 && (
                <div className="bg-white/[0.02] border border-white/[0.07] rounded-[10px] p-3.5">
                  <p className="text-[0.8rem] text-white/40 mb-2.5 uppercase tracking-wider">Bid history:</p>
                  {bids.map((b, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-white/[0.05] last:border-b-0 text-[0.83rem] text-white/65">
                      <span>{b.account_id.slice(0, 8)}…</span>
                      <span className="text-brand-primary font-semibold">${b.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {template.status === 'sold' && (
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 text-center flex flex-col gap-3.5">
              <p className="text-white/50 text-[0.9rem]">This template has been claimed.</p>
              <Link href="/scratch" className={bidBtnClass}>Join Waitlist via Scratch Ticket</Link>
            </div>
          )}
        </div>
      </main>

      <section className="bg-brand-primary/[0.04] border-y border-brand-primary/[0.12] py-10 px-6 text-center">
        <div className="max-w-[600px] mx-auto flex flex-col items-center gap-6">
          <h2 className="font-sora text-[1.4rem] font-bold text-white -tracking-[0.3px]">Get this website for your business</h2>
          <div className="flex gap-4 flex-wrap justify-center">
            {[
              { l: 'Buy now', p: `$${price} one-time` },
              { l: 'Hosting', p: '12 mo included' },
              { l: 'After year 1', p: 'from $14/mo' },
            ].map(o => (
              <div
                key={o.l}
                className="bg-white/[0.03] border border-white/10 rounded-xl px-6 py-4 flex flex-col items-center gap-1 min-w-[120px] transition-all hover:border-brand-primary/35 hover:-translate-y-0.5"
              >
                <span className="text-[0.9rem] font-semibold text-white">{o.l}</span>
                <span className="text-[0.8rem] text-brand-primary font-medium">{o.p}</span>
              </div>
            ))}
          </div>
          <Link href="/" className="text-white/50 no-underline text-[0.88rem] transition-colors hover:text-brand-primary">
            Or browse all templates →
          </Link>
        </div>
      </section>

      <footer className="py-6 px-6 border-t border-white/[0.06] text-center">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-white/[0.35] text-[0.82rem]">
            © 2025 Website Lotto · <Link href="/support" className="text-white/50 no-underline transition-colors hover:text-brand-primary">Support</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
