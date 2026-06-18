import * as React from 'react'
import { Slot } from 'radix-ui'
import { cva  } from 'class-variance-authority'
import type {VariantProps} from 'class-variance-authority';

import { cn } from '#/lib/utils.ts'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border border-border text-foreground',
        sale: 'bg-sale/10 text-sale',
        success: 'bg-success/10 text-success',
        warn: 'bg-warn/10 text-warn',
        info: 'bg-info/10 text-info',
        muted: 'bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'span'
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
