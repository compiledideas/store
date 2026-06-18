import { createFileRoute, Link } from '@tanstack/react-router'
import { useStorefrontCategories } from '@rackvise/storefront-sdk'

import { CategoryGrid } from '#/components/storefront/category-grid'
import { GridSkeleton, ErrorState, EmptyState } from '#/components/storefront/states'
import { Button } from '#/components/ui/button'
import { SectionHeading } from '#/components/storefront/section-heading'
import { useT } from '#/lib/i18n'

export const Route = createFileRoute('/category/')({ component: CategoryIndexPage })

function CategoryIndexPage() {
  const t = useT()
  const { data, isLoading, isError, refetch } = useStorefrontCategories()

  return (
    <div className="page-wrap py-10">
      <header className="mb-8 space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-lagoon-deep">
          {t.nav.shop}
        </p>
        <h1 className="display-title text-3xl font-semibold text-foreground sm:text-4xl">
          {t.home.shopByCategory}
        </h1>
      </header>

      {isLoading ? (
        <GridSkeleton count={6} />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon="box"
          title={t.shop.noResults}
          action={
            <Button asChild>
              <Link to="/shop">{t.actions.backToShop}</Link>
            </Button>
          }
        />
      ) : (
        <CategoryGrid categories={data} />
      )}

      <section className="mt-12">
        <SectionHeading title={t.shop.title} viewAllTo="/shop" viewAllLabel={t.actions.viewAll} />
      </section>
    </div>
  )
}
