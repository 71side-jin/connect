import type { HTMLAttributes } from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': HTMLAttributes<HTMLElement> & {
        src?: string
        poster?: string
        alt?: string
        exposure?: string
        'shadow-intensity'?: string
        'camera-controls'?: boolean
        'auto-rotate'?: boolean
        'auto-rotate-delay'?: string
        'rotation-per-second'?: string
        'interaction-prompt'?: string
        'disable-zoom'?: boolean
        'touch-action'?: string
        class?: string
      }
    }
  }
}
