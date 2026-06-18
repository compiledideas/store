import type { Product, TopSellingProduct } from '@rackvise/storefront-sdk'
import { ProductCard } from './product-card'

type GridItem =
  | Product
  | (TopSellingProduct & { oldPrice?: number | null; variants?: never })

export function ProductGrid({ items }: { items: GridItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => (
        <ProductCard key={(p as Product).id} product={p} />
      ))}
    </div>
  )
}
