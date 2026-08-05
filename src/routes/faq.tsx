import { createFileRoute, Link } from '@tanstack/react-router'
import { useStorefrontFaqs } from '@rackvise/storefront-sdk'
import { LifeBuoyIcon } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'
import { Button } from '#/components/ui/button'
import { EmptyState, ErrorState, Spinner } from '#/components/storefront/states'
import { useLocale, useT, localized } from '#/lib/i18n'
import { APP_TITLE, SITE_URL } from '#/env'
import { Markdown } from '#/components/storefront/markdown'

export const Route = createFileRoute('/faq')({
  head: ({ match }) => {
    const siteName = match.context.config?.name || APP_TITLE
    return {
      meta: [
        { title: `FAQ — ${siteName}` },
        {
          name: 'description',
          content: 'Find answers to frequently asked questions about ordering, shipping, payments, and more.',
        },
        { property: 'og:title', content: `FAQ — ${siteName}` },
        {
          property: 'og:description',
          content: 'Find answers to frequently asked questions about ordering, shipping, payments, and more.',
        },
        { property: 'og:url', content: `${SITE_URL}/faq` },
      ],
      links: [{ rel: 'canonical', href: `${SITE_URL}/faq` }],
    }
  },
  component: FaqPage,
})

function FaqPage() {
  const t = useT()
  const { locale } = useLocale()
  const { data: faqs, isLoading, isError, refetch } = useStorefrontFaqs()

  const active = (faqs ?? []).filter((f) => f.isActive)

  return (
    <div className="page-wrap py-12">
      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-lagoon-tint text-lagoon-deep">
          <LifeBuoyIcon className="size-6" />
        </span>
        <h1 className="display-title text-4xl font-semibold text-foreground sm:text-5xl">
          {t.faq.title}
        </h1>
        <p className="text-base text-muted-foreground">{t.faq.sub}</p>
      </header>

      <div className="mx-auto mt-12 max-w-2xl">
        {isLoading ? (
          <Spinner className="min-h-32" />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : active.length === 0 ? (
          <EmptyState
            icon="box"
            title={t.shop.noResults}
            action={
              <Button asChild>
                <Link to="/shop">{t.actions.backToShop}</Link>
              </Button>
            }
          />
        ) : (
          <Accordion
            type="single"
            collapsible
            className="rounded-2xl border border-line bg-card px-5"
          >
            {active.map((faq) => {
              const q = localized(faq, 'question', locale)
              const a = localized(faq, 'answer', locale)
              return (
                <AccordionItem key={faq.id} value={String(faq.id)}>
                  <AccordionTrigger>{q}</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm prose-stone max-w-none dark:prose-invert">
                      <Markdown content={a} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        )}

        {active.length > 0 && (
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: active.map((faq) => ({
                  '@type': 'Question',
                  name: localized(faq, 'question', locale),
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: localized(faq, 'answer', locale),
                  },
                })),
              }),
            }}
          />
        )}
      </div>
    </div>
  )
}
