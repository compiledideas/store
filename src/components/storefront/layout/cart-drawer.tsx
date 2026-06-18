import { Link, useNavigate } from '@tanstack/react-router'
import { ShoppingBagIcon, Trash2Icon } from 'lucide-react'
import { useStorefrontCart } from '@rackvise/storefront-sdk'

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { Button } from '#/components/ui/button'
import { ProductImage } from '../product-image'
import { Price } from '../price'
import { QuantityStepper } from '../quantity-stepper'
import { EmptyState } from '../states'
import {
  formatPrice,
  primaryImage,
  resolveStock,
  resolveUnitPrice,
} from '#/lib/format'
import { interpolate, useT } from '#/lib/i18n'
import { useUi } from '#/lib/ui-store'
import { FREE_SHIP_THRESHOLD } from '#/lib/cart-config'

export function CartDrawer() {
  const t = useT()
  const { cartOpen, closeCart } = useUi()
  const navigate = useNavigate()
  const {
    items,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart,
  } = useStorefrontCart()

  const goCheckout = () => {
    closeCart()
    navigate({ to: '/checkout' })
  }

  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal)
  const progress = Math.min(
    100,
    subtotal <= 0 ? 0 : (subtotal / FREE_SHIP_THRESHOLD) * 100,
  )

  return (
    <Sheet open={cartOpen} onOpenChange={closeCart}>
      <SheetContent side="end" onOpenChange={closeCart}>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBagIcon className="size-5 text-lagoon-deep" />
            {t.cart.title}
            <span className="text-sm font-normal text-muted-foreground">
              ({totalItems})
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 overflow-y-auto">
            <EmptyState
              icon="cart"
              title={t.cart.empty}
              description={t.cart.emptySub}
              action={
                <Button asChild onClick={closeCart}>
                  <Link to="/shop">{t.actions.continueShopping}</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="border-b border-border px-5 py-3">
              <p className="mb-2 text-xs text-muted-foreground">
                {remaining > 0
                  ? interpolate(
                      t.cart.shipping + ' — {n}',
                      { n: formatPrice(remaining) },
                    )
                  : t.cart.freeShip}
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand">
                <div
                  className="h-full rounded-full bg-lagoon-deep transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              <ul className="divide-y divide-border">
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
                    <li key={item.id} className="flex gap-3 py-4">
                      <Link
                        to="/product/$productId"
                        params={{ productId: item.product.id }}
                        onClick={closeCart}
                        className="shrink-0"
                      >
                        <ProductImage
                          src={img}
                          alt={item.product.name}
                          ratio="aspect-square"
                          className="size-20 rounded-lg border border-line"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to="/product/$productId"
                            params={{ productId: item.product.id }}
                            onClick={closeCart}
                            className="line-clamp-2 text-sm font-semibold text-foreground hover:text-lagoon-deep"
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
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {[item.variant?.name, item.subVariant?.size]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <QuantityStepper
                            size="sm"
                            value={item.quantity}
                            max={max}
                            onChange={(q) => updateQuantity(item.id, q)}
                          />
                          <Price value={unit * item.quantity} size="sm" />
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            <SheetFooter className="space-y-3">
              <div className="flex items-center justify-between text-base">
                <span className="text-muted-foreground">{t.cart.subtotal}</span>
                <span className="font-bold text-foreground">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={goCheckout}
              >
                {t.actions.checkout}
              </Button>
              <button
                type="button"
                onClick={closeCart}
                className="text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {t.actions.continueShopping}
              </button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
