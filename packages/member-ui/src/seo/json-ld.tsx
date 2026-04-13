export interface BusinessJsonLdProps {
  name: string
  description: string
  url: string
  logo?: string
  type:
    | 'ProfessionalService'
    | 'WebApplication'
    | 'SoftwareApplication'
    | 'Product'
    | 'Organization'
  address?: { street: string; city: string; state: string; zip: string }
  priceRange?: string
}

export function BusinessJsonLd(props: BusinessJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': props.type,
    name: props.name,
    description: props.description,
    url: props.url,
  }

  if (props.logo) {
    jsonLd.logo = props.logo
  }

  if (props.address) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      streetAddress: props.address.street,
      addressLocality: props.address.city,
      addressRegion: props.address.state,
      postalCode: props.address.zip,
    }
  }

  if (props.priceRange) {
    jsonLd.priceRange = props.priceRange
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
