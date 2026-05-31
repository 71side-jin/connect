import type { ReactNode } from 'react'

export default function ImageStudioPage({ children }: { children: ReactNode }) {
  return <section className="route-page route-page-image">{children}</section>
}
