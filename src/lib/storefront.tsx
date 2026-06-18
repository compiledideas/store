import { StorefrontProvider } from '@rackvise/storefront-sdk'
import { STOREFRONT_CONFIG } from '#/env'

/**
 * Pre-wired StorefrontProvider. Reads tenant config from env (with sensible
 * demo defaults) so the whole app is inside a StorefrontProvider + Cart context.
 *
 * Pass `baseUrl`/`apiKey` explicitly to override per-render if you ever need
 * multi-tenant rendering.
 */
export function StorefrontApp({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StorefrontProvider
      baseUrl={STOREFRONT_CONFIG.baseUrl}
      apiKey={STOREFRONT_CONFIG.apiKey}
    >
      {children}
    </StorefrontProvider>
  )
}
