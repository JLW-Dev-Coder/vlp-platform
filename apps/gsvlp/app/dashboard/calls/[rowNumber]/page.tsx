import LeadDetailClient from './LeadDetailClient';

export function generateStaticParams() {
  const params: { rowNumber: string }[] = [];
  for (let i = 1; i <= 3000; i++) {
    params.push({ rowNumber: String(i) });
  }
  return params;
}

interface Props {
  params: Promise<{ rowNumber: string }>;
}

export default async function LeadDetailPage({ params }: Props) {
  const { rowNumber } = await params;
  return <LeadDetailClient rowNumber={rowNumber} />;
}
