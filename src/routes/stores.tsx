import { createFileRoute, Link } from '@tanstack/react-router'
import { useStorefrontPointOfSells } from '@rackvise/storefront-sdk'
import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  StoreIcon,
} from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  EmptyState,
  ErrorState,
  Spinner,
} from '#/components/storefront/states'
import { useT } from '#/lib/i18n'
import { APP_TITLE, SITE_URL } from '#/env'
import { getStorefrontClient } from '#/lib/storefront-client'

export const Route = createFileRoute('/stores')({
  loader: async ({ context }) => {
    try {
      const client = getStorefrontClient()
      const apiKey = client.getApiKey()
      const pointOfSells = await context.queryClient.ensureQueryData({
        queryKey: ['storefront', apiKey, 'point-of-sells'],
        queryFn: () => client.getPointOfSells(),
      })
      return { pointOfSells }
    } catch {
      return { pointOfSells: [] as never[] }
    }
  },
  head: ({ match }) => {
    const siteName = match.context.config?.name || APP_TITLE
    return {
      meta: [
        { title: `Our Stores — ${siteName}` },
        {
          name: 'description',
          content: 'Visit our physical stores. Find store locations, working hours, and contact information.',
        },
        { property: 'og:title', content: `Our Stores — ${siteName}` },
        {
          property: 'og:description',
          content: 'Visit our physical stores. Find store locations, working hours, and contact information.',
        },
        { property: 'og:url', content: `${SITE_URL}/stores` },
      ],
      links: [{ rel: 'canonical', href: `${SITE_URL}/stores` }],
    }
  },
  component: StoresPage,
})

function StoresPage() {
  const t = useT()
  const { data, isLoading, isError, refetch } = useStorefrontPointOfSells()

  return (
    <div className="page-wrap py-12">
      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-lagoon-tint text-lagoon-deep">
          <StoreIcon className="size-6" />
        </span>
        <h1 className="display-title text-4xl font-semibold text-foreground sm:text-5xl">
          {t.stores.title}
        </h1>
        <p className="text-base text-muted-foreground">{t.stores.sub}</p>
      </header>

      <div className="mt-12">
        {isLoading ? (
          <Spinner className="min-h-32" />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : !data || data.length === 0 ? (
          <EmptyState
            icon="box"
            title={t.states.searchEmpty}
            action={
              <Button asChild>
                <Link to="/shop">{t.actions.backToShop}</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.map((pos) => (
              <article
                key={pos.id}
                className="flex flex-col gap-4 rounded-2xl border border-line bg-card p-6"
              >
                <div className="space-y-1">
                  <h2 className="display-title text-lg font-semibold text-foreground">
                    {pos.name}
                  </h2>
                  <p className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPinIcon className="mt-0.5 size-4 shrink-0 text-lagoon-deep" />
                    <span>
                      {pos.address}
                      {pos.city ? `, ${pos.city}` : ''}
                      {pos.country ? `, ${pos.country}` : ''}
                    </span>
                  </p>
                </div>

                <dl className="space-y-2 text-sm">
                  {pos.phone && (
                    <Contact
                      icon={<PhoneIcon className="size-4" />}
                      label={t.stores.contact}
                      value={pos.phone}
                      href={`tel:${pos.phone}`}
                    />
                  )}
                  {pos.email && (
                    <Contact
                      icon={<MailIcon className="size-4" />}
                      label="Email"
                      value={pos.email}
                      href={`mailto:${pos.email}`}
                    />
                  )}
                  {typeof pos.workingHours === 'object' &&
                    pos.workingHours &&
                    Object.keys(pos.workingHours).length > 0 && (
                      <div className="space-y-1 pt-1">
                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          <ClockIcon className="size-4 text-lagoon-deep" />
                          {t.stores.hours}
                        </p>
                        <ul className="space-y-0.5 text-sm text-foreground">
                          {Object.entries(pos.workingHours).map(
                            ([day, hours]) => (
                              <li
                                key={day}
                                className="flex justify-between gap-3 capitalize"
                              >
                                <span className="text-muted-foreground">
                                  {day}
                                </span>
                                <span className="font-medium">
                                  {formatWorkingHours(hours)}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function formatWorkingHours(hours: unknown): string {
  if (typeof hours === 'string') return hours
  if (hours && typeof hours === 'object') {
    const h = hours as { open?: string; close?: string; isOpen?: boolean }
    if (h.open && h.close) return `${h.open} — ${h.close}`
    if (h.open) return h.open
  }
  return ''
}

function Contact({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href: string
}) {
  return (
    <div className="space-y-0.5">
      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <span className="text-lagoon-deep">{icon}</span>
        {label}
      </dt>
      <dd>
        <a
          href={href}
          className="font-medium text-foreground transition-colors hover:text-lagoon-deep"
        >
          {value}
        </a>
      </dd>
    </div>
  )
}
