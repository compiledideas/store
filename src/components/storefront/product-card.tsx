import { Link } from '@tanstack/react-router'
import { ShoppingBagIcon } from 'lucide-react'
import type { Product } from '@rackvise/storefront-sdk'

import { Badge } from '#/components/ui/badge'
import { ProductImage } from './product-image'
import { Price } from './price'
import {
  discountPercent,
  primaryImage,
  resolveStock,
  resolveUnitPrice,
} from '#/lib/format'
import { useT } from '#/lib/i18n'
import { useStorefrontCart } from '@rackvise/storefront-sdk'
import { toast } from '#/lib/toast'
import { cn } from '#/lib/utils'

/**
 * Minimal structural shape accepted by the card — compatible with both
 * `Product` and `TopSellingProduct` from the SDK.
 */
interface CardProduct {
  id: number
  name: string
  price: number
  oldPrice?: number | null
  stock: number
  images?: { url: string; alt?: string | null }[] | null
  variants?: { images?: { url: string; alt?: string | null }[] | null }[] | null
  totalSold?: number
}

export function ProductCard({
  product,
  className,
}: {
  product: CardProduct
  className?: string
}) {
  const t = useT()
  const { addToCart } = useStorefrontCart()

  const img = primaryImage(product) ?? undefined
  const price = resolveUnitPrice(product)
  const oldPrice = product.oldPrice ?? undefined
  const stock = resolveStock({ stock: product.stock })
  const pct = discountPercent(price, oldPrice)
  const sold = product.totalSold ?? 0
  const hasVariants = !!product.variants?.length
  const soldOut = stock <= 0
  const productId = product.id

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (hasVariants) return
    addToCart(product as Product)
    toast.success(`${product.name} ${t.actions.addToCart.toLowerCase()}`)
  }

  return (
    <Link
      to="/product/$productId"
      params={{ productId }}
      className={cn('group flex flex-col', className)}
    >
      <div className="zoom-frame relative rounded-2xl border border-line bg-card">
        <ProductImage
          src={img}
          alt={product.name}
          ratio="aspect-[4/5]"
          imgClassName="zoom-img"
          className="rounded-2xl"
        />

        <div className="pointer-events-none absolute start-3 top-3 flex flex-col gap-1.5">
          {pct > 0 && (
            <Badge variant="sale">-{pct}%</Badge>
          )}
          {sold > 0 && sold >= 50 && (
            <Badge variant="muted" className="bg-background/90">
              {sold}+ {t.product.sold}
            </Badge>
          )}
        </div>

        {soldOut && (
          <div className="absolute inset-0 grid place-items-center rounded-2xl bg-background/55 backdrop-blur-[1px]">
            <Badge variant="muted" className="bg-ink/80 text-background">
              {t.product.outOfStock}
            </Badge>
          </div>
        )}

        {!soldOut && !hasVariants && (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={t.actions.addToCart}
            className="absolute bottom-3 end-3 inline-flex size-10 translate-y-2 items-center justify-center rounded-full bg-ink text-background opacity-0 shadow-sm transition-all duration-300 hover:bg-lagoon-deep focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring group-hover:translate-y-0 group-hover:opacity-100"
          >
            <ShoppingBagIcon className="size-4" />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1.5 px-0.5">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-lagoon-deep">
          {product.name}
        </h3>
        {sold > 0 && (
          <p className="text-xs text-muted-foreground">
            {sold} {t.product.sold}
          </p>
        )}
        <div className="mt-auto pt-1">
          <Price value={price} oldValue={oldPrice} size="sm" showFrom={hasVariants} fromLabel={t.product.from} />
        </div>
      </div>
    </Link>
  )
}
