import type { Product, ProductVariant, ProductSubVariant } from '@rackvise/storefront-sdk'

/** Resolve the unit price for a cart/line item (sub-variant > variant > product). */
export function resolveUnitPrice(
  product: Pick<Product, 'price'>,
  variant?: Pick<ProductVariant, 'price'> | null,
  subVariant?: Pick<ProductSubVariant, 'price'> | null,
): number {
  if (subVariant?.price) return Number(subVariant.price)
  if (variant?.price) return Number(variant.price)
  return Number(product.price) || 0
}

/** Resolve available stock for an item. */
export function resolveStock(
  product: Pick<Product, 'stock'>,
  variant?: Pick<ProductVariant, 'stock'> | null,
  subVariant?: Pick<ProductSubVariant, 'stock'> | null,
): number {
  if (subVariant && typeof subVariant.stock === 'number') return subVariant.stock
  if (variant && typeof variant.stock === 'number') return variant.stock
  return product.stock
}

/** First usable image url for a product (image > variant image > null). */
export function primaryImage(product: {
  images?: { url: string }[] | null
  variants?: { images?: { url: string }[] | null }[] | null
}): string | null {
  const img = product.images?.[0]?.url
  if (img) return img
  const variantImages = (product.variants ?? []).flatMap((v) => v.images ?? [])
  return variantImages[0]?.url ?? null
}

/** Collect all image urls for a product (product + variant images), deduped. */
export function allImages(product: {
  images?: { url: string; alt?: string | null }[] | null
  variants?: { images?: { url: string; alt?: string | null }[] | null }[] | null
}): { url: string; alt?: string | null }[] {
  const out: { url: string; alt?: string | null }[] = []
  for (const i of product.images ?? []) out.push({ url: i.url, alt: i.alt })
  for (const v of product.variants ?? []) {
    for (const i of v.images ?? []) {
      if (!out.some((o) => o.url === i.url)) out.push({ url: i.url, alt: i.alt })
    }
  }
  return out
}

/** Discount percentage from an old price (0 if none / invalid). */
export function discountPercent(price: number, oldPrice?: number | null): number {
  if (!oldPrice || oldPrice <= price) return 0
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}

/** Format a money amount. Keeps currency stable regardless of UI locale. */
export function formatPrice(amount: number, currency = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

/** Compact integer formatter (e.g. 1,240). */
export function formatCount(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

/** Truncate text to N chars with an ellipsis. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max - 1).trimEnd() + '…'
}
