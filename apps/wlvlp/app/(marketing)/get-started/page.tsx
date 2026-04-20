import type { Metadata } from 'next';
import GetStartedClient from './GetStartedClient';

export const metadata: Metadata = {
  title: 'Get Started | Website Lotto',
  description:
    'Tell us about your business and Xavier will recommend the perfect website template. Service, finance, local, ecommerce, creative, tech, or real estate — we have layouts built to convert.',
};

export default function GetStartedPage() {
  return <GetStartedClient />;
}
