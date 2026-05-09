'use client'

import { useEffect, useRef } from 'react'

interface Props {
  formId: string
  embedBaseUrl: string
}

export function SuiteDashFormEmbed({ formId, embedBaseUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const script = document.createElement('script')
    script.src = `${embedBaseUrl}/${formId}.js`
    script.async = true
    containerRef.current.appendChild(script)
  }, [formId, embedBaseUrl])

  return <div ref={containerRef} className="tpp-form-sd" />
}
