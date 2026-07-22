import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { ProductImage } from './product-image'
import { cn } from '#/lib/utils'

type Slide = { url: string; alt?: string | null }

export function ImageGallery({
  images,
  alt,
  className,
}: {
  images: Slide[]
  alt: string
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)
  const count = images.length

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + count) % Math.max(count, 1))
    },
    [count],
  )

  useEffect(() => {
    setIndex(0)
  }, [images])

  if (count === 0) {
    return (
      <ProductImage
        src={null}
        alt={alt}
        ratio="aspect-[4/5]"
        className={cn('rounded-2xl border border-line', className)}
      />
    )
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        className="zoom-frame group relative overflow-hidden rounded-2xl border border-line bg-card"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
          touchX.current = null
        }}
      >
        <div className="relative aspect-[4/5]">
          {images.map((img, i) => (
            <img
              key={img.url + i}
              src={img.url}
              alt={img.alt ?? alt}
              loading={i === 0 ? 'eager' : 'lazy'}
              className={cn(
                'zoom-img absolute inset-0 size-full object-cover transition-opacity duration-500',
                i === index ? 'opacity-100' : 'opacity-0',
              )}
            />
          ))}
        </div>

        {count > 1 && (
          <>
            <GalleryArrow side="start" label="Previous" onClick={() => go(-1)} />
            <GalleryArrow side="end" label="Next" onClick={() => go(1)} />
            <div className="absolute bottom-3 start-1/2 flex -translate-x-1/2 gap-1.5 rtl:translate-x-1/2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === index
                      ? 'w-5 bg-background'
                      : 'w-1.5 bg-background/55 hover:bg-background/80',
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.url + 't' + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'relative size-16 shrink-0 overflow-hidden rounded-lg border transition-colors',
                i === index
                  ? 'border-lagoon-deep ring-2 ring-lagoon/30'
                  : 'border-line hover:border-ink-soft/40',
              )}
            >
              <ProductImage
                src={img.url}
                alt={img.alt ?? alt}
                ratio="aspect-square"
                className="size-full rounded-lg"
                imgClassName="size-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function GalleryArrow({
  side,
  label,
  onClick,
}: {
  side: 'start' | 'end'
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-ink opacity-0 backdrop-blur-sm transition-all hover:bg-background focus-visible:opacity-100 group-hover:opacity-100',
        side === 'start' ? 'start-3' : 'end-3',
      )}
    >
      {side === 'start' ? (
        <ChevronLeftIcon className="size-5 rtl:hidden" />
      ) : (
        <ChevronRightIcon className="size-5 rtl:hidden" />
      )}
      {side === 'start' ? (
        <ChevronRightIcon className="hidden size-5 rtl:block" />
      ) : (
        <ChevronLeftIcon className="hidden size-5 rtl:block" />
      )}
    </button>
  )
}
