import type { ReactNode } from 'react'

export default function TextStudioPage({ children }: { children: ReactNode }) {
  return <section className="route-page route-page-text">{children}</section>
}
