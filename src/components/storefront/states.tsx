import { AlertCircleIcon, RefreshCcwIcon, SearchIcon } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { useT } from '#/lib/i18n'

/** Centered spinner. */
export function Spinner({ className }: { className?: string }) {
  return (
    <div className={className ?? 'grid min-h-[40vh] place-items-center'}>
      <span className="block size-8 animate-spin rounded-full border-2 border-lagoon/25 border-t-lagoon" />
    </div>
  )
}

export function InlineSpinner({ className }: { className?: string }) {
  return (
    <span
      className={
        className ?? 'block size-5 animate-spin rounded-full border-2 border-primary/25 border-t-primary'
      }
    />
  )
}

/** Full-section loading skeleton for product grids. */
export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="aspect-[4/5] w-full animate-pulse rounded-xl bg-sand" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-sand" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-sand" />
        </div>
      ))}
    </div>
  )
}

/** Error state with retry. `onRetry` optional. */
export function ErrorState({
  onRetry,
  message,
}: {
  onRetry?: () => void
  message?: string
}) {
  const t = useT()
  return (
    <div className="grid min-h-[40vh] place-items-center px-6 py-16 text-center">
      <div className="flex max-w-sm flex-col items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircleIcon className="size-6" />
        </span>
        <h3 className="text-lg font-semibold text-foreground">
          {message ?? t.states.error}
        </h3>
        <p className="text-sm text-muted-foreground">{t.states.errorSub}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="mt-2">
            <RefreshCcwIcon className="size-4" />
            {t.states.retry}
          </Button>
        )}
      </div>
    </div>
  )
}

/** Empty state with icon, message, and optional action. */
export function EmptyState({
  icon = 'search',
  title,
  description,
  action,
}: {
  icon?: 'search' | 'cart' | 'box'
  title: string
  description?: string
  action?: React.ReactNode
}) {
  const Icon = icon === 'cart' ? CartGlyph : icon === 'box' ? BoxGlyph : SearchIcon
  return (
    <div className="grid place-items-center px-6 py-20 text-center">
      <div className="flex max-w-sm flex-col items-center gap-3">
        <span className="grid size-14 place-items-center rounded-full bg-sand text-ink-soft">
          <Icon className="size-6" />
        </span>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {action}
      </div>
    </div>
  )
}

function CartGlyph(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M2 3h2.5l2.3 12.3a2 2 0 0 0 2 1.7h8.2a2 2 0 0 0 2-1.6L21 7H6" />
    </svg>
  )
}

function BoxGlyph(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
      <path d="m3 8 9 5 9-5" />
      <path d="M12 13v8" />
    </svg>
  )
}
