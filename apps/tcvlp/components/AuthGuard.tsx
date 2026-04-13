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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f1117' }}>
        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading…</div>
      </div>
    );
  }

  if (!session) return null;

  return <>{children(session)}</>;
}
