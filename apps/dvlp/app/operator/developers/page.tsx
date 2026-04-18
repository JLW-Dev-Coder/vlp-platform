'use client';

import { useEffect, useState } from 'react';
import DevelopersView from '../components/DevelopersView';
import DeveloperDetailView from '../components/DeveloperDetailView';

export default function DevelopersPage() {
  const [selectedRef, setSelectedRef] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) setSelectedRef(ref);
    setReady(true);
  }, []);

  if (!ready) return null;

  if (selectedRef) {
    return (
      <DeveloperDetailView
        ref_number={selectedRef}
        onBack={() => setSelectedRef(null)}
      />
    );
  }
  return <DevelopersView onSelectDev={setSelectedRef} />;
}
