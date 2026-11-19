'use client'

import { SIDEBAR_PRIMARY, SIDEBAR_SPORTS_ALL, SIDEBAR_SPORTS_TOP } from './data'
import { psx } from './tokens'

export function PropShopSidebar() {
  return (
    <aside
      className="flex h-full w-[100px] shrink-0 flex-col border-r"
      style={{
        background: psx.sidebar,
        borderColor: psx.borderInvert,
      }}
      data-node-id="321:210005"
    >
      <div className="flex h-16 w-full items-center justify-center p-2">
        <div className="relative flex size-8 items-center justify-center" aria-label="PropShopX">
          <img
            src="/propshopx/sidebar/logo.svg"
            alt="PropShopX"
            width={36}
            height={26}
            className="h-[26px] w-9"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-6 pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-full flex-col gap-1.5">
          {SIDEBAR_PRIMARY.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={item.id}
              className="relative flex h-[46px] w-full items-center justify-center overflow-hidden rounded-lg border border-transparent transition-colors"
              style={
                item.active
                  ? {
                      background: psx.primary,
                      borderColor: psx.borderInvert,
                    }
                  : undefined
              }
            >
              <span
                className="flex size-8 items-center justify-center rounded-md"
                style={
                  item.active
                    ? undefined
                    : { background: psx.surfaceMutedInvert }
                }
              >
                <img src={item.icon} alt="" width={21} height={21} className="size-5" />
              </span>
              {item.active ? (
                <span
                  className="absolute bottom-0 left-0 top-0 w-[3px]"
                  style={{ background: 'rgba(255,255,255,0.35)' }}
                />
              ) : null}
            </button>
          ))}
        </div>

        <div className="my-1 h-px w-full" style={{ background: 'rgba(255,255,255,0.08)' }} />

        <div className="flex w-full flex-col gap-1">
          {SIDEBAR_SPORTS_TOP.map((icon) => (
            <button
              key={icon}
              type="button"
              className="flex h-10 w-full items-center justify-center rounded-lg"
            >
              <img src={icon} alt="" width={20} height={20} className="size-5" />
            </button>
          ))}
        </div>

        <div className="my-1 h-px w-full" style={{ background: 'rgba(255,255,255,0.08)' }} />

        <div className="flex w-full flex-col gap-1">
          {SIDEBAR_SPORTS_ALL.map((icon, i) => (
            <button
              key={`${icon}-${i}`}
              type="button"
              className="flex h-10 w-full items-center justify-center rounded-lg"
            >
              <img src={icon} alt="" width={20} height={20} className="size-5" />
            </button>
          ))}
        </div>

        <div className="mt-auto flex w-full flex-col items-center pt-4">
          <button
            type="button"
            aria-label="Settings"
            className="flex h-10 w-full items-center justify-center rounded-lg"
          >
            <img
              src="/propshopx/sidebar/settings.svg"
              alt=""
              width={20}
              height={20}
              className="size-5 opacity-70"
            />
          </button>
        </div>
      </div>
    </aside>
  )
}
