'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, Session } from '@/lib/api';

interface AuthGuardProps {
  children: (session: Session) => React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((s) => {
      if (!s) {
        router.replace('/sign-in');
      } else {
        setSession(s);
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#1a0a10' }}>
        <div style={{ color: '#ffd700', fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem' }}>Loading…</div>
      </div>
    );
  }

  if (!session) return null;

  return <>{children(session)}</>;
}
