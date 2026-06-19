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

import { StorefrontApp } from '#/lib/storefront'
import { LocaleProvider, LOCALES } from '#/lib/i18n'
import { UiProvider } from '#/lib/ui-store'
import { StoreShell } from '#/components/storefront/layout/store-shell'
import { Button } from '#/components/ui/button'
import { APP_TITLE, SITE_URL } from '#/env'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      { title: APP_TITLE },
      {
        name: 'description',
        content:
          'Curated essentials, delivered with care. Shop our collection of products with cash on delivery available.',
      },
      { name: 'theme-color', content: '#1f7a73' },
      { property: 'og:title', content: APP_TITLE },
      {
        property: 'og:description',
        content:
          'Curated essentials, delivered with care. Shop our collection of products with cash on delivery available.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:image', content: `${SITE_URL}/logo512.png` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: APP_TITLE },
      {
        name: 'twitter:description',
        content:
          'Curated essentials, delivered with care. Shop our collection of products with cash on delivery available.',
      },
    ],
    links: [
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
  }),
  notFoundComponent: NotFound,
  errorComponent: RootError,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
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
                  name: APP_TITLE,
                  url: SITE_URL,
                  logo: `${SITE_URL}/logo512.png`,
                  description:
                    'Curated essentials, delivered with care.',
                },
                {
                  '@type': 'WebSite',
                  name: APP_TITLE,
                  url: SITE_URL,
                  description:
                    'Curated essentials, delivered with care.',
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
