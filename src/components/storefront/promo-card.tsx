import { Link } from '@tanstack/react-router'
import type { Promo } from '@rackvise/storefront-sdk'
import { ArrowRightIcon } from 'lucide-react'

import { useT } from '#/lib/i18n'

export function PromoCard({ promo }: { promo: Promo }) {
  const t = useT()
  return (
    <Link
      to="/promo/$promoId"
      params={{ promoId: promo.id }}
      className="group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-2xl border border-line bg-lagoon-deep p-6 text-background"
    >
      <div className="space-y-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
          {t.product.sale}
        </span>
        <h3 className="display-title text-xl font-semibold sm:text-2xl">
          {promo.title}
        </h3>
        {promo.subTitle && (
          <p className="max-w-xs text-sm text-background/80">{promo.subTitle}</p>
        )}
      </div>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
        {promo.products.length} {t.shop.title.toLowerCase()}
        <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
      </span>
    </Link>
  )
}
