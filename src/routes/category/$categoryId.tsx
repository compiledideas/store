import { useMemo, useState } from 'react'
import {
  Link,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import { z } from 'zod'
import {
  useStorefrontCategories,
  useStorefrontCategoryProducts,
} from '@rackvise/storefront-sdk'
import type { GetCategoryProductsParams } from '@rackvise/storefront-sdk'
import { ArrowLeftIcon, SlidersHorizontalIcon } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { ProductGrid } from '#/components/storefront/product-grid'
import { SortSelect } from '#/components/storefront/sort-select'
import {
  ShopFilters
  
} from '#/components/storefront/shop-filters'
import type {ShopFiltersState} from '#/components/storefront/shop-filters';
import {
  EmptyState,
  GridSkeleton,
} from '#/components/storefront/states'
import { useT, interpolate  } from '#/lib/i18n'
import { formatCount } from '#/lib/format'

const searchSchema = z.object({
  sort: z
    .enum(['name-asc', 'price-asc', 'price-desc', 'createdAt-desc'])
    .optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  gender: z.string().optional(),
  ageGroup: z.string().optional(),
  show: z.number().optional(),
})

type CategorySearch = z.infer<typeof searchSchema>
const PAGE_SIZE = 12

export const Route = createFileRoute('/category/$categoryId')({
  params: {
    parse: (raw) => ({
      categoryId: z.coerce.number().parse(raw.categoryId),
    }),
  },
  validateSearch: searchSchema,
  component: CategoryPage,
})

function CategoryPage() {
  const { categoryId } = Route.useParams()
  const t = useT()
  const search = Route.useSearch()
  const navigate = useNavigate()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { data: categories } = useStorefrontCategories()

  const limit = search.show ?? PAGE_SIZE

  const params: GetCategoryProductsParams = useMemo(
    () => ({
      sort: search.sort ?? 'createdAt-desc',
      minPrice: search.minPrice,
      maxPrice: search.maxPrice,
      gender: search.gender,
      ageGroup: search.ageGroup,
      limit,
      offset: 0,
    }),
    [search, limit],
  )

  const { data, isLoading, isError } =
    useStorefrontCategoryProducts(categoryId, params)

  const category = categories?.find((c) => c.id === categoryId)
  const patch = (p: Partial<CategorySearch>) =>
    navigate({
      to: '/category/$categoryId',
      params: { categoryId },
      search: { ...search, ...p },
    })

  const patchFilters = (p: Partial<ShopFiltersState>) =>
    patch({ ...p, show: PAGE_SIZE })

  const resetFilters = () =>
    patch({
      minPrice: undefined,
      maxPrice: undefined,
      gender: undefined,
      ageGroup: undefined,
      show: PAGE_SIZE,
    })

  const filtersValue: ShopFiltersState = {
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    gender: search.gender,
    ageGroup: search.ageGroup,
  }

  const filterContent = (
    <ShopFilters
      categories={[]}
      value={filtersValue}
      onChange={patchFilters}
      onReset={resetFilters}
    />
  )

  const total = data?.pagination.total ?? 0
  const hasMore = data?.pagination.hasMore ?? false

  return (
    <div className="page-wrap py-10">
      <Link
        to="/category"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4 rtl:rotate-180" />
        {t.nav.categories}
      </Link>

      <header className="mb-8 space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-lagoon-deep">
          {t.nav.categories}
        </p>
        <h1 className="display-title text-3xl font-semibold text-foreground sm:text-4xl">
          {category?.name ?? t.shop.title}
        </h1>
        {category?.description && (
          <p className="max-w-2xl text-sm text-muted-foreground">
            {category.description}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {interpolate(t.shop.results, { count: formatCount(total) })}
        </p>
      </header>

      <div className="mb-6 flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={() => setFiltersOpen(true)}
        >
          <SlidersHorizontalIcon className="size-4" />
          {t.shop.filters}
        </Button>
        <SortSelect
          value={search.sort ?? 'createdAt-desc'}
          onChange={(sort) => patch({ sort })}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-2xl border border-line bg-card p-5">
            {filterContent}
          </div>
        </aside>

        <div>
          {isLoading ? (
            <GridSkeleton />
          ) : isError ? (
            <EmptyState
              icon="box"
              title={t.shop.noResults}
              description={t.home.joinSub}
            />
          ) : !data || data.data.length === 0 ? (
            <EmptyState
              icon="box"
              title={t.shop.noResults}
              action={
                <Button variant="outline" onClick={resetFilters}>
                  {t.shop.reset}
                </Button>
              }
            />
          ) : (
            <>
              <ProductGrid items={data.data} />
              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                    onClick={() => patch({ show: limit + PAGE_SIZE })}
                  >
                    {t.shop.loadMore}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="end" onOpenChange={setFiltersOpen}>
          <SheetHeader>
            <SheetTitle>{t.shop.filters}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-5 py-4">{filterContent}</div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
