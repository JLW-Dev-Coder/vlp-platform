'use client';

import { useEffect, useState } from 'react';
import ClaimClient from './ClaimClient';
import { getProBySlug, TaxPro } from '@/lib/api';

interface Props {
  slug: string;
}

export default function ClaimLoader({ slug }: Props) {
  const [pro, setPro] = useState<TaxPro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (slug) {
        const p = await getProBySlug(slug);
        if (!cancelled) setPro(p);
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f1117' }}>
        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading…</div>
      </div>
    );
  }

  return <ClaimClient pro={pro} slug={slug} />;
}
