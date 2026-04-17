'use client';

import { useEffect } from 'react';

export default function AffiliateRedirect() {
  useEffect(() => {
    const target = '/dashboard/affiliate';
    window.location.replace(target);
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      Redirecting to affiliate…
    </div>
  );
}
