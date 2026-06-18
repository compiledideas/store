import { Children, useRef  } from 'react'
import type {ReactNode} from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

import { cn } from '#/lib/utils'

/**
 * Horizontal, snap-scrolling rail of children with arrow controls.
 * Touch-friendly (native scroll) and RTL-aware. Each child is wrapped in a
 * responsive snap item.
 */
export function Rail({
  children,
  className,
  itemClassName,
}: {
  children: ReactNode
  className?: string
  itemClassName?: string
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const items = Children.toArray(children)

  const step = (dir: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    const distance = Math.min(el.clientWidth * 0.8, 720)
    el.scrollBy({
      left: dir * distance * (el.dir === 'rtl' ? -1 : 1),
      behavior: 'smooth',
    })
  }

  return (
    <div className={cn('relative', className)}>
      <div className="absolute -top-14 end-0 hidden items-center gap-2 md:flex">
        <RailButton label="Previous" onClick={() => step(-1)}>
          <ArrowLeftIcon className="size-4 rtl:hidden" />
          <ArrowRightIcon className="size-4 hidden rtl:block" />
        </RailButton>
        <RailButton label="Next" onClick={() => step(1)}>
          <ArrowRightIcon className="size-4 rtl:hidden" />
          <ArrowLeftIcon className="size-4 hidden rtl:block" />
        </RailButton>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 md:gap-5"
      >
        {items.map((child, i) => (
          <div
            key={i}
            className={cn(
              'w-[58vw] shrink-0 snap-start sm:w-[38vw] md:w-[28vw] lg:w-[21rem]',
              itemClassName,
            )}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

function RailButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-lagoon-deep hover:text-lagoon-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
    >
      {children}
    </button>
  )
}
