import { createFileRoute, Link  } from '@tanstack/react-router'
import {
  useStorefrontCategories,
  useStorefrontProducts,
  useStorefrontPromos,
  useStorefrontStats,
  useStorefrontTopSellingProducts,
} from '@rackvise/storefront-sdk'
import { ArrowRightIcon } from 'lucide-react'

import { Hero } from '#/components/storefront/hero'
import { SectionHeading } from '#/components/storefront/section-heading'
import { CategoryGrid } from '#/components/storefront/category-grid'
import { PromoCard } from '#/components/storefront/promo-card'
import { StatsBand } from '#/components/storefront/stats-band'
import { ProductCard } from '#/components/storefront/product-card'
import { Rail } from '#/components/storefront/rail'
import { Button } from '#/components/ui/button'
import { useT } from '#/lib/i18n'
import { APP_TITLE, SITE_URL } from '#/env'

export const Route = createFileRoute('/')({
  head: ({ match }) => {
    const siteName = match.context.config?.name || APP_TITLE
    const description = match.context.config?.taglineEN || 'Shop curated essentials with cash on delivery. Browse our collection of featured products, best sellers, and exclusive offers.'
    return {
      meta: [
        { title: siteName },
        { name: 'description', content: description },
        { property: 'og:title', content: siteName },
        { property: 'og:description', content: description },
        { property: 'og:url', content: `${SITE_URL}/` },
      ],
      links: [{ rel: 'canonical', href: `${SITE_URL}/` }],
    }
  },
  component: HomePage,
})

function HomePage() {
  const t = useT()

  const { data: categories, isLoading: catLoading } =
    useStorefrontCategories()
  const { data: featured } = useStorefrontProducts({
    limit: 12,
    sort: 'createdAt-desc',
  })
  const { data: top } = useStorefrontTopSellingProducts()
  const { data: promos } = useStorefrontPromos()
  const { data: stats } = useStorefrontStats()

  return (
    <div className="pb-10">
      <Hero />

      {/* Stats */}
      {stats && (
        <section className="page-wrap mt-16">
          <StatsBand stats={stats} />
        </section>
      )}

      {/* Categories */}
      {!catLoading && categories && categories.length > 0 && (
        <section className="page-wrap mt-20 space-y-6">
          <SectionHeading
            eyebrow={t.nav.categories}
            title={t.home.shopByCategory}
            viewAllTo="/shop"
            viewAllLabel={t.actions.viewAll}
          />
          <CategoryGrid categories={categories} />
        </section>
      )}

      {/* Featured products */}
      {featured && featured.data.length > 0 && (
        <section className="page-wrap mt-20 space-y-6">
          <SectionHeading
            eyebrow={t.product.new}
            title={t.home.featured}
            subtitle={t.home.featuredSub}
            viewAllTo="/shop"
            viewAllLabel={t.actions.viewAll}
          />
          <Rail>
            {featured.data.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Rail>
        </section>
      )}

      {/* Promos */}
      {promos && promos.length > 0 && (
        <section className="page-wrap mt-20 space-y-6">
          <SectionHeading
            eyebrow={t.product.sale}
            title={t.home.promo}
            subtitle={t.home.promoSub}
            viewAllTo="/promo"
            viewAllLabel={t.actions.viewAll}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promos.slice(0, 3).map((promo) => (
              <PromoCard key={promo.id} promo={promo} />
            ))}
          </div>
        </section>
      )}

      {/* Top selling */}
      {top && top.length > 0 && (
        <section className="page-wrap mt-20 space-y-6">
          <SectionHeading
            eyebrow={t.product.sold}
            title={t.home.topSelling}
            subtitle={t.home.topSellingSub}
            viewAllTo="/shop"
            viewAllLabel={t.actions.viewAll}
          />
          <Rail>
            {top.map((p) => (
              <ProductCard key={p.id} product={p as never} />
            ))}
          </Rail>
        </section>
      )}

      {/* Join CTA */}
      <section className="page-wrap mt-24">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-line bg-sand/60 px-6 py-14 text-center">
          <h2 className="display-title max-w-xl text-2xl font-semibold text-foreground sm:text-3xl">
            {t.home.joinCta}
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            {t.home.joinSub}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/shop">
                {t.actions.continueShopping}
                <ArrowRightIcon className="size-4 rtl:-scale-x-100" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
