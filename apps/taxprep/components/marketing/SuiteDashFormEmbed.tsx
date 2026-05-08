'use client'

import Script from 'next/script'

interface Props {
  formId: string
  embedBaseUrl: string
}

export function SuiteDashFormEmbed({ formId, embedBaseUrl }: Props) {
  return (
    <>
      <div id={`sd-form-${formId}`} className="tpp-form-sd" />
      <Script
        src={`${embedBaseUrl}/${formId}.js`}
        strategy="afterInteractive"
        id={`sd-form-script-${formId}`}
      />
    </>
  )
}
