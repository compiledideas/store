import { useMemo, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { SlidersHorizontalIcon, SearchIcon } from 'lucide-react'
import {
  useStorefrontCategories,
  useStorefrontProducts,
} from '@rackvise/storefront-sdk'
import type { GetProductsParams } from '@rackvise/storefront-sdk'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
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
  ErrorState,
  GridSkeleton,
  InlineSpinner,
} from '#/components/storefront/states'
import { useT, interpolate  } from '#/lib/i18n'
import { formatCount } from '#/lib/format'

const PAGE_SIZE = 12

const searchSchema = z.object({
  q: z.string().optional(),
  categoryId: z.number().optional(),
  sort: z
    .enum(['name-asc', 'price-asc', 'price-desc', 'createdAt-desc'])
    .optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  gender: z.string().optional(),
  ageGroup: z.string().optional(),
  show: z.number().optional(),
})

type ShopSearch = z.infer<typeof searchSchema>

export const Route = createFileRoute('/shop/')({
  validateSearch: searchSchema,
  component: ShopPage,
})

function ShopPage() {
  const t = useT()
  const search = Route.useSearch()
  const navigate = useNavigate()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const { data: categories } = useStorefrontCategories()

  const limit = search.show ?? PAGE_SIZE

  const params: GetProductsParams = useMemo(
    () => ({
      search: search.q,
      categoryId: search.categoryId,
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

  const { data, isLoading, isError, refetch, isFetching } =
    useStorefrontProducts(params)

  const patchSearch = (patch: Partial<ShopSearch>) => {
    navigate({ to: '/shop', search: { ...search, ...patch } })
  }

  const patchFilters = (patch: Partial<ShopFiltersState>) =>
    patchSearch({ ...patch, show: PAGE_SIZE })

  const resetFilters = () =>
    patchSearch({
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      gender: undefined,
      ageGroup: undefined,
      show: PAGE_SIZE,
    })

  const onSearch = (q: string) => patchSearch({ q: q || undefined })

  const filtersValue: ShopFiltersState = {
    categoryId: search.categoryId,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    gender: search.gender,
    ageGroup: search.ageGroup,
  }

  const activeCategory = categories?.find((c) => c.id === search.categoryId)
  const total = data?.pagination.total ?? 0
  const shown = data?.data.length ?? 0
  const hasMore = data?.pagination.hasMore ?? false

  const filterContent = (
    <ShopFilters
      categories={categories ?? []}
      value={filtersValue}
      onChange={patchFilters}
      onReset={resetFilters}
    />
  )

  return (
    <div className="page-wrap py-10">
      <header className="mb-8 space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-lagoon-deep">
          {t.nav.shop}
        </p>
        <h1 className="display-title text-3xl font-semibold text-foreground sm:text-4xl">
          {activeCategory ? activeCategory.name : t.shop.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {interpolate(t.shop.results, { count: formatCount(total) })}
        </p>
      </header>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            defaultValue={search.q}
            placeholder={t.shop.searchPlaceholder}
            aria-label={t.shop.searchPlaceholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch((e.target as HTMLInputElement).value)
            }}
            onBlur={(e) => onSearch(e.target.value)}
            className="h-10 rounded-full bg-sand/70 ps-9"
          />
        </div>
        <div className="flex items-center gap-2">
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
            onChange={(sort) => patchSearch({ sort })}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-2xl border border-line bg-card p-5">
            {filterContent}
          </div>
        </aside>

        {/* Results */}
        <div>
          {isLoading ? (
            <GridSkeleton />
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : !data || data.data.length === 0 ? (
            <EmptyState
              icon="search"
              title={t.shop.noResults}
              description={t.states.searchEmpty}
              action={
                <Button variant="outline" onClick={resetFilters}>
                  {t.shop.reset}
                </Button>
              }
            />
          ) : (
            <>
              <ProductGrid items={data.data} />
              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-xs text-muted-foreground">
                  {interpolate(t.shop.showing, {
                    from: '1',
                    to: formatCount(shown),
                    total: formatCount(total),
                  })}
                </p>
                {hasMore && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full"
                    disabled={isFetching}
                    onClick={() =>
                      patchSearch({ show: limit + PAGE_SIZE })
                    }
                  >
                    {isFetching ? <InlineSpinner /> : null}
                    {t.shop.loadMore}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile filters */}
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
