import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'
import { useStorefrontConfig } from '@rackvise/storefront-sdk'

import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'
import { CartDrawer } from './cart-drawer'
import { AppToaster } from '#/lib/toast'

export function StoreShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { data: config } = useStorefrontConfig()

  // Apply custom theme colors & font family dynamically from merchant config
  useEffect(() => {
    if (!config) return
    const root = document.documentElement

    if (config.primaryColor) {
      root.style.setProperty('--lagoon', config.primaryColor)
      root.style.setProperty('--primary', config.primaryColor)
      root.style.setProperty('--lagoon-deep', config.primaryColor)
      root.style.setProperty('--ring', config.primaryColor)
    }
    if (config.secondaryColor) {
      root.style.setProperty('--palm', config.secondaryColor)
      root.style.setProperty('--secondary', config.secondaryColor)
    }
    if (config.tertiaryColor) {
      root.style.setProperty('--lagoon-bright', config.tertiaryColor)
      root.style.setProperty('--accent', `${config.tertiaryColor}1a`)
    }
    if (config.fontFamily) {
      root.style.setProperty('--font-sans', `'${config.fontFamily}', ui-sans-serif, system-ui, sans-serif`)
    }
  }, [config])

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
