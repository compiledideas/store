import type { GetProductsParams } from '@rackvise/storefront-sdk'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { useT } from '#/lib/i18n'

type Sort = NonNullable<GetProductsParams['sort']>

const SORTS: Sort[] = ['createdAt-desc', 'price-asc', 'price-desc', 'name-asc']

export function SortSelect({
  value,
  onChange,
}: {
  value: Sort
  onChange: (next: Sort) => void
}) {
  const t = useT()
  return (
    <Select value={value} onValueChange={(v) => onChange(v as Sort)}>
      <SelectTrigger size="sm" className="min-w-48" aria-label={t.shop.sort}>
        <span className="text-muted-foreground">{t.shop.sort}:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {SORTS.map((s) => (
          <SelectItem key={s} value={s}>
            {t.sort[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
