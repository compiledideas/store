import { createFileRoute, Link } from '@tanstack/react-router'
import { useStorefrontPromos } from '@rackvise/storefront-sdk'
import { z } from 'zod'
import { ArrowLeftIcon } from 'lucide-react'

import { ProductGrid } from '#/components/storefront/product-grid'
import { Button } from '#/components/ui/button'
import { EmptyState, Spinner } from '#/components/storefront/states'
import { useT } from '#/lib/i18n'
import { APP_TITLE, SITE_URL } from '#/env'
import { getStorefrontClient } from '#/lib/storefront-client'

export const Route = createFileRoute('/promo/$promoId')({
  params: {
    parse: (raw) => ({ promoId: z.coerce.number().parse(raw.promoId) }),
  },
  loader: async ({ params, context }) => {
    try {
      const client = getStorefrontClient()
      const apiKey = client.getApiKey()
      const promos = await context.queryClient.ensureQueryData({
        queryKey: ['storefront', apiKey, 'promos'],
        queryFn: () => client.getActivePromos(),
      })
      const promo = promos.find((p) => p.id === params.promoId) ?? null
      return { promo }
    } catch {
      return { promo: null }
    }
  },
  head: ({ loaderData, params, match }) => {
    const promo = loaderData?.promo
    const siteName = match.context.config?.name || APP_TITLE
    return {
      meta: [
        {
          title: promo
            ? `${promo.title} — ${siteName}`
            : `Offer — ${siteName}`,
        },
        {
          name: 'description',
          content:
            promo?.subTitle ||
            promo?.title ||
            'View promotion details and browse discounted products.',
        },
        {
          property: 'og:title',
          content: promo
            ? `${promo.title} — ${siteName}`
            : `Offer — ${siteName}`,
        },
        {
          property: 'og:description',
          content:
            promo?.subTitle ||
            promo?.title ||
            'View promotion details and browse discounted products.',
        },
        ...(promo?.imageUrl
          ? [{ property: 'og:image' as const, content: promo.imageUrl }]
          : []),
        {
          property: 'og:url',
          content: `${SITE_URL}/promo/${params.promoId}`,
        },
      ],
      links: [
        { rel: 'canonical', href: `${SITE_URL}/promo/${params.promoId}` },
      ],
    }
  },
  component: PromoDetailPage,
})

function PromoDetailPage() {
  const { promoId } = Route.useParams()
  const t = useT()
  const { data: promos, isLoading, isError } = useStorefrontPromos()

  const promo = promos?.find((p) => p.id === promoId)

  if (isLoading) return <Spinner />
  if (isError)
    return (
      <EmptyState
        icon="box"
        title={t.states.error}
        description={t.states.errorSub}
      />
    )
  if (!promo)
    return (
      <EmptyState
        title={t.states.searchEmpty}
        action={
          <Button asChild>
            <Link to="/promo">{t.actions.backToShop}</Link>
          </Button>
        }
      />
    )

  return (
    <div className="page-wrap py-10">
      <Link
        to="/promo"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4 rtl:rotate-180" />
        {t.nav.promos}
      </Link>

      <header className="mb-8 space-y-3 rounded-3xl bg-lagoon-deep p-8 text-background sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
          {t.product.sale}
        </span>
        <h1 className="display-title text-3xl font-semibold sm:text-4xl">
          {promo.title}
        </h1>
        {promo.subTitle && (
          <p className="max-w-xl text-sm text-background/85">{promo.subTitle}</p>
        )}
      </header>

      {promo.products.length > 0 ? (
        <ProductGrid items={promo.products} />
      ) : (
        <EmptyState icon="box" title={t.states.searchEmpty} />
      )}
    </div>
  )
}
