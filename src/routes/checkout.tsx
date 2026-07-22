import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  useStorefrontCart,
  useStorefrontCheckout,
} from '@rackvise/storefront-sdk'
import type { OrderResponse } from '@rackvise/storefront-sdk'
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  LockIcon,
  TagIcon,
  WalletIcon,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Separator } from '#/components/ui/separator'
import { EmptyState, InlineSpinner } from '#/components/storefront/states'
import { formatPrice } from '#/lib/format'
import { useT } from '#/lib/i18n'
import { APP_TITLE, SITE_URL } from '#/env'
import { toast } from '#/lib/toast'
import { FREE_SHIP_THRESHOLD, SHIPPING_FEE } from '#/lib/cart-config'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/checkout')({
  head: () => ({
    meta: [
      { title: `Checkout — ${APP_TITLE}` },
      {
        name: 'description',
        content:
          'Complete your order with cash on delivery. Secure checkout process.',
      },
      { property: 'og:title', content: `Checkout — ${APP_TITLE}` },
      {
        property: 'og:description',
        content:
          'Complete your order with cash on delivery.',
      },
      { property: 'og:url', content: `${SITE_URL}/checkout` },
    ],
    links: [{ rel: 'canonical', href: `${SITE_URL}/checkout` }],
  }),
  component: CheckoutPage,
})

interface FormState {
  clientName: string
  clientPhone: string
  clientEmail: string
  shippingAddress: string
  city: string
}

function CheckoutPage() {
  const t = useT()
  const { items, subtotal, totalItems } = useStorefrontCart()
  const {
    activeCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    isApplyingCoupon,
    total: couponTotal,
    submitCheckout,
    isSubmittingOrder,
  } = useStorefrontCheckout()

  const [form, setForm] = useState<FormState>({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    shippingAddress: '',
    city: '',
  })
  const [couponInput, setCouponInput] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  )
  const [order, setOrder] = useState<OrderResponse | null>(null)

  const shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE
  const discount = activeCoupon?.discountAmount ?? 0
  const total = couponTotal + shipping

  if (order) return <SuccessView order={order} />

  if (items.length === 0 && !isSubmittingOrder) {
    return (
      <div className="page-wrap py-10">
        <h1 className="display-title mb-6 text-3xl font-semibold text-foreground sm:text-4xl">
          {t.checkout.title}
        </h1>
        <EmptyState
          icon="cart"
          title={t.cart.empty}
          description={t.checkout.emptyError}
          action={
            <Button asChild size="lg" className="rounded-full">
              <Link to="/shop">{t.actions.continueShopping}</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.clientName.trim()) next.clientName = 'required'
    if (!form.clientPhone.trim()) next.clientPhone = 'required'
    else if (!/^[+\d][\d\s-]{5,}$/.test(form.clientPhone.trim()))
      next.clientPhone = 'invalidPhone'
    if (!form.shippingAddress.trim()) next.shippingAddress = 'required'
    if (form.clientEmail && !/^\S+@\S+\.\S+$/.test(form.clientEmail))
      next.clientEmail = 'invalidEmail'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      toast.error(t.states.error)
      return
    }
    try {
      const res = await submitCheckout({
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        clientEmail: form.clientEmail || undefined,
        shippingAddress: [form.shippingAddress, form.city]
          .filter(Boolean)
          .join(', '),
      })
      setOrder(res)
      toast.success(t.checkout.successTitle)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.states.error)
    }
  }

  const handleApplyCoupon = async () => {
    const code = couponInput.trim()
    if (!code) return
    try {
      await applyCoupon(code)
    } catch {
      // Handled internally by hook exposing couponError
    }
  }

  return (
    <div className="page-wrap py-10">
      <h1 className="display-title mb-8 text-3xl font-semibold text-foreground sm:text-4xl">
        {t.checkout.title}
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        {/* Main Details Form */}
        <form id="checkout-form" onSubmit={onSubmit} className="space-y-8">
          {/* Contact */}
          <Section title={t.checkout.contact}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t.checkout.name}
                error={errors.clientName}
                required
              >
                <Input
                  value={form.clientName}
                  onChange={(e) => set('clientName', e.target.value)}
                  autoComplete="name"
                />
              </Field>
              <Field
                label={t.checkout.phone}
                error={errors.clientPhone}
                required
              >
                <Input
                  type="tel"
                  value={form.clientPhone}
                  onChange={(e) => set('clientPhone', e.target.value)}
                  autoComplete="tel"
                  placeholder="+212 …"
                />
              </Field>
              <Field label={t.checkout.email} error={errors.clientEmail}>
                <Input
                  type="email"
                  value={form.clientEmail}
                  onChange={(e) => set('clientEmail', e.target.value)}
                  autoComplete="email"
                />
              </Field>
            </div>
          </Section>

          {/* Shipping */}
          <Section title={t.checkout.shipping}>
            <div className="grid gap-4">
              <Field
                label={t.checkout.address}
                error={errors.shippingAddress}
                required
              >
                <Input
                  value={form.shippingAddress}
                  onChange={(e) => set('shippingAddress', e.target.value)}
                  autoComplete="street-address"
                />
              </Field>
              <Field label={t.checkout.city}>
                <Input
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  autoComplete="address-level2"
                />
              </Field>
            </div>
          </Section>

          {/* Payment (COD) */}
          <Section title={t.checkout.payment}>
            <div className="flex items-start gap-3 rounded-xl border border-lagoon/30 bg-lagoon-tint/50 p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-lagoon-deep text-background">
                <WalletIcon className="size-4.5" />
              </span>
              <div className="space-y-0.5">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {t.checkout.cod}
                  <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase text-success">
                    {t.product.inStock}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.checkout.codNote}
                </p>
              </div>
            </div>
          </Section>
        </form>

        {/* Summary Sidebar */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="space-y-4 rounded-2xl border border-line bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">
              {t.checkout.summary}
              <span className="ms-2 text-sm font-normal text-muted-foreground">
                ({totalItems})
              </span>
            </h2>

            {/* Coupon */}
            {activeCoupon ? (
              <div className="flex items-center justify-between rounded-xl border border-success/30 bg-success/10 px-3 py-2.5 text-sm">
                <span className="flex items-center gap-2 font-semibold text-success">
                  <TagIcon className="size-4" />
                  {activeCoupon.code}
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs font-semibold text-muted-foreground hover:text-destructive"
                >
                  {t.checkout.removeCoupon}
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleApplyCoupon()
                      }
                    }}
                    placeholder={t.checkout.coupon}
                    aria-label={t.checkout.coupon}
                    className="h-9 uppercase"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isApplyingCoupon}
                    onClick={handleApplyCoupon}
                  >
                    {isApplyingCoupon ? <InlineSpinner className="size-4" /> : t.actions.apply}
                  </Button>
                </div>
              </div>
            )}
            {couponError && (
              <p className="text-xs font-medium text-destructive" role="alert">
                {t.checkout.couponInvalid}
              </p>
            )}

            <Separator />

            <dl className="space-y-2.5 text-sm">
              <Row label={t.cart.subtotal} value={formatPrice(subtotal)} />
              {discount > 0 && (
                <Row
                  label={t.cart.discount}
                  value={`- ${formatPrice(discount)}`}
                  accent="success"
                />
              )}
              <Row
                label={t.cart.shipping}
                value={shipping === 0 ? t.cart.freeShip : formatPrice(shipping)}
              />
            </dl>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">
                {t.cart.total}
              </span>
              <span className="display-title text-xl font-bold text-foreground">
                {formatPrice(total)}
              </span>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              size="lg"
              className="w-full rounded-full"
              disabled={isSubmittingOrder}
            >
              {isSubmittingOrder ? (
                <InlineSpinner className="size-4" />
              ) : (
                <LockIcon className="size-4" />
              )}
              {t.actions.placeOrder}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <LockIcon className="size-3" />
              {t.cart.taxNote}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
        {title}
      </h2>
      <div className="rounded-2xl border border-line bg-card p-5">{children}</div>
    </section>
  )
}

function Field({
  label,
  children,
  error,
  required,
}: {
  label: string
  children: React.ReactNode
  error?: string
  required?: boolean
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center gap-1 text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive">*</span>}
      </span>
      {children}
      {error && (
        <span className="text-xs font-medium text-destructive" role="alert">
          {error}
        </span>
      )}
    </label>
  )
}

function Row({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: 'success'
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          'font-semibold',
          accent === 'success' ? 'text-success' : 'text-foreground',
        )}
      >
        {value}
      </dd>
    </div>
  )
}

function SuccessView({ order }: { order: OrderResponse }) {
  const t = useT()
  return (
    <div className="page-wrap py-20">
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-success/15 text-success rise-in">
          <CheckCircle2Icon className="size-9" />
        </span>
        <div className="space-y-2">
          <h1 className="display-title text-3xl font-semibold text-foreground">
            {t.checkout.successTitle}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t.checkout.successSub}
          </p>
        </div>

        <dl className="w-full space-y-2 rounded-2xl border border-line bg-card p-5 text-start">
          <Row label={t.checkout.orderNumber} value={order.orderNumber} />
          <Row
            label={t.checkout.orderTotal}
            value={formatPrice(order.totalAmount)}
          />
          <Row label={t.checkout.name} value={order.clientName} />
          <Row label={t.checkout.shipping} value={order.shippingAddress} />
        </dl>

        <Button asChild size="lg" className="w-full rounded-full">
          <Link to="/shop">
            {t.actions.continueShopping}
            <ArrowRightIcon className="size-4 rtl:-scale-x-100" />
          </Link>
        </Button>
        <Button asChild variant="link">
          <Link to="/">{t.actions.backToHome}</Link>
        </Button>
      </div>
    </div>
  )
}
