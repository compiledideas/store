import { formatPrice } from '#/lib/format'
import { cn } from '#/lib/utils'

/** Price with optional struck-through old price and a sale colour. */
export function Price({
  value,
  oldValue,
  className,
  size = 'md',
  showFrom = false,
  fromLabel,
}: {
  value: number
  oldValue?: number | null
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showFrom?: boolean
  fromLabel?: string
}) {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  } as const

  return (
    <span className={cn('flex items-baseline gap-2', className)}>
      {showFrom && fromLabel && (
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {fromLabel}
        </span>
      )}
      <span className={cn('font-bold text-ink', sizes[size])}>
        {formatPrice(value)}
      </span>
      {oldValue && oldValue > value && (
        <span
          className={cn(
            'text-muted-foreground line-through',
            size === 'lg' ? 'text-sm' : 'text-xs',
          )}
        >
          {formatPrice(oldValue)}
        </span>
      )}
    </span>
  )
}
