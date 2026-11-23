'use client'

import { useState, startTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import {
  LEAGUE_SECTIONS,
  QUICK_LINKS,
  SPORT_TABS,
  type EventRow,
  type OddsCell,
} from './data'
import { PropShopHeader } from './Header'
import { PropShopSidebar } from './Sidebar'
import { psx } from './tokens'

/** Shared width for every odds/price button across markets and events. */
const PRICE_BTN_WIDTH_PX = 72

function OddsButton({
  cell,
  selected,
  onToggle,
}: {
  cell: OddsCell
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-md px-1.5 py-1.5 text-center transition-all duration-150"
      style={{
        width: PRICE_BTN_WIDTH_PX,
        background: selected ? 'rgba(238,53,54,0.12)' : 'rgba(0,0,0,0.06)',
        boxShadow: selected ? `inset 0 0 0 1.5px ${psx.primary}` : undefined,
        color: psx.textPrimary,
      }}
    >
      <span className="w-full truncate text-[10px] font-medium leading-[14px] opacity-60">{cell.label}</span>
      <span className="text-xs font-semibold leading-4 tabular-nums">{cell.odds}</span>
    </button>
  )
}

function TeamCrest({ color, abbr }: { color: string; abbr: string }) {
  return (
    <span
      className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white"
      style={{ background: color }}
      aria-hidden
    >
      {abbr.slice(0, 1)}
    </span>
  )
}

function EventScoreboard({
  event,
  selected,
  onSelect,
}: {
  event: EventRow
  selected: Set<string>
  onSelect: (key: string) => void
}) {
  return (
    <div className="flex min-w-0 items-stretch gap-3 px-3 py-3 md:gap-4 md:px-4">
      <div className="flex w-[200px] shrink-0 flex-col justify-center gap-1.5">
        <span className="text-[11px] font-medium leading-4" style={{ color: psx.textMuted }}>
          {event.time}
        </span>
        <div className="flex items-center gap-2">
          <TeamCrest color={event.home.crest} abbr={event.home.abbr} />
          <span className="truncate text-sm font-semibold" style={{ color: psx.textPrimary }}>
            {event.home.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TeamCrest color={event.away.crest} abbr={event.away.abbr} />
          <span className="truncate text-sm font-semibold" style={{ color: psx.textPrimary }}>
            {event.away.name}
          </span>
        </div>
      </div>

      <div
        className="grid min-w-0 flex-1 gap-2 overflow-x-auto pb-0.5 [scrollbar-width:thin]"
        style={{
          gridTemplateColumns: `repeat(${event.markets.length}, minmax(0, 1fr))`,
        }}
      >
        {event.markets.map((market) => (
          <div key={market.title} className="flex min-w-0 flex-col gap-1">
            <span
              className="truncate text-center text-[10px] font-medium leading-[14px]"
              style={{ color: psx.textMuted }}
            >
              {market.title}
            </span>
            <div className="flex justify-center gap-1">
              {market.cells.map((cell) => {
                const key = `${event.id}:${market.title}:${cell.label}:${cell.odds}`
                return (
                  <OddsButton
                    key={key}
                    cell={cell}
                    selected={selected.has(key)}
                    onToggle={() => onSelect(key)}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SportsbookApp() {
  const [sportTab, setSportTab] = useState('soccer')
  const [viewTab, setViewTab] = useState<'Games' | 'Outrights' | 'All Leagues'>('Games')
  const [quickLink, setQuickLink] = useState('all')
  const [selectedOdds, setSelectedOdds] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ epl: true, laliga: true })

  const toggleOdd = (key: string) => {
    startTransition(() => {
      setSelectedOdds((prev) => {
        const next = new Set(prev)
        if (next.has(key)) next.delete(key)
        else next.add(key)
        return next
      })
    })
  }

  return (
    <div
      className="flex h-[100dvh] w-full overflow-hidden"
      style={{ background: psx.contentBg, fontFamily: 'var(--font-figtree), Figtree, sans-serif' }}
      data-node-id="321:210004"
      data-page-bg
    >
      <PropShopSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <PropShopHeader />

        <main className="relative min-h-0 flex-1 overflow-y-auto">
          {/* Soft atmospheric wash behind content */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 20% 0%, rgba(238,53,54,0.06), transparent 55%), linear-gradient(180deg, #ECECEC 0%, #F5F5F5 70%)',
            }}
          />

          <div className="relative mx-auto flex w-full max-w-[1340px] flex-col gap-5 px-6 pb-16 pt-0">
            {/* Sport tabs */}
            <div className="flex gap-2 pt-3" data-node-id="464:169233">
              {SPORT_TABS.map((tab) => {
                const active = sportTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSportTab(tab.id)}
                    className="relative flex h-[52px] flex-col items-center justify-center gap-1 rounded-md px-[14px] transition-colors"
                    style={{
                      background: active ? 'rgba(0,0,0,0.1)' : 'transparent',
                      color: active ? psx.textPrimary : psx.textMuted,
                    }}
                  >
                    <img src={tab.icon} alt="" width={20} height={20} className="size-5" />
                    <span className="text-xs font-medium leading-4">{tab.label}</span>
                    {active ? (
                      <motion.span
                        layoutId="sport-underline"
                        className="absolute -bottom-2 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full"
                        style={{ background: psx.primary }}
                      />
                    ) : null}
                  </button>
                )
              })}
            </div>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2.5" data-node-id="442:47098">
              <button
                type="button"
                aria-label="Back"
                className="flex size-7 items-center justify-center rounded-md border bg-white"
                style={{ borderColor: psx.borderLight, color: psx.textPrimary }}
              >
                <ArrowLeft className="size-3.5" />
              </button>
              <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: psx.textPrimary }}>
                <span>Soccer</span>
                <span style={{ color: psx.textMuted }}>/</span>
                <button type="button" className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-black/5">
                  Select Country
                  <ChevronDown className="size-3.5 opacity-60" />
                </button>
                <span style={{ color: psx.textMuted }}>/</span>
                <button type="button" className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-black/5">
                  Select League
                  <ChevronDown className="size-3.5 opacity-60" />
                </button>
              </div>
            </div>

            {/* Quick links */}
            <div
              className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              data-node-id="442:162477"
            >
              {QUICK_LINKS.map((link) => {
                const active = quickLink === link.id
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => setQuickLink(link.id)}
                    className="flex size-20 shrink-0 flex-col items-center justify-center rounded-md bg-white px-2 transition-transform duration-200 hover:-translate-y-0.5"
                    style={{
                      boxShadow: psx.shadowCard,
                      outline: active ? `2px solid ${psx.primary}` : undefined,
                      outlineOffset: 1,
                    }}
                  >
                    <img src={link.icon} alt="" width={36} height={36} className="size-9 object-contain" />
                    <span
                      className="mt-0.5 line-clamp-2 h-7 w-16 text-center text-[10px] leading-[14px]"
                      style={{ color: psx.textPrimary }}
                    >
                      {link.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Games / Outrights / All Leagues */}
            <div
              className="inline-flex w-fit items-center rounded-full p-0.5"
              style={{ background: 'rgba(0,0,0,0.06)' }}
            >
              {(['Games', 'Outrights', 'All Leagues'] as const).map((tab) => {
                const active = viewTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setViewTab(tab)}
                    className="relative rounded-full px-3.5 py-2 text-sm transition-colors"
                    style={{
                      color: active ? '#fff' : psx.textPrimary,
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    {active ? (
                      <motion.span
                        layoutId="view-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: psx.primary }}
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative z-10">{tab}</span>
                  </button>
                )
              })}
            </div>

            {/* League sections / alternate views */}
            {viewTab !== 'Games' ? (
              <div
                className="flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-xl bg-white px-6 py-16 text-center"
                style={{ boxShadow: psx.shadowCard, color: psx.textMuted }}
              >
                <p className="text-base font-semibold" style={{ color: psx.textPrimary }}>
                  {viewTab}
                </p>
                <p className="max-w-md text-sm">
                  {viewTab === 'Outrights'
                    ? 'Tournament winners, season specials, and futures markets will appear here.'
                    : 'Browse every soccer competition from one list.'}
                </p>
              </div>
            ) : null}

            <AnimatePresence mode="popLayout">
              {viewTab === 'Games' &&
              LEAGUE_SECTIONS.filter(
                (s) => quickLink === 'all' || quickLink === s.id,
              ).map((section) => (
                <motion.section
                  key={section.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={section.logo}
                        alt=""
                        width={20}
                        height={20}
                        className="size-5 object-contain"
                      />
                      <h2 className="text-base font-semibold" style={{ color: psx.textPrimary }}>
                        {section.name}
                      </h2>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-sm font-medium"
                      style={{ color: psx.textMuted }}
                    >
                      See All
                      <ChevronRight className="size-4" />
                    </button>
                  </div>

                  <div
                    className="overflow-hidden rounded-xl bg-white"
                    style={{ boxShadow: psx.shadowCard }}
                  >
                    {(expanded[section.id]
                      ? section.events
                      : section.events.slice(0, 3)
                    ).map((event, idx, arr) => (
                      <div key={event.id}>
                        <EventScoreboard
                          event={event}
                          selected={selectedOdds}
                          onSelect={toggleOdd}
                        />
                        {idx < arr.length - 1 ? (
                          <div className="h-px w-full" style={{ background: 'rgba(0,0,0,0.08)' }} />
                        ) : null}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [section.id]: !prev[section.id],
                        }))
                      }
                      className="inline-flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium transition-colors hover:bg-black/5"
                      style={{ color: psx.textMuted }}
                    >
                      {expanded[section.id]
                        ? 'Show less'
                        : `Show ${section.moreCount} More`}
                      <ChevronDown
                        className={`size-3.5 transition-transform ${expanded[section.id] ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </motion.section>
              ))}
            </AnimatePresence>

            {selectedOdds.size > 0 ? (
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-xl px-4 py-3 text-white shadow-lg"
                style={{ background: psx.primary }}
              >
                <span className="text-sm font-semibold">
                  {selectedOdds.size} selection{selectedOdds.size > 1 ? 's' : ''}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedOdds(new Set())}
                  className="rounded-md bg-white/15 px-2.5 py-1 text-xs font-medium"
                >
                  Clear
                </button>
              </motion.div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}
