import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { cn } from '#/lib/utils'

/** Eyebrow + title + optional subtitle and "view all" link. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  viewAllTo,
  viewAllLabel,
  className,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  viewAllTo?: string
  viewAllLabel?: string
  className?: string
}) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div className="space-y-2">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-lagoon-deep">
            {eyebrow}
          </p>
        )}
        <h2 className="display-title text-2xl font-semibold text-foreground sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="max-w-xl text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {viewAllTo && viewAllLabel && (
        <Link
          to={viewAllTo}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-lagoon-deep transition-colors hover:text-lagoon"
        >
          {viewAllLabel}
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
