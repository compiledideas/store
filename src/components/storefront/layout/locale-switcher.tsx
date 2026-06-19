import { CheckIcon, GlobeIcon } from 'lucide-react'

import { LOCALES, useLocale } from '#/lib/i18n'
import type { Locale } from '#/lib/i18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'

export function LocaleSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale()
  return (
    <div className={className}>
      <Select
        value={locale}
        onValueChange={(v) => setLocale(v as Locale)}
      >
        <SelectTrigger
          size="sm"
          aria-label="Language"
          className="gap-2 bg-transparent px-2 text-sm font-semibold text-foreground hover:bg-accent"
        >
          <GlobeIcon className="size-4 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {LOCALES.map((l) => (
            <SelectItem key={l.code} value={l.code}>
              <span className="flex items-center gap-2">
                <span className="w-14">{l.label}</span>
                {/* {l.code === locale && (
                  <CheckIcon className="size-3.5 text-lagoon-deep" />
                )} */}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
