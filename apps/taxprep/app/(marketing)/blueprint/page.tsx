import { Metadata } from 'next';
import BlueprintClient from './blueprint-client';

export const metadata: Metadata = {
  title: 'Free Client Journey Blueprint | Tax Prep Pro',
  description:
    'Download the 8-Phase Tax Prep Client Journey Blueprint. Every phase, every step, every automation — mapped out for your tax prep firm.',
};

export default function BlueprintPage() {
  return <BlueprintClient />;
}
