'use client'

import { useEffect, useRef } from 'react'

interface Props {
  formId: string
  embedBaseUrl: string
  // Min height for the injected iframe. SD forms render as same-origin iframes
  // (width=100%, height=100%) and provide no postMessage auto-resize handshake,
  // so the parent must commit enough height for the form to display without
  // internal scrolling. Discovery-Call form needs ~1200px.
  minHeight?: number
}

export function SuiteDashFormEmbed({ formId, embedBaseUrl, minHeight = 1200 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const script = document.createElement('script')
    script.src = `${embedBaseUrl}/${formId}.js`
    script.async = true
    containerRef.current.appendChild(script)
  }, [formId, embedBaseUrl])

  return (
    <div
      ref={containerRef}
      className="tpp-form-sd"
      style={{ minHeight: `${minHeight}px` }}
    />
  )
}
