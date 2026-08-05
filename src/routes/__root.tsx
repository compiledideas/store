import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import type { StorefrontConfigData } from '@rackvise/storefront-sdk'

import { StorefrontApp } from '#/lib/storefront'
import { LocaleProvider, LOCALES } from '#/lib/i18n'
import { UiProvider } from '#/lib/ui-store'
import { StoreShell } from '#/components/storefront/layout/store-shell'
import { Button } from '#/components/ui/button'
import { APP_TITLE, SITE_URL } from '#/env'
import { getStorefrontClient } from '#/lib/storefront-client'

interface MyRouterContext {
  queryClient: QueryClient
  config?: StorefrontConfigData | null
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    const client = getStorefrontClient()
    const apiKey = client.getApiKey()
    let config: StorefrontConfigData | null = null
    try {
      config = await context.queryClient.ensureQueryData({
        queryKey: ['storefront', apiKey, 'store-config'],
        queryFn: () => client.getStoreConfig(),
      })
    } catch {
      /* config stays null */
    }
    return { config: config as any }
  },
  head: ({ match }) => {
    const config = match.context.config
    const title = config?.name || APP_TITLE
    const description = config?.taglineEN || 'Curated essentials, delivered with care. Shop our collection of products with cash on delivery available.'
    const logoUrl = config?.logoUrl || '/favicon.ico'
    const ogImage = config?.logoUrl || `${SITE_URL}/logo512.png`
    return {
      meta: [
        { charSet: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover',
        },
        { title },
        { name: 'description', content: description },
        { name: 'theme-color', content: config?.primaryColor || '#1f7a73' },
        { property: 'og:title', content: title },
        {
          property: 'og:description',
          content: description,
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: SITE_URL },
        { property: 'og:image', content: ogImage },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        {
          name: 'twitter:description',
          content: description,
        },
      ],
      links: [
        { rel: 'icon', href: logoUrl },
        { rel: 'apple-touch-icon', href: ogImage },
        { rel: 'stylesheet', href: appCss },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossOrigin: 'anonymous',
        },
        { rel: 'canonical', href: SITE_URL },
        ...LOCALES.map((l) => ({
          rel: 'alternate' as const,
          href: `${SITE_URL}`,
          hrefLang: l.code,
        })),
        { rel: 'alternate', href: `${SITE_URL}`, hrefLang: 'x-default' },
      ],
    }
  },
  notFoundComponent: NotFound,
  errorComponent: RootError,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { config } = Route.useRouteContext()
  const title = config?.name || APP_TITLE
  const description = config?.taglineEN || 'Curated essentials, delivered with care.'
  const logoUrl = config?.logoUrl || `${SITE_URL}/logo512.png`

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {config?.primaryColor && (
          <style
            dangerouslySetInnerHTML={{
              __html: `
                :root {
                  --lagoon: ${config.primaryColor};
                  --lagoon-deep: ${config.primaryColor};
                  --lagoon-tint: color-mix(in srgb, ${config.primaryColor} 15%, transparent);
                }
              `,
            }}
          />
        )}
      </head>
      <body>
        <StorefrontApp>
          <LocaleProvider>
            <UiProvider>
              <StoreShell>{children}</StoreShell>
            </UiProvider>
          </LocaleProvider>
        </StorefrontApp>
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
            TanStackQueryDevtools,
          ]}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  name: title,
                  url: SITE_URL,
                  logo: logoUrl,
                  description: description,
                },
                {
                  '@type': 'WebSite',
                  name: title,
                  url: SITE_URL,
                  description: description,
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="page-wrap grid min-h-[60vh] place-items-center py-20 text-center">
      <div className="space-y-4">
        <p className="display-title text-6xl font-bold text-lagoon-deep">404</p>
        <h1 className="text-2xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
        <Button asChild className="rounded-full">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}

function RootError() {
  return (
    <div className="page-wrap grid min-h-[60vh] place-items-center py-20 text-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <Button asChild className="rounded-full">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  )
}
