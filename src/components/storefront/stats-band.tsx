import type { StorefrontStats } from '@rackvise/storefront-sdk'
import { BoxesIcon, PackageCheckIcon, ShoppingCartIcon, WarehouseIcon } from 'lucide-react'

import { formatCount } from '#/lib/format'
import { useT } from '#/lib/i18n'

export function StatsBand({ stats }: { stats: StorefrontStats }) {
  const t = useT()
  const items = [
    {
      icon: BoxesIcon,
      label: t.home.statsProducts,
      value: stats.totalProducts,
    },
    {
      icon: WarehouseIcon,
      label: t.home.statsStock,
      value: stats.totalStock,
    },
    {
      icon: PackageCheckIcon,
      label: t.home.statsDelivered,
      value: stats.deliveredOrders,
    },
    {
      icon: ShoppingCartIcon,
      label: t.home.statsOnline,
      value: stats.onlineOrders,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-card p-6 sm:grid-cols-4 sm:p-8">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-2 text-center">
          <span className="grid size-10 place-items-center rounded-full bg-lagoon-tint text-lagoon-deep">
            <item.icon className="size-5" />
          </span>
          <span className="display-title text-2xl font-bold text-foreground sm:text-3xl">
            {formatCount(item.value)}
          </span>
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
