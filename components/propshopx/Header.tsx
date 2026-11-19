'use client'

import { ChevronDown } from 'lucide-react'
import { psx } from './tokens'

const NAV = ['Casino', 'Sports', 'Live Betting', 'Poker', 'Promotions'] as const

export function PropShopHeader() {
  return (
    <header
      className="flex h-[68px] w-full shrink-0 items-center justify-between border-b px-6"
      style={{
        background: psx.header,
        borderColor: psx.borderInvert,
      }}
      data-node-id="321:210008"
    >
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          aria-label="Toggle sidebar"
          className="flex items-center justify-center rounded-lg p-2"
        >
          <img src="/propshopx/header/menu.svg" alt="" width={16} height={16} className="size-4" />
        </button>
        <div className="mx-1 h-5 w-px" style={{ background: 'rgba(255,255,255,0.12)' }} />
        <nav className="flex items-center gap-2">
          {NAV.map((label) => (
            <button
              key={label}
              type="button"
              className="rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-white/5"
              style={{ color: psx.textInverse }}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-white/5"
            style={{ color: psx.textInverse }}
          >
            Other
            <ChevronDown className="size-3.5 opacity-70" />
          </button>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div
          className="flex h-9 items-center overflow-hidden rounded-lg border pl-1.5"
          style={{
            background: 'rgba(250,250,250,0.05)',
            borderColor: psx.borderInvert,
            color: psx.textInverse,
          }}
        >
          <span className="px-1 text-xs font-medium tabular-nums">
            $&nbsp;100,000.00
          </span>
          <button
            type="button"
            aria-label="Wallet"
            className="flex h-9 items-center justify-center px-2.5"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <img src="/propshopx/header/wallet.svg" alt="" width={16} height={16} className="size-4" />
          </button>
        </div>

        <button
          type="button"
          aria-label="VIP"
          className="flex items-center justify-center rounded-lg border p-2.5 opacity-80"
          style={{
            background: psx.vipGoldBg,
            borderColor: psx.vipGoldBorder,
          }}
        >
          <img src="/propshopx/header/crown.svg" alt="" width={16} height={16} className="size-4" />
        </button>

        <button
          type="button"
          aria-label="Account"
          className="relative flex items-center justify-center rounded-lg border p-2.5"
          style={{
            background: 'rgba(250,250,250,0.05)',
            borderColor: psx.borderInvert,
          }}
        >
          <img src="/propshopx/header/user.svg" alt="" width={16} height={16} className="size-4" />
          <span
            className="absolute right-0 top-0 size-[5.33px] rounded-full border-[1.33px]"
            style={{
              background: psx.destructive,
              borderColor: '#1a1a1a',
            }}
          />
        </button>
      </div>
    </header>
  )
}
