import { SlidersHorizontalIcon } from 'lucide-react'
import type { Category } from '@rackvise/storefront-sdk'

import { Button } from '#/components/ui/button'
import { Separator } from '#/components/ui/separator'
import { useT } from '#/lib/i18n'
import { cn } from '#/lib/utils'

export interface ShopFiltersState {
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  gender?: string
  ageGroup?: string
}

const GENDERS = ['MALE', 'FEMALE', 'UNISEX']
const AGE_GROUPS = ['BABY', 'KID', 'TEEN', 'ADULT']

export function ShopFilters({
  categories,
  value,
  onChange,
  onReset,
  hideCategoryFilter = false,
  className,
}: {
  categories: Category[]
  value: ShopFiltersState
  onChange: (next: Partial<ShopFiltersState>) => void
  onReset: () => void
  hideCategoryFilter?: boolean
  className?: string
}) {
  const t = useT()

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-foreground">
          <SlidersHorizontalIcon className="size-4 text-lagoon-deep" />
          {t.shop.filters}
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-lagoon-deep hover:underline"
        >
          {t.shop.reset}
        </button>
      </div>

      {/* Category Filter - only shown when enabled */}
      {!hideCategoryFilter && (
        <>
          <Separator />
          <FilterGroup label={t.shop.category}>
            <ul className="space-y-1.5">
              <FilterRadio
                label={t.actions.viewAll}
                checked={!value.categoryId}
                onChange={() => onChange({ categoryId: undefined })}
              />
              {categories.map((c) => (
                <FilterRadio
                  key={c.id}
                  label={c.name}
                  checked={value.categoryId === c.id}
                  onChange={() => onChange({ categoryId: c.id })}
                />
              ))}
            </ul>
          </FilterGroup>
          <Separator />
        </>
      )}

      {/* Price */}
      <FilterGroup label={t.shop.price}>
        <div className="flex items-center gap-2">
          <NumberInput
            ariaLabel="Min price"
            placeholder="0"
            value={value.minPrice}
            onChange={(n) => onChange({ minPrice: n })}
          />
          <span className="text-muted-foreground">—</span>
          <NumberInput
            ariaLabel="Max price"
            placeholder="999"
            value={value.maxPrice}
            onChange={(n) => onChange({ maxPrice: n })}
          />
        </div>
      </FilterGroup>

      <Separator />

      {/* Gender */}
      <FilterGroup label={t.product.gender}>
        <div className="flex flex-wrap gap-1.5">
          {GENDERS.map((g) => (
            <Chip
              key={g}
              active={value.gender === g}
              onClick={() =>
                onChange({ gender: value.gender === g ? undefined : g })
              }
            >
              {g}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <Separator />

      {/* Age group */}
      <FilterGroup label={t.product.ageGroup}>
        <div className="flex flex-wrap gap-1.5">
          {AGE_GROUPS.map((a) => (
            <Chip
              key={a}
              active={value.ageGroup === a}
              onClick={() =>
                onChange({ ageGroup: value.ageGroup === a ? undefined : a })
              }
            >
              {a}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <Button variant="outline" className="w-full" onClick={onReset}>
        {t.shop.reset}
      </Button>
    </div>
  )
}

function FilterGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  )
}

function FilterRadio({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        className={cn(
          'text-sm transition-colors',
          checked
            ? 'font-semibold text-lagoon-deep'
            : 'text-foreground hover:text-lagoon-deep',
        )}
      >
        <span className="me-2 inline-block size-3.5 translate-y-px rounded-full border border-border align-middle">
          <span
            className={cn(
              'block size-full scale-[0.55] rounded-full bg-lagoon-deep transition-transform',
              checked ? 'scale-100' : 'scale-0',
            )}
          />
        </span>
        {label}
      </button>
    </li>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
        active
          ? 'border-lagoon-deep bg-lagoon-tint text-lagoon-deep'
          : 'border-border text-muted-foreground hover:border-ink-soft/40',
      )}
    >
      {children}
    </button>
  )
}

function NumberInput({
  value,
  onChange,
  ariaLabel,
  placeholder,
}: {
  value?: number
  onChange: (n: number | undefined) => void
  ariaLabel: string
  placeholder?: string
}) {
  return (
    <input
      type="number"
      min={0}
      inputMode="numeric"
      aria-label={ariaLabel}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(e) =>
        onChange(e.target.value === '' ? undefined : Number(e.target.value))
      }
      className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-sm outline-none focus:border-lagoon-deep"
    />
  )
}
