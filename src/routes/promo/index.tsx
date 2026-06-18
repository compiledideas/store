import { createFileRoute } from '@tanstack/react-router'
import { useStorefrontPromos } from '@rackvise/storefront-sdk'

import { PromoCard } from '#/components/storefront/promo-card'
import { SectionHeading } from '#/components/storefront/section-heading'
import { ErrorState, Spinner } from '#/components/storefront/states'
import { useT } from '#/lib/i18n'

export const Route = createFileRoute('/promo/')({ component: PromoIndexPage })

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
