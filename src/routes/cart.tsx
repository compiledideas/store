import { createFileRoute, Link } from '@tanstack/react-router'
import { useStorefrontCart } from '@rackvise/storefront-sdk'
import { ArrowRightIcon, ShoppingBagIcon, Trash2Icon } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Separator } from '#/components/ui/separator'
import { ProductImage } from '#/components/storefront/product-image'
import { Price } from '#/components/storefront/price'
import { QuantityStepper } from '#/components/storefront/quantity-stepper'
import { EmptyState } from '#/components/storefront/states'
import {
  formatPrice,
  primaryImage,
  resolveStock,
  resolveUnitPrice,
} from '#/lib/format'
import { useT } from '#/lib/i18n'
import { FREE_SHIP_THRESHOLD, SHIPPING_FEE } from '#/lib/cart-config'

export const Route = createFileRoute('/cart')({ component: CartPage })

function CartPage() {
  const t = useT()
  const {
    items,
    subtotal,
    totalItems,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useStorefrontCart()

  if (items.length === 0) {
    return (
      <div className="page-wrap py-10">
        <h1 className="display-title mb-6 text-3xl font-semibold text-foreground sm:text-4xl">
          {t.cart.title}
        </h1>
        <EmptyState
          icon="cart"
          title={t.cart.empty}
          description={t.cart.emptySub}
          action={
            <Button asChild size="lg" className="rounded-full">
              <Link to="/shop">
                {t.actions.continueShopping}
                <ArrowRightIcon className="size-4 rtl:-scale-x-100" />
              </Link>
            </Button>
          }
        />
      </div>
    )
  }

  const shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + shipping

  return (
    <div className="page-wrap py-10">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="display-title text-3xl font-semibold text-foreground sm:text-4xl">
            {t.cart.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {totalItems} {totalItems === 1 ? t.cart.item.replace('{count}', '1') : t.cart.items.replace('{count}', String(totalItems))}
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-semibold text-muted-foreground transition-colors hover:text-destructive"
        >
          {t.actions.clear}
        </button>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        {/* Items */}
        <ul className="divide-y divide-border rounded-2xl border border-line bg-card">
          {items.map((item) => {
            const img = primaryImage(item.product) ?? undefined
            const unit = resolveUnitPrice(
              item.product,
              item.variant,
              item.subVariant,
            )
            const max = resolveStock(
              { stock: item.product.stock },
              item.variant,
              item.subVariant,
            )
            return (
              <li key={item.id} className="flex gap-4 p-4 sm:p-5">
                <Link
                  to="/product/$productId"
                  params={{ productId: item.product.id }}
                  className="shrink-0"
                >
                  <ProductImage
                    src={img}
                    alt={item.product.name}
                    ratio="aspect-square"
                    className="size-24 rounded-xl border border-line sm:size-28"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      to="/product/$productId"
                      params={{ productId: item.product.id }}
                      className="text-sm font-semibold text-foreground hover:text-lagoon-deep sm:text-base"
                    >
                      {item.product.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={t.actions.remove}
                      className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                  {(item.variant || item.subVariant) && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[item.variant?.name, item.subVariant?.size]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                    <QuantityStepper
                      value={item.quantity}
                      max={max}
                      onChange={(q) => updateQuantity(item.id, q)}
                    />
                    <Price value={unit * item.quantity} />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-4 rounded-2xl border border-line bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <ShoppingBagIcon className="size-5 text-lagoon-deep" />
              {t.checkout.summary}
            </h2>
            <Separator />
            <dl className="space-y-3 text-sm">
              <Row label={t.cart.subtotal} value={formatPrice(subtotal)} />
              <Row
                label={t.cart.shipping}
                value={
                  shipping === 0 ? t.cart.freeShip : formatPrice(shipping)
                }
              />
              <p className="text-xs text-muted-foreground">
                {t.cart.shippingNote} · {t.cart.taxNote}
              </p>
            </dl>
            <Separator />
            <div className="flex items-center justify-between text-base">
              <span className="font-semibold text-foreground">
                {t.cart.total}
              </span>
              <span className="display-title text-xl font-bold text-foreground">
                {formatPrice(total)}
              </span>
            </div>
            <Button asChild size="lg" className="w-full rounded-full">
              <Link to="/checkout">
                {t.actions.checkout}
                <ArrowRightIcon className="size-4 rtl:-scale-x-100" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full"
            >
              <Link to="/shop">{t.actions.continueShopping}</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  )
}
