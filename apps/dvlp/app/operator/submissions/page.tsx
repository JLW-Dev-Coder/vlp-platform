'use client';

import { useRouter } from 'next/navigation';
import SubmissionsView from '../components/SubmissionsView';

export default function SubmissionsPage() {
  const router = useRouter();
  return (
    <SubmissionsView
      onSelectDev={(ref) => router.push(`/operator/developers?ref=${encodeURIComponent(ref)}`)}
    />
  );
}
