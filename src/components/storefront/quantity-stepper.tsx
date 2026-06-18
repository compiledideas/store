import { MinusIcon, PlusIcon } from 'lucide-react'

import { cn } from '#/lib/utils'

/** Accessible quantity stepper with min/max clamping. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  className,
}: {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
  className?: string
}) {
  const dim = size === 'sm' ? 'size-8' : 'size-10'
  const icon = size === 'sm' ? 'size-3.5' : 'size-4'

  const clamp = (n: number) => Math.max(min, Math.min(max, n))

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-background',
        className,
      )}
      role="group"
      aria-label="Quantity"
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          'grid place-items-center rounded-s-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground',
          dim,
        )}
      >
        <MinusIcon className={icon} />
      </button>
      <span
        className="w-8 text-center text-sm font-semibold tabular-nums text-foreground"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(
          'grid place-items-center rounded-e-full text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground',
          dim,
        )}
      >
        <PlusIcon className={icon} />
      </button>
    </div>
  )
}
