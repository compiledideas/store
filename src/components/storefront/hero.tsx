import { Link } from '@tanstack/react-router'
import { ArrowRightIcon, ShieldCheckIcon, TruckIcon } from 'lucide-react'
import {
  useStorefrontHero,
  useStorefrontTopSellingProducts,
} from '@rackvise/storefront-sdk'

import { Button } from '#/components/ui/button'
import { ProductImage } from './product-image'
import { localized, useLocale, useT } from '#/lib/i18n'
import { primaryImage } from '#/lib/format'

export function Hero() {
  const t = useT()
  const { locale } = useLocale()
  const { data: hero } = useStorefrontHero()
  const { data: top } = useStorefrontTopSellingProducts({ enabled: true })

  const title = localized(hero, 'title', locale) || t.brand.tagline
  const subtitle = localized(hero, 'subtitle', locale)
  const badge =
    localized(hero, 'heroBadge', locale) || t.brand.tagline

  const heroImg = hero?.imageUrl ?? undefined
  const collage = (top ?? []).slice(0, 3)

  return (
    <section className="page-wrap pt-10 sm:pt-14">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="rise-in space-y-6 lg:pr-6">
          {badge && (
            <span className="inline-flex items-center gap-2 rounded-full border border-lagoon/30 bg-lagoon-tint px-3 py-1 text-xs font-semibold text-lagoon-deep">
              <span className="size-1.5 rounded-full bg-lagoon-deep" />
              {badge}
            </span>
          )}
          <h1 className="display-title text-4xl font-semibold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/shop">
                {t.home.heroCta}
                <ArrowRightIcon className="size-4 rtl:-scale-x-100" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full"
            >
              <Link to="/promo">{t.home.heroSecondary}</Link>
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-3 pt-4 text-sm text-muted-foreground">
            <li className="inline-flex items-center gap-2">
              <TruckIcon className="size-4 text-lagoon-deep" />
              {t.brand.announcement.split('—')[0]}
            </li>
            <li className="inline-flex items-center gap-2">
              <ShieldCheckIcon className="size-4 text-lagoon-deep" />
              {t.checkout.cod}
            </li>
          </ul>
        </div>

        <div className="rise-in relative">
          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              {collage[0] && (
                <ProductImage
                  src={heroImg ?? primaryImage(collage[0]) ?? undefined}
                  alt={title}
                  ratio="aspect-[4/5]"
                  className="rounded-3xl border border-line"
                />
              )}
              {collage[2] && (
                <ProductImage
                  src={primaryImage(collage[2]) ?? undefined}
                  alt={collage[2].name}
                  ratio="aspect-square"
                  className="rounded-3xl border border-line"
                />
              )}
            </div>
            <div className="pt-8">
              {collage[1] && (
                <ProductImage
                  src={primaryImage(collage[1]) ?? undefined}
                  alt={collage[1].name}
                  ratio="aspect-[4/5]"
                  className="rounded-3xl border border-line"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
