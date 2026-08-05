import { createFileRoute } from '@tanstack/react-router'
import {
  useStorefrontAboutContent,
  useStorefrontStats,
} from '@rackvise/storefront-sdk'

import { StatsBand } from '#/components/storefront/stats-band'
import { SectionHeading } from '#/components/storefront/section-heading'
import { ErrorState, Spinner } from '#/components/storefront/states'
import { useLocale, useT, localized } from '#/lib/i18n'
import { APP_TITLE, SITE_URL } from '#/env'
import { Markdown } from '#/components/storefront/markdown'

export const Route = createFileRoute('/about')({
  head: ({ match }) => {
    const siteName = match.context.config?.name || APP_TITLE
    return {
      meta: [
        { title: `About — ${siteName}` },
        {
          name: 'description',
          content: 'Learn more about our store. Curated essentials, delivered with care.',
        },
        { property: 'og:title', content: `About — ${siteName}` },
        {
          property: 'og:description',
          content: 'Learn more about our store. Curated essentials, delivered with care.',
        },
        { property: 'og:url', content: `${SITE_URL}/about` },
      ],
      links: [{ rel: 'canonical', href: `${SITE_URL}/about` }],
    }
  },
  component: AboutPage,
})

function AboutPage() {
  const t = useT()
  const { locale } = useLocale()
  const {
    data: about,
    isLoading,
    isError,
    refetch,
  } = useStorefrontAboutContent()
  const { data: stats } = useStorefrontStats()

  const content =
    localized(about, 'content', locale) || localized(about, 'content', 'en')

  return (
    <div className="page-wrap py-12">
      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-lagoon-deep">
          {t.nav.about}
        </p>
        <h1 className="display-title text-4xl font-semibold text-foreground sm:text-5xl">
          {t.about.title}
        </h1>
        <p className="text-base text-muted-foreground">{t.brand.tagline}</p>
      </header>

      <div className="mx-auto mt-12 max-w-2xl">
        {isLoading ? (
          <Spinner className="min-h-32" />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          content && (
            <article className="prose prose-stone max-w-none dark:prose-invert">
              <Markdown content={content} />
            </article>
          )
        )}
      </div>

      {stats && (
        <section className="mt-16">
          <StatsBand stats={stats} />
        </section>
      )}

      <section className="mt-16">
        <SectionHeading title={t.home.joinCta} subtitle={t.home.joinSub} />
      </section>
    </div>
  )
}
