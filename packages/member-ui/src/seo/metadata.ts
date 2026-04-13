import type { Metadata } from 'next'

export interface PageMetaProps {
  title: string
  description: string
  domain: string
  path: string
  ogImage?: string
}

export function generatePageMeta(props: PageMetaProps): Metadata {
  return {
    title: props.title,
    description: props.description,
    alternates: { canonical: `https://${props.domain}${props.path}` },
    openGraph: {
      title: props.title,
      description: props.description,
      url: `https://${props.domain}${props.path}`,
      siteName: props.title,
      images: props.ogImage ? [{ url: props.ogImage }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: props.title,
      description: props.description,
    },
  }
}
