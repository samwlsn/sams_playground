import type { Metadata } from 'next'
import { HideGlobalChrome } from '@/components/propshopx/HideGlobalChrome'

export const metadata: Metadata = {
  title: 'PropShopX Sportsbook',
  description: 'PropShopX soccer sportsbook — Games, leagues, and live odds',
}

export default function PropShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="propshopx-root light" data-theme="light">
      <HideGlobalChrome />
      {children}
    </div>
  )
}
