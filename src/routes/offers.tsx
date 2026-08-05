import { createFileRoute, Link } from '@tanstack/react-router'
import { useStorefrontPromos } from '@rackvise/storefront-sdk'
import { ArrowLeftIcon } from 'lucide-react'
import { useMemo } from 'react'

import { ProductGrid } from '#/components/storefront/product-grid'
import { PromoCard } from '#/components/storefront/promo-card'
import { EmptyState, Spinner } from '#/components/storefront/states'
import { useT } from '#/lib/i18n'
import { APP_TITLE, SITE_URL } from '#/env'
import { getStorefrontClient } from '#/lib/storefront-client'

export const Route = createFileRoute('/offers')({
  loader: async ({ context }) => {
    try {
      const client = getStorefrontClient()
      const apiKey = client.getApiKey()
      const promos = await context.queryClient.ensureQueryData({
        queryKey: ['storefront', apiKey, 'promos'],
        queryFn: () => client.getActivePromos(),
      })
      return { promos }
    } catch {
      return { promos: [] as never[] }
    }
  },
  head: ({ match }) => {
    const siteName = match.context.config?.name || APP_TITLE
    return {
      meta: [
        { title: `Offers — ${siteName}` },
        {
          name: 'description',
          content: 'Browse all discounted products across our current promotions. Save big on curated essentials while stocks last.',
        },
        { property: 'og:title', content: `Offers — ${siteName}` },
        {
          property: 'og:description',
          content: 'Browse all discounted products across our current promotions.',
        },
        { property: 'og:url', content: `${SITE_URL}/offers` },
      ],
      links: [{ rel: 'canonical', href: `${SITE_URL}/offers` }],
    }
  },
  component: OffersPage,
})

function OffersPage() {
  const t = useT()
  const { data: promos, isLoading, isError } = useStorefrontPromos()

  const discountedProducts = useMemo(() => {
    const productsMap = new Map<number, any>()
    for (const promo of promos ?? []) {
      for (const product of promo.products) {
        if (!productsMap.has(product.id)) {
          productsMap.set(product.id, {
            ...product,
            oldPrice: product.price,
            price: product.promoPrice ?? product.price,
          })
        }
      }
    }
    return Array.from(productsMap.values())
  }, [promos])

  if (isLoading) return <Spinner />
  if (isError)
    return (
      <EmptyState
        icon="box"
        title={t.states.error}
        description={t.states.errorSub}
      />
    )

  return (
    <div className="page-wrap py-10">
      <Link
        to="/shop"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4 rtl:rotate-180" />
        {t.actions.backToShop}
      </Link>

      <header className="mb-8 space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-lagoon-deep">
          {t.product.sale}
        </p>
        <h1 className="display-title text-3xl font-semibold text-foreground sm:text-4xl">
          {t.home.promo}
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">
          {t.home.promoSub}
        </p>
      </header>

      {promos && promos.length > 0 && (
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      )}

      {discountedProducts.length > 0 ? (
        <>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            {t.product.sale}
          </h2>
          <ProductGrid items={discountedProducts as never[]} />
        </>
      ) : (
        <EmptyState icon="box" title={t.states.searchEmpty} />
      )}
    </div>
  )
}
