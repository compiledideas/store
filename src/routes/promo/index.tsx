import { createFileRoute } from '@tanstack/react-router'
import { useStorefrontPromos } from '@rackvise/storefront-sdk'

import { PromoCard } from '#/components/storefront/promo-card'
import { SectionHeading } from '#/components/storefront/section-heading'
import { ErrorState, Spinner } from '#/components/storefront/states'
import { useT } from '#/lib/i18n'
import { APP_TITLE, SITE_URL } from '#/env'

export const Route = createFileRoute('/promo/')({
  head: ({ match }) => {
    const siteName = match.context.config?.name || APP_TITLE
    return {
      meta: [
        { title: `Offers — ${siteName}` },
        {
          name: 'description',
          content: 'Check out our limited-time offers and promotions. Save big on curated essentials while stocks last.',
        },
        { property: 'og:title', content: `Offers — ${siteName}` },
        {
          property: 'og:description',
          content: 'Check out our limited-time offers and promotions.',
        },
        { property: 'og:url', content: `${SITE_URL}/promo` },
      ],
      links: [{ rel: 'canonical', href: `${SITE_URL}/promo` }],
    }
  },
  component: PromoIndexPage,
})

function PromoIndexPage() {
  const t = useT()
  const { data, isLoading, isError, refetch } = useStorefrontPromos()

  return (
    <div className="page-wrap py-10">
      <header className="mb-8 space-y-2">
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

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <SectionHeading title={t.shop.noResults} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      )}
    </div>
  )
}
