import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ImageIcon } from 'lucide-react'

import { cn } from '#/lib/utils'

/**
 * Image with a graceful, on-brand fallback while loading or when the url is
 * broken/missing. Renders a flat sand-coloured placeholder (no gradients).
 */
export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
  ratio = 'aspect-[4/5]',
}: {
  src?: string | null
  alt: string
  className?: string
  imgClassName?: string
  ratio?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  useEffect(() => {
    setLoaded(false)
    setErrored(false)
  }, [src])

  const showFallback = !src || errored

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-sand',
        ratio,
        className,
      )}
    >
      {!showFallback && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            'absolute inset-0 size-full object-cover transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
        />
      )}

      {showFallback && <ImagePlaceholder />}

      {!loaded && !showFallback && <Shimmer />}
    </div>
  )
}

function ImagePlaceholder() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-sand">
      <ImageIcon className="size-8 text-ink-soft/40" strokeWidth={1.25} />
    </div>
  )
}

function Shimmer() {
  return (
    <div className="absolute inset-0 animate-pulse bg-sand" aria-hidden>
      {null as ReactNode}
    </div>
  )
}
