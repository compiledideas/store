import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'

import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'
import { CartDrawer } from './cart-drawer'
import { AppToaster } from '#/lib/toast'

export function StoreShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  // Scroll to top on route change (anchor nav handled by browser otherwise).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [location.pathname])

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CartDrawer />
      <AppToaster />
    </div>
  )
}
