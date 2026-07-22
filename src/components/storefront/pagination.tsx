import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { cn } from '#/lib/utils'

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}) {
  if (totalPages <= 1) return null

  const windowPages = getWindow(page, totalPages, 5)

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <PageButton
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeftIcon className="size-4 rtl:hidden" />
        <ChevronRightIcon className="hidden size-4 rtl:block" />
      </PageButton>

      {windowPages[0] > 1 && (
        <>
          <PageButton onClick={() => onPageChange(1)}>1</PageButton>
          {windowPages[0] > 2 && <Ellipsis />}
        </>
      )}

      {windowPages.map((p) => (
        <PageButton
          key={p}
          active={p === page}
          onClick={() => onPageChange(p)}
        >
          {p}
        </PageButton>
      ))}

      {windowPages[windowPages.length - 1] < totalPages && (
        <>
          {windowPages[windowPages.length - 1] < totalPages - 1 && <Ellipsis />}
          <PageButton onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </PageButton>
        </>
      )}

      <PageButton
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRightIcon className="size-4 rtl:hidden" />
        <ChevronLeftIcon className="hidden size-4 rtl:block" />
      </PageButton>
    </nav>
  )
}

function PageButton({
  active,
  disabled,
  children,
  ...props
}: {
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
} & React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'grid size-9 place-items-center rounded-lg text-sm font-medium transition-colors',
        active
          ? 'bg-lagoon-deep text-background'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        disabled && 'pointer-events-none opacity-40',
      )}
      {...props}
    >
      {children}
    </button>
  )
}

function Ellipsis() {
  return (
    <span className="grid size-9 place-items-center text-sm text-muted-foreground">
      ...
    </span>
  )
}

function getWindow(page: number, total: number, size: number): number[] {
  const half = Math.floor(size / 2)
  let start = Math.max(1, page - half)
  let end = Math.min(total, start + size - 1)
  if (end - start + 1 < size) {
    start = Math.max(1, end - size + 1)
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export { Pagination }
