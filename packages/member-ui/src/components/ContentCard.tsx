import type { ReactNode } from 'react'

interface ContentCardProps {
  title: string
  children: ReactNode
  headerAction?: ReactNode
}

export function ContentCard({ title, children, headerAction }: ContentCardProps) {
  return (
    <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-widest text-white/40">{title}</h3>
        {headerAction}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}
