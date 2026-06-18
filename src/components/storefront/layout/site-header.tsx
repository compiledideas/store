import { useState  } from 'react'
import type {FormEvent} from 'react';
import { Link, useNavigate } from '@tanstack/react-router'
import {
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
} from 'lucide-react'
import { useStorefrontCart } from '@rackvise/storefront-sdk'

import { Button } from '#/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { LocaleSwitcher } from './locale-switcher'
import { useUi } from '#/lib/ui-store'
import { useT } from '#/lib/i18n'
import { APP_TITLE } from '#/env'

const NAV = [
  { to: '/', key: 'home' as const },
  { to: '/shop', key: 'shop' as const },
  { to: '/promo', key: 'promos' as const },
  { to: '/about', key: 'about' as const },
  { to: '/stores', key: 'stores' as const },
  { to: '/faq', key: 'faq' as const },
]

export function SiteHeader() {
  const t = useT()
  const { openCart, setMobileNavOpen, mobileNavOpen } = useUi()
  const { totalItems } = useStorefrontCart()
  const [query, setQuery] = useState('')

  const navigate = useNavigate()
  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    navigate({ to: '/shop', search: { q: query.trim() || undefined } })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur-md">
      <AnnouncementBar />

      <div className="page-wrap flex h-16 items-center gap-4">
        <button
          type="button"
          className="-ms-2 grid size-10 place-items-center rounded-full text-foreground hover:bg-accent md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileNavOpen(true)}
        >
          <MenuIcon className="size-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="display-title hidden text-lg font-bold tracking-tight text-foreground sm:inline">
            {APP_TITLE}
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {t.nav[item.key]}
            </NavLink>
          ))}
        </nav>

        <form
          onSubmit={onSearch}
          className="relative ms-auto hidden w-56 lg:block xl:w-72"
        >
          <SearchIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.nav.search}
            aria-label={t.nav.search}
            className="h-10 w-full rounded-full border border-border bg-sand/70 ps-9 pe-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-lagoon-deep focus:bg-background"
          />
        </form>

        <div className="flex items-center gap-1 ms-auto lg:ms-2">
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label={t.nav.search}
            className="lg:hidden"
          >
            <Link to="/shop">
              <SearchIcon className="size-5" />
            </Link>
          </Button>

          <LocaleSwitcher className="hidden sm:block" />

          <Button
            variant="ghost"
            size="icon"
            aria-label={t.cart.title}
            className="relative"
            onClick={openCart}
          >
            <ShoppingBagIcon className="size-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -end-0.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-lagoon-deep px-1 text-[10px] font-bold text-background">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Button>
        </div>
      </div>

      <MobileNav
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        nav={NAV}
      />
    </header>
  )
}

function NavLink({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      className="relative text-sm font-medium text-ink-soft transition-colors hover:text-foreground [&.active]:font-semibold [&.active]:text-foreground"
      activeProps={{ className: 'active' }}
    >
      {children}
    </Link>
  )
}

function AnnouncementBar() {
  const t = useT()
  return (
    <div className="bg-ink text-background">
      <div className="page-wrap flex h-9 items-center justify-center overflow-hidden">
        <p className="truncate text-center text-xs font-medium tracking-wide">
          {t.brand.announcement}
        </p>
      </div>
    </div>
  )
}

function MobileNav({
  open,
  onOpenChange,
  nav,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  nav: { to: string; key: 'home' | 'shop' | 'promos' | 'about' | 'stores' | 'faq' }[]
}) {
  const t = useT()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="start" onOpenChange={onOpenChange}>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Logo />
            <span className="display-title text-base font-bold">
              {APP_TITLE}
            </span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-3 py-2">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => onOpenChange(false)}
              className="rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
            >
              {t.nav[item.key]}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-border px-5 py-4">
          <LocaleSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Logo() {
  return (
    <span className="grid size-9 place-items-center rounded-xl bg-lagoon-deep text-background">
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3 7h18l-2 11a2 2 0 0 1-2 1.7H7A2 2 0 0 1 5 18z" />
        <path d="M8 7V6a4 4 0 0 1 8 0v1" />
      </svg>
    </span>
  )
}
