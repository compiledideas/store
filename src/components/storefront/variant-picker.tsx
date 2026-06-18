import { useMemo } from 'react'
import type { Product, ProductVariant } from '@rackvise/storefront-sdk'

import { cn } from '#/lib/utils'
import { useT } from '#/lib/i18n'

/**
 * Variant + sub-variant picker.
 * - If the product has variants, a variant must be selected.
 * - If that variant has sub-variants, a sub-variant must also be selected.
 */
export function VariantPicker({
  product,
  variantId,
  subVariantId,
  onVariantChange,
  onSubVariantChange,
}: {
  product: Product
  variantId?: number
  subVariantId?: number
  onVariantChange: (id: number | undefined) => void
  onSubVariantChange: (id: number | undefined) => void
}) {
  const t = useT()
  const variants = product.variants ?? []
  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === variantId),
    [variants, variantId],
  )
  const subVariants = selectedVariant?.subVariants ?? []

  if (variants.length === 0) return null

  return (
    <div className="space-y-5">
      <PickerGroup label={t.product.selectVariant}>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <OptionChip
              key={v.id}
              active={v.id === variantId}
              disabled={v.stock <= 0}
              onClick={() => {
                onVariantChange(v.id)
                onSubVariantChange(undefined)
              }}
            >
              {v.name}
            </OptionChip>
          ))}
        </div>
      </PickerGroup>

      {subVariants.length > 0 && (
        <PickerGroup label={t.product.selectSize}>
          <div className="flex flex-wrap gap-2">
            {subVariants.map((sv) => (
              <OptionChip
                key={sv.id}
                size={sv.size}
                active={sv.id === subVariantId}
                disabled={sv.stock <= 0}
                onClick={() => onSubVariantChange(sv.id)}
              >
                {sv.size ??
                  [sv.ageStart, sv.ageEnd]
                    .filter((x) => x !== null && x !== undefined)
                    .join('–')}
              </OptionChip>
            ))}
          </div>
        </PickerGroup>
      )}
    </div>
  )
}

function PickerGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      {children}
    </div>
  )
}

function OptionChip({
  active,
  disabled,
  onClick,
  children,
  size,
}: {
  active: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
  size?: string | null
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      title={disabled ? undefined : size ?? undefined}
      className={cn(
        'min-w-11 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40',
        active
          ? 'border-ink bg-ink text-background'
          : 'border-border bg-background text-foreground hover:border-ink',
      )}
    >
      {children}
    </button>
  )
}

export type { ProductVariant }
