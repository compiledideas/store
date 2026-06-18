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

export const Route = createFileRoute('/faq')({ component: FaqPage })

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
                  <AccordionContent>{a}</AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        )}
      </div>
    </div>
  )
}
