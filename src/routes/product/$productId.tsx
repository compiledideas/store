import { useMemo, useState } from 'react'
import {
  Link,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import {
  useStorefrontCart,
  useStorefrontProduct,
  useStorefrontProducts,
} from '@rackvise/storefront-sdk'
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ShoppingBagIcon,
  TruckIcon,
} from 'lucide-react'
import { z } from 'zod'

import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Separator } from '#/components/ui/separator'
import { ImageGallery } from '#/components/storefront/image-gallery'
import { Price } from '#/components/storefront/price'
import { QuantityStepper } from '#/components/storefront/quantity-stepper'
import { VariantPicker } from '#/components/storefront/variant-picker'
import { SectionHeading } from '#/components/storefront/section-heading'
import { Rail } from '#/components/storefront/rail'
import { ProductCard } from '#/components/storefront/product-card'
import {
  EmptyState,
  Spinner,
} from '#/components/storefront/states'
import {
  allImages,
  discountPercent,
  resolveStock,
  resolveUnitPrice,
} from '#/lib/format'
import { useUi } from '#/lib/ui-store'
import { useT } from '#/lib/i18n'
import { toast } from '#/lib/toast'
import { APP_TITLE, SITE_URL } from '#/env'
import { getStorefrontClient } from '#/lib/storefront-client'

export const Route = createFileRoute('/product/$productId')({
  params: {
    parse: (raw) => ({ productId: z.coerce.number().parse(raw.productId) }),
  },
  loader: async ({ params, context }) => {
    try {
      const client = getStorefrontClient()
      const apiKey = client.getApiKey()
      const product = await context.queryClient.ensureQueryData({
        queryKey: ['storefront', apiKey, 'product', params.productId],
        queryFn: () => client.getProduct(params.productId),
      })
      return { product }
    } catch {
      return { product: null }
    }
  },
  head: ({ loaderData, params }) => {
    const product = loaderData?.product
    const images = product ? allImages(product) : []
    const img = images[0]?.url
    return {
      meta: [
        {
          title: product
            ? `${product.name} — ${APP_TITLE}`
            : `Product — ${APP_TITLE}`,
        },
        {
          name: 'description',
          content:
            product?.description ||
            product?.name ||
            'View product details, check availability, and add to your cart.',
        },
        {
          property: 'og:title',
          content: product
            ? `${product.name} — ${APP_TITLE}`
            : `Product — ${APP_TITLE}`,
        },
        {
          property: 'og:description',
          content:
            product?.description ||
            product?.name ||
            'View product details, check availability, and add to your cart.',
        },
        { property: 'og:type', content: 'product' },
        ...(img ? [{ property: 'og:image' as const, content: img }] : []),
        {
          property: 'og:url',
          content: `${SITE_URL}/product/${params.productId}`,
        },
      ],
      links: [
        { rel: 'canonical', href: `${SITE_URL}/product/${params.productId}` },
      ],
    }
  },
  component: ProductPage,
})

function ProductPage() {
  const { productId } = Route.useParams()
  const t = useT()
  const { openCart } = useUi()
  const navigate = useNavigate()
  const { addToCart } = useStorefrontCart()

  const {
    data: product,
    isLoading,
    isError,
  } = useStorefrontProduct(productId)

  const [variantId, setVariantId] = useState<number | undefined>()
  const [subVariantId, setSubVariantId] = useState<number | undefined>()
  const [qty, setQty] = useState(1)

  const variant = useMemo(
    () => product?.variants?.find((v) => v.id === variantId),
    [product, variantId],
  )
  const subVariant = variant?.subVariants?.find((sv) => sv.id === subVariantId)

  if (isLoading) return <Spinner />
  if (isError)
    return <EmptyState icon="box" title={t.shop.noResults} description={t.home.joinSub} />
  if (!product)
    return (
      <EmptyState
        title={t.states.searchEmpty}
        action={
          <Button asChild>
            <Link to="/shop">{t.actions.backToShop}</Link>
          </Button>
        }
      />
    )

  const images = allImages(product)
  const needsVariant = (product.variants?.length ?? 0) > 0
  const needsSubVariant = !!variant && (variant.subVariants?.length ?? 0) > 0
  const selectionValid =
    !needsVariant || (!!variant && (!needsSubVariant || !!subVariant))

  const stock = resolveStock({ stock: product.stock }, variant, subVariant)
  const price = resolveUnitPrice(product, variant, subVariant)
  const oldPrice = product.oldPrice ?? undefined
  const pct = discountPercent(price, oldPrice)
  const soldOut = stock <= 0
  const canAdd = selectionValid && !soldOut

  const handleAdd = (buyNow: boolean) => {
    if (!canAdd) return
    addToCart(product, variant, subVariant, qty)
    if (buyNow) {
      navigate({ to: '/checkout' })
    } else {
      toast.success(product.name)
      openCart()
    }
  }

  const category = product.categories?.[0]?.category

  return (
    <div className="page-wrap py-8">
      <Link
        to="/shop"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4 rtl:rotate-180" />
        {t.actions.backToShop}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <ImageGallery
          images={images}
          alt={product.name}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <div className="space-y-6">
          <div className="space-y-3">
            {category && (
              <Link
                to="/category/$categoryId"
                params={{ categoryId: category.id }}
                className="text-xs font-bold uppercase tracking-[0.16em] text-lagoon-deep hover:underline"
              >
                {category.name}
              </Link>
            )}
            <h1 className="display-title text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <Price
                value={price}
                oldValue={oldPrice}
                size="lg"
                showFrom={needsVariant && !variant}
                fromLabel={t.product.from}
              />
              {pct > 0 && (
                <Badge variant="sale">
                  -{pct}% {t.product.off}
                </Badge>
              )}
            </div>

            <StockIndicator stock={stock} />
          </div>

          <Separator />

          {needsVariant && (
            <VariantPicker
              product={product}
              variantId={variantId}
              subVariantId={subVariantId}
              onVariantChange={setVariantId}
              onSubVariantChange={setSubVariantId}
            />
          )}

          <div className="flex flex-wrap items-center gap-3">
            <QuantityStepper
              value={qty}
              max={Math.max(1, stock)}
              onChange={setQty}
            />
            <Button
              size="lg"
              className="flex-1 rounded-full"
              disabled={!canAdd}
              onClick={() => handleAdd(false)}
            >
              <ShoppingBagIcon className="size-4" />
              {soldOut ? t.product.outOfStock : t.actions.addToCart}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              disabled={!canAdd}
              onClick={() => handleAdd(true)}
            >
              {t.actions.buyNow}
            </Button>
          </div>

          <ul className="grid gap-2 rounded-2xl border border-line bg-sand/50 p-4 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="inline-flex items-center gap-2">
              <TruckIcon className="size-4 text-lagoon-deep" />
              {t.brand.announcement.split('—')[0]}
            </li>
            <li className="inline-flex items-center gap-2">
              <CheckCircle2Icon className="size-4 text-lagoon-deep" />
              {t.checkout.cod}
            </li>
          </ul>

          {product.description && (
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
                {t.product.description}
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
              {t.product.details}
            </h2>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <DetailRow label={t.product.sku} value={product.sku} />
              {product.ageGroup && (
                <DetailRow
                  label={t.product.ageGroup}
                  value={product.ageGroup}
                />
              )}
              {product.gender && (
                <DetailRow label={t.product.gender} value={product.gender} />
              )}
            </dl>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: category?.name ?? 'Shop', item: category ? `${SITE_URL}/category/${category.id}` : `${SITE_URL}/shop` },
              { '@type': 'ListItem', position: 3, name: product.name },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description || product.name,
            sku: product.sku || undefined,
            image: images.map((i) => i.url),
            offers: {
              '@type': 'Offer',
              price: price,
              priceCurrency: 'MAD',
              availability: stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
          }),
        }}
      />

      <RelatedProducts
        productId={product.id}
        categoryId={category?.id ?? product.categories?.[0]?.categoryId}
      />
    </div>
  )
}

function StockIndicator({ stock }: { stock: number }) {
  const t = useT()
  if (stock <= 0) {
    return (
      <p className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive">
        <span className="size-2 rounded-full bg-destructive" />
        {t.product.outOfStock}
      </p>
    )
  }
  if (stock <= 5) {
    return (
      <p className="inline-flex items-center gap-1.5 text-sm font-medium text-warn">
        <span className="size-2 rounded-full bg-warn" />
        {t.product.lowStock.replace('{n}', String(stock))}
      </p>
    )
  }
  return (
    <p className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
      <span className="size-2 rounded-full bg-success" />
      {t.product.inStock}
    </p>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col rounded-lg border border-line bg-card px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  )
}

function RelatedProducts({
  productId,
  categoryId,
}: {
  productId: number
  categoryId?: number
}) {
  const t = useT()
  const { data } = useStorefrontProducts({
    categoryId,
    limit: 12,
  })
  const related = (data?.data ?? [])
    .filter((p) => p.id !== productId)
    .slice(0, 8)
  if (related.length === 0) return null
  return (
    <section className="mt-20 space-y-6">
      <SectionHeading title={t.product.relatedProducts} />
      <Rail>
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </Rail>
    </section>
  )
}
