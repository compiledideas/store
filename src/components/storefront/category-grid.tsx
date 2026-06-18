import { Link } from '@tanstack/react-router'
import type { Category } from '@rackvise/storefront-sdk'
import { ArrowRightIcon } from 'lucide-react'

import { ProductImage } from './product-image'
import { formatCount } from '#/lib/format'
import { useT } from '#/lib/i18n'

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const t = useT()
  if (categories.length === 0) return null

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {categories.slice(0, 8).map((cat) => (
        <Link
          key={cat.id}
          to="/category/$categoryId"
          params={{ categoryId: cat.id }}
          className="zoom-frame group relative block overflow-hidden rounded-2xl border border-line bg-card"
        >
          <ProductImage
            src={cat.imageUrl}
            alt={cat.name}
            ratio="aspect-square"
            imgClassName="zoom-img"
            className="rounded-2xl"
          />
          <div className="absolute inset-0 bg-ink/25" />
          <div className="absolute inset-0 flex flex-col justify-end p-4 text-background">
            <h3 className="text-sm font-bold sm:text-base">{cat.name}</h3>
            <p className="mt-0.5 text-xs text-background/80">
              {formatCount(cat._count?.products ?? 0)} {t.shop.title.toLowerCase()}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100">
              {t.actions.viewAll}
              <ArrowRightIcon className="size-3.5 rtl:-scale-x-100" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
