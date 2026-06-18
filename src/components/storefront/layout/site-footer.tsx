import { useState  } from 'react'
import type {FormEvent} from 'react';
import { Link } from '@tanstack/react-router'
import { SendIcon } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { useT } from '#/lib/i18n'
import { APP_TITLE } from '#/env'
import { toast } from '#/lib/toast'

export function SiteFooter() {
  const t = useT()
  const [email, setEmail] = useState('')

  const onSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    toast.success(t.footer.newsletterSub)
    setEmail('')
  }

  return (
    <footer className="mt-24 border-t border-line bg-sand/50">
      <div className="page-wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-lagoon-deep text-background">
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 7h18l-2 11a2 2 0 0 1-2 1.7H7A2 2 0 0 1 5 18z" />
                <path d="M8 7V6a4 4 0 0 1 8 0v1" />
              </svg>
            </span>
            <span className="display-title text-lg font-bold text-foreground">
              {APP_TITLE}
            </span>
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            {t.brand.tagline}
          </p>
        </div>

        <FooterCol title={t.footer.shop}>
          <FooterLink to="/shop">{t.nav.shop}</FooterLink>
          <FooterLink to="/promo">{t.nav.promos}</FooterLink>
          <FooterLink to="/category">{t.nav.categories}</FooterLink>
        </FooterCol>

        <FooterCol title={t.footer.support}>
          <FooterLink to="/faq">{t.nav.faq}</FooterLink>
          <FooterLink to="/stores">{t.nav.stores}</FooterLink>
          <FooterLink to="/about">{t.nav.about}</FooterLink>
        </FooterCol>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">
            {t.footer.newsletter}
          </h4>
          <p className="text-sm text-muted-foreground">
            {t.footer.newsletterSub}
          </p>
          <form onSubmit={onSubscribe} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.footer.emailPlaceholder}
              aria-label={t.footer.emailPlaceholder}
              className="h-10 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-lagoon-deep"
            />
            <Button type="submit" size="icon" aria-label={t.footer.subscribe} className="rounded-full">
              <SendIcon className="size-4 rtl:-scale-x-100" />
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="page-wrap flex flex-col items-center justify-between gap-2 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-start">
          <p>
            © {new Date().getFullYear()} {APP_TITLE}. {t.footer.rights}
          </p>
          <p>{t.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  )
}

function FooterLink({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm text-muted-foreground transition-colors hover:text-lagoon-deep"
      >
        {children}
      </Link>
    </li>
  )
}
