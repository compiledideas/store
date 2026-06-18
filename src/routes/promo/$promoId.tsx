import { createFileRoute, Link } from '@tanstack/react-router'
import { useStorefrontPromos } from '@rackvise/storefront-sdk'
import { z } from 'zod'
import { ArrowLeftIcon } from 'lucide-react'

import { ProductGrid } from '#/components/storefront/product-grid'
import { Button } from '#/components/ui/button'
import { EmptyState, ErrorState, Spinner } from '#/components/storefront/states'
import { useT } from '#/lib/i18n'

export const Route = createFileRoute('/promo/$promoId')({
  params: {
    parse: (raw) => ({ promoId: z.coerce.number().parse(raw.promoId) }),
  },
  component: PromoDetailPage,
})

function PromoDetailPage() {
  const { promoId } = Route.useParams()
  const t = useT()
  const { data: promos, isLoading, isError, refetch } = useStorefrontPromos()

  const promo = promos?.find((p) => p.id === promoId)

  if (isLoading) return <Spinner />
  if (isError) return <ErrorState onRetry={() => refetch()} />
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
        <EmptyState icon="box" title={t.shop.noResults} />
      )}
    </div>
  )
}
