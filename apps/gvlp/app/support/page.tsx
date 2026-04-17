'use client';

import { useEffect } from 'react';

export default function SupportRedirect() {
  useEffect(() => {
    const target = '/help';
    window.location.replace(target);
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      Redirecting to help center…
    </div>
  );
}
