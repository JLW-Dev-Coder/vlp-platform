'use client';

import { useEffect } from 'react';

export default function SupportRedirect() {
  useEffect(() => {
    const target = '/dashboard/support';
    window.location.replace(target);
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      Redirecting to support…
    </div>
  );
}
